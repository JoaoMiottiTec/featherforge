import { z } from 'zod'

const Email = z.string().email().trim().toLowerCase()
const Password = z.string().min(8).max(72)

export const Sex = z.enum(['male', 'female', 'other'])
export const ActivityLevel = z.enum(['low', 'medium', 'high'])

const Goal = z.string().trim().max(200)

const Injuries = z.array(z.string().trim().max(60)).max(10)

const profileCreateSchema = z.object({
  age: z.coerce.number().int().min(0).max(120).optional(),
  sex: Sex.optional(),
  heightCm: z.coerce.number().int().min(50).max(260).optional(),
  weightKg: z.coerce.number().int().min(20).max(500).optional(),
  targetWeightKg: z.coerce.number().int().min(20).max(500).optional(),
  activityLevel: ActivityLevel.optional(),
  goal: Goal.optional(),
  injuries: Injuries.optional(),
}).strict()

const profileUpdateSchema = z.object({
  age: z.coerce.number().int().min(0).max(120).nullable().optional(),
  sex: Sex.nullable().optional(),
  heightCm: z.coerce.number().int().min(50).max(260).nullable().optional(),
  weightKg: z.coerce.number().int().min(20).max(500).nullable().optional(),
  targetWeightKg: z.coerce.number().int().min(20).max(500).nullable().optional(),
  activityLevel: ActivityLevel.nullable().optional(),
  goal: Goal.nullable().optional(),
  injuries: Injuries.optional(),
}).strict()

export const signupSchema = z.object({
  email: Email,
  password: Password,
  confirmPassword: z.string(),
  profile: profileCreateSchema.optional(),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
}).strict()

export const loginSchema = z.object({
  email: Email,
  password: z.string().min(1),
}).strict()

export const userUpdateSchema = z.object({
  email: Email.optional(),
  profile: profileUpdateSchema.optional(),
}).strict()
