import type { FastifyInstance } from 'fastify';
import { sessionRoutes } from 'modules/sections/routes.js';
import { authRoutes } from 'modules/users/routes.js';

export async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(sessionRoutes, { prefix: '/sessions' });
}
