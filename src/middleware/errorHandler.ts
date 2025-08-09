import type { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
    const status = (error as any)?.status ?? error.statusCode ?? 500
    const message = error.message || 'Internal Server Error'
    reply.status(status).send({
      status: 'error',
      message,
    })
  })
}
