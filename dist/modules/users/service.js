import argon2 from 'argon2';
import { prisma } from '../../database/client.js';
import { conflict, notFound, unauthorized } from '../../core/errors.js';
import { userSelect, userWithPasswordSelect } from './select.js';
import { mapProfileCreate, mapProfileUpsert } from './helpers.js';
export const userService = {
    async create(input) {
        const exists = await prisma.user.findUnique({ where: { email: input.email } });
        if (exists)
            throw conflict('Email already registered');
        const hash = await argon2.hash(input.password);
        const created = await prisma.user.create({
            data: {
                email: input.email,
                password: hash,
                profile: mapProfileCreate(input.profile),
            },
            select: userSelect,
        });
        return created;
    },
    async findById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: userSelect,
        });
        if (!user)
            throw notFound('User not found');
        return user;
    },
    async findWithPasswordByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
            select: userWithPasswordSelect,
        });
    },
    async list(page = 1, pageSize = 20) {
        const [items, total] = await Promise.all([
            prisma.user.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                select: userSelect,
            }),
            prisma.user.count(),
        ]);
        return { items, total, page, pageSize };
    },
    async update(id, input) {
        const current = await prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!current)
            throw notFound('User not found');
        try {
            const updated = await prisma.user.update({
                where: { id },
                data: {
                    email: input.email ?? undefined,
                    profile: mapProfileUpsert(input.profile),
                },
                select: userSelect,
            });
            return updated;
        }
        catch (err) {
            if (err?.code === 'P2002' && err?.meta?.target?.includes('email')) {
                throw conflict('Email already registered');
            }
            throw err;
        }
    },
    async remove(id) {
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
        if (!user)
            throw notFound('User not found');
        await prisma.user.delete({ where: { id } });
        return { deleted: true };
    },
    async verifyLogin(input) {
        const user = await prisma.user.findUnique({
            where: { email: input.email },
            select: userWithPasswordSelect,
        });
        if (!user)
            throw unauthorized('Invalid credentials');
        const ok = await argon2.verify(user.password, input.password);
        if (!ok)
            throw unauthorized('Invalid credentials');
        const safe = await prisma.user.findUnique({
            where: { id: user.id },
            select: userSelect,
        });
        if (!safe)
            throw notFound('User not found');
        return safe;
    },
};
