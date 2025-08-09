import { AppError } from './errors.js';
export function asyncHandler(fn) {
    return async (req, reply) => {
        try {
            return await fn(req, reply);
        }
        catch (err) {
            if (err instanceof AppError) {
                return reply.status(err.status).send({
                    status: 'error',
                    message: err.message,
                    details: err.details,
                });
            }
            req.log.error(err);
            throw err;
        }
    };
}
