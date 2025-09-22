import type { FastifyBaseLogger } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    _startAt?: bigint;
    requestLog?: FastifyBaseLogger;
  }
}
