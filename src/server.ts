import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import Fastify from 'fastify';

import { registerErrorHandler } from './middleware/errorHandler.js';
import { jwtPlugin } from './plugins/jwt.js';
import { registerRoutes } from './routes/index.js';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});

const PORT = Number(process.env.PORT);
const HOST = '0.0.0.0';

const app = Fastify({ logger: true });
registerErrorHandler(app);

await app.register(jwtPlugin);
await app.register(registerRoutes);

app.get('/', () => {
  return { message: 'Servidor Fastify rodando 🚀' };
});


await app.register(registerRoutes, { prefix: '/api/v1' });

try {
  await app.listen({ port: PORT, host: HOST });
} catch (err) {
  app.log.error(err);
  Sentry.captureException(err);
  process.exit(1);
}

export default app;
