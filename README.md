# Library Management System

Веб-приложение для библиотеки: каталог, заказы книг, роли пользователя и библиотекаря.

## Стек

- Frontend: React + TypeScript + Vite + Nginx (в production)
- Backend: NestJS + Prisma
- База данных: PostgreSQL
- Оркестрация: Docker Compose

## Локальный запуск (dev)

```bash
pnpm install
pnpm dev
```

Фронтенд: `http://localhost:5173`

## Production / VPS деплой (Docker)

Ниже инструкция, чтобы без проблем поднять проект на арендуемом VPS.

### 1) Подготовка сервера

Установите Docker и Compose plugin:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Перелогиньтесь после `usermod`, чтобы команда `docker` работала без `sudo`.

### 2) Клонирование проекта

```bash
git clone <YOUR_REPO_URL> diploma
cd diploma
```

### 3) Настройка env

```bash
cp .env.example .env
```

Обязательно задайте в `.env`:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL` (ваш домен, например `http://your-domain.com` или `https://your-domain.com`)

По умолчанию:

- PostgreSQL и backend доступны только локально на VPS (`127.0.0.1`)
- наружу открыт только frontend (`80` порт)
- внешний порт PostgreSQL: `15432` (внутри контейнера всегда `5432`)

### 4) Первый запуск

```bash
docker compose pull
docker compose build
docker compose up -d
docker compose ps
```

Проверка:

```bash
curl -I http://localhost/
curl -I http://localhost/api/docs
```

### 5) Обновление на VPS (после git pull)

```bash
git pull
docker compose build
docker compose up -d
docker image prune -f
```

### 6) Полезные команды

Логи:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Рестарт:

```bash
docker compose restart
docker compose restart backend
```

Остановка:

```bash
docker compose down
```

Остановка с удалением данных БД:

```bash
docker compose down -v
```

## Что уже настроено для production

- Healthcheck для `db` и `backend`
- Frontend Nginx проксирует `/api` и `/uploads` в backend
- Prisma миграции запускаются автоматически при старте backend (`MIGRATE_ON_START=true`)
- Все важные значения вынесены в `.env`

## Рекомендации для реального продакшена

- Использовать домен + reverse proxy (Nginx/Caddy) + SSL (Let's Encrypt)
- Закрыть лишние порты в firewall (UFW/Cloud Firewall)
- Настроить бэкапы volume `postgres_data`

