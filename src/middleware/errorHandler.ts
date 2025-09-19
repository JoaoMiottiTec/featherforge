import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { FastifyError } from 'fastify'
import * as Sentry from '@sentry/node'
import { AppError } from '../core/errors.js'

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(
    (error: FastifyError | Error, req: FastifyRequest, reply: FastifyReply) => {
      const route = (req.routeOptions?.url ?? req.url) as string
      const method = req.method
      const fastifyStatus =
        typeof (error as FastifyError).statusCode === 'number'
          ? (error as FastifyError).statusCode
          : undefined

      if (error instanceof AppError) {
        Sentry.captureMessage(error.message, {
          level: 'warning',
          tags: { method, route, kind: 'AppError' },
          extra: { details: error.details },
          fingerprint: ['AppError', route, error.message],
        })

        const status = Number.isInteger(error.status) ? error.status : 400
        const body = {
          status: 'error' as const,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        }
        void reply.status(status).send(body)
        return
      }

      const status = fastifyStatus ?? 500
      Sentry.captureException(error, {
        level: 'error',
        tags: { method, route, status: String(status) },
        extra: {
          params: req.params,
          query: req.query,
          body: req.body,
          headers: req.headers,
        },
        fingerprint: [error.name || 'Error', route],
      })

      void reply.status(status).send({
        status: 'error' as const,
        message: error.message,
      })
    },
  )
}
