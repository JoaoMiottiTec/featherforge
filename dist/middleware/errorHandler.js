export function registerErrorHandler(app) {
    app.setErrorHandler((error, _req, reply) => {
        const status = error?.status ?? error.statusCode ?? 500;
        const message = error.message || 'Internal Server Error';
        reply.status(status).send({
            status: 'error',
            message,
        });
    });
}
