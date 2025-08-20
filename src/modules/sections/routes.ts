import type { FastifyInstance } from 'fastify';

export function sessionRoutes(app: FastifyInstance) {
  app.get('/', () => {
    return { message: 'Listar sessões (mock)' };
  });

  app.post('/', () => {
    return { message: 'Criar nova sessão (mock)' };
  });
}
