import './config/env.js';
import './instrumentation/sentry.js';
import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import Fastify from 'fastify';
import pino from 'pino';

import { Sentry } from './instrumentation/sentry.js';
import { registerErrorHandler } from './middleware/errorHandler.js';
import { jwtPlugin } from './plugins/jwt.js';
import { requestLoggingPlugin } from './plugins/request-logging.js';
import { registerRoutes } from './routes/index.js';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.token',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]',
    },
    base: {
      service: 'featherforge',
      env: process.env.NODE_ENV,
      version: process.env.SENTRY_RELEASE,
    },
    timestamp: pino.stdTimeFunctions.epochTime,
  },

  genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'requestId',

  disableRequestLogging: true,
});

registerErrorHandler(app);

await app.register(jwtPlugin);
await app.register(requestLoggingPlugin);

app.get('/', () => {
  return { message: 'Servidor Fastify rodando 🚀' };
});

await app.register(registerRoutes, { prefix: '/api/v1' });

const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';

try {
  await app.listen({ port: PORT, host: HOST });
} catch (err) {
  app.log.error(err);
  Sentry.captureException(err);
  process.exit(1);
}

export default app;
