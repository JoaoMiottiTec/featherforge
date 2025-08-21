import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '../../src/database/client.js';
import { userService } from '../../src/modules/users/service.js';

vi.mock('../../src/database/client.js', () => {
  const prisma = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
  };
  return { prisma };
});

vi.mock('argon2', () => {
  return {
    default: {
      hash: vi.fn(),
      verify: vi.fn(),
    },
  };
});

const anyId = 'u_123';
const baseUser = {
  id: anyId,
  email: 'john@example.com',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
  profile: {
    age: 25,
    sex: 'male',
    heightCm: 180,
    weightKg: 80,
    targetWeightKg: 75,
    activityLevel: 'medium',
    goal: 'Get fitter',
    injuries: [],
  },
};
const userWithPassword = { ...baseUser, password: 'hashed_pw' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('userService.create', () => {
  it('lança conflito se email já existir', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(baseUser);

    await expect(
      userService.create({
        email: baseUser.email,
        password: 'secret',
        confirmPassword: 'secret',
        profile: { age: 25, sex: 'male' },
      })
    ).rejects.toThrow('Email already registered');

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('cria usuário com senha hash', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    (argon2.hash as any).mockResolvedValue('hashed_pw');
    (prisma.user.create as any).mockResolvedValue(baseUser);

    const out = await userService.create({
      email: baseUser.email,
      password: 'secret',
      confirmPassword: 'secret',
      profile: { age: 25, sex: 'male' },
    });

    expect(argon2.hash).toHaveBeenCalledWith('secret');
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: baseUser.email,
          password: 'hashed_pw',
        }),
        select: expect.any(Object),
      })
    );
    expect(out).toEqual(baseUser);
  });
});

describe('userService.findById', () => {
  it('retorna usuário quando existe', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(baseUser);
    const out = await userService.findById(anyId);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: anyId },
      select: expect.any(Object),
    });
    expect(out).toEqual(baseUser);
  });

  it('lança notFound quando não existir', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    await expect(userService.findById(anyId)).rejects.toThrow('User not found');
  });
});

describe('userService.findWithPasswordByEmail', () => {
  it('retorna usuário com senha via email', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(userWithPassword);
    const out = await userService.findWithPasswordByEmail(baseUser.email);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: baseUser.email },
      select: expect.any(Object),
    });
    expect(out).toEqual(userWithPassword);
  });
});

describe('userService.list', () => {
  it('pagina corretamente', async () => {
    (prisma.user.findMany as any).mockResolvedValue([baseUser]);
    (prisma.user.count as any).mockResolvedValue(15);

    const page = 2;
    const pageSize = 5;
    const out = await userService.list(page, pageSize);

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      })
    );
    expect(prisma.user.count).toHaveBeenCalled();
    expect(out).toEqual({
      items: [baseUser],
      total: 15,
      page,
      pageSize,
    });
  });
});

describe('userService.update', () => {
  it('lança notFound se usuário não existir', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    await expect(
      userService.update(anyId, { email: 'new@example.com', profile: {} })
    ).rejects.toThrow('User not found');
  });

  it('lança conflito em P2002 (email duplicado)', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: anyId });

    const p2002: any = new Error('Unique constraint');
    Object.setPrototypeOf(
      p2002,
      Prisma.PrismaClientKnownRequestError.prototype
    );
    p2002.code = 'P2002';

    (prisma.user.update as any).mockRejectedValue(p2002);

    await expect(
      userService.update(anyId, { email: 'dup@example.com', profile: {} })
    ).rejects.toThrow('Email already registered');
  });

  it('atualiza quando válido', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: anyId });
    (prisma.user.update as any).mockResolvedValue({
      ...baseUser,
      email: 'new@example.com',
    });

    const out = await userService.update(anyId, {
      email: 'new@example.com',
      profile: {},
    });

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: anyId },
        data: expect.objectContaining({ email: 'new@example.com' }),
        select: expect.any(Object),
      })
    );
    expect(out.email).toBe('new@example.com');
  });
});

describe('userService.remove', () => {
  it('lança notFound se não existir', async () => {
    (prisma.user.findUnique as any).mockResolvedValue(null);
    await expect(userService.remove(anyId)).rejects.toThrow('User not found');
  });

  it('deleta quando existe', async () => {
    (prisma.user.findUnique as any).mockResolvedValue({ id: anyId });
    (prisma.user.delete as any).mockResolvedValue(undefined);

    const out = await userService.remove(anyId);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: anyId } });
    expect(out).toEqual({ deleted: true });
  });
});

describe('userService.verifyLogin', () => {
  it('lança unauthorized se email não encontrado', async () => {
    (prisma.user.findUnique as any).mockResolvedValueOnce(null);
    await expect(
      userService.verifyLogin({ email: baseUser.email, password: 'x' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('lança unauthorized se senha inválida', async () => {
    (prisma.user.findUnique as any)
      .mockResolvedValueOnce(userWithPassword)
      .mockResolvedValueOnce(baseUser);
    (argon2.verify as any).mockResolvedValue(false);

    await expect(
      userService.verifyLogin({ email: baseUser.email, password: 'wrong' })
    ).rejects.toThrow('Invalid credentials');
  });

  it('lança notFound se usuário sumir após verificar senha', async () => {
    (prisma.user.findUnique as any)
      .mockResolvedValueOnce(userWithPassword)
      .mockResolvedValueOnce(null);
    (argon2.verify as any).mockResolvedValue(true);

    await expect(
      userService.verifyLogin({ email: baseUser.email, password: 'ok' })
    ).rejects.toThrow('User not found');
  });

  it('retorna usuário safe quando credenciais válidas', async () => {
    (prisma.user.findUnique as any)
      .mockResolvedValueOnce(userWithPassword)
      .mockResolvedValueOnce(baseUser);
    (argon2.verify as any).mockResolvedValue(true);

    const out = await userService.verifyLogin({
      email: baseUser.email,
      password: 'ok',
    });

    expect(argon2.verify).toHaveBeenCalledWith('hashed_pw', 'ok');
    expect(out).toEqual(baseUser);
  });
});
