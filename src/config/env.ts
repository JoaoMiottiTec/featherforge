import path from 'node:path';

import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.prod'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.local';

const envPath = path.resolve(process.cwd(), envFile);
dotenv.config({ path: envPath });

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in ' + envFile);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  JWT_SECRET: process.env.JWT_SECRET,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_RELEASE: process.env.SENTRY_RELEASE,
};
