# 1. Среда сборки
FROM node:20-alpine AS builder

# Устанавливаем зависимости для работы Prisma и Sharp (необходимы в alpine)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем ВСЕ зависимости (включая dev для сборки)
RUN npm install

# Копируем остальной код
COPY . .

# Генерируем клиент Prisma
RUN npx prisma generate

# Собираем проект (из TS в JS)
RUN npm run build

# Удаляем лишние dev-зависимости, чтобы уменьшить образ
RUN npm prune --production

# 2. Среда запуска (финальный образ)
FROM node:20-alpine

WORKDIR /app

# Устанавливаем библиотеку для работы Prisma в рантайме
RUN apk add --no-cache openssl

# Копируем только то, что нужно для работы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Пробрасываем порт
EXPOSE 3000

# Запускаем через скрипт из package.json
CMD ["npm", "run", "start:prod"]