import pino from 'pino';

export const logger = pino({
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
});
