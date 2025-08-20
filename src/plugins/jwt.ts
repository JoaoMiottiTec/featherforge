import jwt from '@fastify/jwt';
import fp from 'fastify-plugin';

export const jwtPlugin = fp(async function (app) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES || '15m';

  if (!secret) throw new Error('JWT_SECRET is missing');

  await app.register(jwt, {
    secret,
    sign: { expiresIn },
    verify: { algorithms: ['HS256'] },
  });
});
