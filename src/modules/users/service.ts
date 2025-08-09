import argon2 from 'argon2'
import { prisma } from '../../database/client.js'
import {  conflict, notFound, unauthorized } from '../../core/errors.js'
import { LoginInput, SignupInput, UserUpdateInput } from './validation.js'

export const userService = {
  async create(input: SignupInput) {
    const exists = await prisma.user.findUnique({ where: { email: input.email } })
    if (exists) throw conflict('Email already registered')

    const hash = await argon2.hash(input.password)
    const created = await prisma.user.create({
      data: {
        email: input.email,
        password: hash,
        profile: input.profile
          ? {
              create: {
                age: input.profile.age ?? undefined,
                heightCm: input.profile.heightCm ?? undefined,
                weightKg: input.profile.weightKg ?? undefined,
                goal: input.profile.goal ?? undefined,
              },
            }
          : undefined,
      },
      include: { profile: true },
    })

    const { password, ...safe } = created as any
    return safe
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    })
    if (!user) throw notFound('User not found')
    const { password, ...safe } = user as any
    return safe
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })
  },

  async list(page = 1, pageSize = 20) {
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { profile: true },
      }),
      prisma.user.count(),
    ])
    const safe = items.map((u: any) => {
      const { password, ...rest } = u
      return rest
    })
    return { items: safe, total, page, pageSize }
  },

  async update(id: string, input: UserUpdateInput) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw notFound('User not found')

    const updated = await prisma.user.update({
      where: { id },
      data: {
        email: input.email ?? undefined,
        profile: input.profile
          ? {
              upsert: {
                create: {
                  age: input.profile.age ?? undefined,
                  heightCm: input.profile.heightCm ?? undefined,
                  weightKg: input.profile.weightKg ?? undefined,
                  goal: input.profile.goal ?? undefined,
                },
                update: {
                  age: input.profile.age ?? undefined,
                  heightCm: input.profile.heightCm ?? undefined,
                  weightKg: input.profile.weightKg ?? undefined,
                  goal: input.profile.goal ?? undefined,
                },
              },
            }
          : undefined,
      },
      include: { profile: true },
    })

    const { password, ...safe } = updated as any
    return safe
  },

  async remove(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw notFound('User not found')
    await prisma.user.delete({ where: { id } })
    return { deleted: true }
  },

  async verifyLogin(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) throw unauthorized('Invalid credentials')

    const ok = await argon2.verify(user.password, input.password)
    if (!ok) throw unauthorized('Invalid credentials')

    const { password, ...safe } = user as any
    return safe
  },
}
