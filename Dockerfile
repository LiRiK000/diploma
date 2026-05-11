FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Копируем файлы манифеста
COPY pnpm-lock.yaml ./
COPY package.json ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем остальной код
COPY . .

# Генерируем клиент Prisma
RUN npx prisma generate

# Собираем проект
RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "start:prod"]