FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend-nest/package.json ./backend-nest/

RUN pnpm install --frozen-lockfile

COPY backend-nest ./backend-nest

WORKDIR /app/backend-nest

# Prisma must have dummy env in build time
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public" npx prisma generate

RUN pnpm build


FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=builder /app /app

WORKDIR /app/backend-nest

RUN sed -i 's/\r$//' ./docker/entrypoint.sh

EXPOSE 4000

CMD ["sh", "./docker/entrypoint.sh"]