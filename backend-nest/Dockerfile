FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend-nest/package.json ./backend-nest/

RUN pnpm install --frozen-lockfile

COPY backend-nest ./backend-nest

# Генерируем клиент и билдим
WORKDIR /app/backend-nest
RUN npx prisma generate
RUN pnpm build

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy full built workspace to keep Prisma runtime intact.
COPY --from=builder /app /app
WORKDIR /app/backend-nest
RUN sed -i 's/\r$//' ./docker/entrypoint.sh

EXPOSE 4000

# App entrypoint with optional Prisma migrations.
CMD ["sh", "./docker/entrypoint.sh"]