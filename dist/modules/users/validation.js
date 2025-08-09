import { z } from 'zod';
export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
    profile: z
        .object({
        age: z.number().int().min(0).max(120).optional(),
        heightCm: z.number().int().min(50).max(260).optional(),
        weightKg: z.number().int().min(20).max(500).optional(),
        goal: z.string().max(200).optional(),
    })
        .optional(),
}).refine(d => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
export const userUpdateSchema = z.object({
    email: z.string().email().optional(),
    profile: z.object({
        age: z.number().int().min(0).max(120).nullable().optional(),
        heightCm: z.number().int().min(50).max(260).nullable().optional(),
        weightKg: z.number().int().min(20).max(500).nullable().optional(),
        goal: z.string().max(200).nullable().optional(),
    }).optional(),
});
