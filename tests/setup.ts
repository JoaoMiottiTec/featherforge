import 'dotenv/config';

process.env.TZ = 'UTC';

const noisy = ['prisma:', 'argon2:'] as const;
const origError = console.error;
console.error = (...args: unknown[]) => {
  if (noisy.some((n) => String(args[0]).includes(n))) return;
  origError(...args);
};
