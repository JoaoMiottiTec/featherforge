FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# ---- deps (production) ----
FROM base AS deps-prod
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --frozen-lockfile --prod

# ---- build ----
FROM base AS build
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --frozen-lockfile
COPY tsconfig.json ./
COPY prisma ./prisma
RUN pnpm prisma generate
COPY src ./src
RUN pnpm run build

# ---- dev (hot reload) ----
FROM node:20-alpine AS dev
WORKDIR /app
RUN apk add --no-cache bash libc6-compat openssl
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --frozen-lockfile
COPY prisma ./prisma
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN pnpm prisma generate
EXPOSE 3000
ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "pnpm", "run", "dev" ]

# ---- production ----
FROM node:20-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY package.json ./
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "node", "dist/server.js" ]