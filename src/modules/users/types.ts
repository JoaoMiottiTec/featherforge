import type z from 'zod';

import type { loginSchema, signupSchema, userUpdateSchema } from './validation.js';

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
