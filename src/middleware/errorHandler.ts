import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyError } from 'fastify';

import { AppError } from '../core/errors.js';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(
    (
      error: FastifyError | Error,
      _req: FastifyRequest,
      reply: FastifyReply
    ) => {
      if (error instanceof AppError) {
        const status = Number.isInteger(error.status) ? error.status : 400;
        const body = {
          status: 'error' as const,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        };
        void reply.status(status).send(body);
        return;
      }

      const fastifyStatus =
        typeof (error as FastifyError).statusCode === 'number'
          ? (error as FastifyError).statusCode
          : undefined;

      const status = fastifyStatus ?? 500;
      const message = error.message;

      void reply.status(status).send({
        status: 'error' as const,
        message,
      });
    }
  );
}
