import { FastifyInstance } from 'fastify'
import { sessionRoutes } from 'modules/sections/routes.js'

export async function registerRoutes(app: FastifyInstance) {
  app.register(sessionRoutes, { prefix: '/sessions' })
}
