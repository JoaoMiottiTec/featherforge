FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl


FROM base AS deps-prod
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM base AS build
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN npm run build

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

