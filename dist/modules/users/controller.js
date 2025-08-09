import { asyncHandler } from '../../core/asyncHandler.js';
import { userService } from './service.js';
import { loginSchema, signupSchema, userUpdateSchema } from './validation.js';
export const userController = {
    login: asyncHandler(async (req, reply) => {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(422).send({
                status: 'error',
                message: 'Validation failed',
                details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
            });
        }
        const user = await userService.verifyLogin(parsed.data);
        const token = await reply.jwtSign({ sub: user.id, email: user.email });
        return reply.status(200).send({ data: { user, token } });
    }),
    signup: asyncHandler(async (req, reply) => {
        const parsed = signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(422).send({
                status: 'error',
                message: 'Validation failed',
                details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
            });
        }
        const user = await userService.create(parsed.data);
        const token = await reply.jwtSign({ sub: user.id, email: user.email });
        return reply.status(201).send({ data: { user, token } });
    }),
    updateMe: asyncHandler(async (req, reply) => {
        const parsed = userUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(422).send({
                status: 'error',
                message: 'Validation failed',
                details: parsed.error.issues.map(i => ({ path: i.path, message: i.message })),
            });
        }
        const id = req.user.sub;
        const user = await userService.update(id, parsed.data);
        return reply.status(200).send({ data: user });
    }),
    me: asyncHandler(async (req) => {
        const id = req.user.sub;
        const user = await userService.findById(id);
        return { data: user };
    }),
    deleteMe: asyncHandler(async (req) => {
        const id = req.user.sub;
        const result = await userService.remove(id);
        return { data: result };
    }),
};
