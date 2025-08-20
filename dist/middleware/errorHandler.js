import { AppError } from 'core/errors.js';
export function registerErrorHandler(app) {
    app.setErrorHandler((error, _req, reply) => {
        if (error instanceof AppError) {
            const status = Number.isInteger(error.status) ? error.status : 400;
            const body = {
                status: 'error',
                message: error.message,
                ...(error.details ? { details: error.details } : {}),
            };
            void reply.status(status).send(body);
            return;
        }
        const fastifyStatus = typeof error.statusCode === 'number'
            ? error.statusCode
            : undefined;
        const status = fastifyStatus ?? 500;
        const message = error.message;
        void reply.status(status).send({
            status: 'error',
            message,
        });
    });
}
