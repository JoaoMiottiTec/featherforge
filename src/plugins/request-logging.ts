import type { FastifyInstance } from 'fastify';

export function requestLoggingPlugin(app: FastifyInstance) {
  app.addHook('onRequest', (req) => {
    const route = req.routeOptions.url ?? req.url;

    req.requestLog = req.log.child({
      requestId: req.id,
      method: req.method,
      route,
    });

    req.requestLog.info({ msg: 'request:start' });
    req._startAt = process.hrtime.bigint();
  });

  app.addHook('onResponse', (req, reply) => {
    const start = req._startAt;
    const tookMs = start
      ? Number(process.hrtime.bigint() - start) / 1e6
      : undefined;

    const log = req.requestLog ?? req.log;
    log.info({
      msg: 'request:end',
      status: reply.statusCode,
      took_ms: tookMs,
      content_length: String(reply.getHeader('content-length') ?? ''),
    });
  });
}
