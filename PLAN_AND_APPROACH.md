# План и подход к доработке проекта

Краткое резюме

- Проект: frontend (React + TanStack Query + Zustand + antd + PWA) и backend (NestJS + Prisma + JWT + bcrypt + cookies).
- Что уже есть: авторизация с JWT и refresh-token в cookie, RBAC (Roles guard), Prisma-модели (User, Cart, Review, Order и т.д.), фронт: поисковая логика, карзина, рецензии, виджетная сетка с drag&drop, PWA.

Цель этого плана

- Закрыть ключевые фичи диплома: полноценный flow заявки/выдачи/возврата книг с двухсторонними подтверждениями, уведомления/напоминания, архивирование, рекомендации, экспорт/импорт.

Приоритеты (быстрый список)

1. High: Реализовать полный flow заявки (создание заказа, генерация 8-значного кода, выдача библиотекарем, подтверждение пользователем, сдача книги).
2. High: Безопасность — валидация кода, права ролей, очистка refreshToken при логауте.
3. Medium: Уведомления и напоминания (email/in-app), cron/очередь для напоминаний о сроках.
4. Medium: Архивация старых заказов и списанных книг.
5. Medium: Кэширование (Redis / корректные настройки React Query).
6. Low: Импорт данных (Excel), экспорт отчетов (Excel/PDF), подписки на авторов/жанры.

Первый спринт — конкретные задачи (реализация заказа и выдачи)

- DB / Prisma
  - Проверить/добавить модели: `Order`, `OrderItem` (если нет) с полями: id, userId, items, status (NEW, APPROVED, ISSUED, RETURNED, ARCHIVED), code (nullable), codeExpiresAt, createdAt, updatedAt.
  - Миграция: `npx prisma migrate dev --name add-orders`

- Backend (файлы / эндпоинты)
  - Добавить модуль `order`: `backend-nest/src/order/order.module.ts`, `order.controller.ts`, `order.service.ts`.
  - Эндпоинты (пример):
    - POST `/orders` — создать заказ (из корзины) — роли: `USER`.
    - POST `/orders/:id/approve` — библиотекарь подтверждает заявку и генерирует код — роли: `LIBRARIAN`.
    - POST `/orders/:id/issue` — библиотекарь вводит код посетителя, сервер сверяет и выставляет статус ISSUED — роли: `LIBRARIAN`.
    - POST `/orders/:id/confirm-received` — пользователь подтверждает получение — роли: `USER`.
    - POST `/orders/:id/return` — инициировать сдачу; аналогичный flow подтверждений.
  - Реализация безопасности: `@UseGuards(JwtAuthGuard, RolesGuard)` и `@Roles(...)` в контроллерах.
  - Генерация 8-значного кода: secure random, TTL (например, 24ч), хранить либо в хеше.

- Frontend (файлы / UI)
  - Точка создания заказа: `frontend/src/features/get-cart/*` — добавить вызов POST `/orders`.
  - Личный кабинет: `frontend/src/pages/profile/*` — раздел «Мои заявки», показать код получения и статус заказа.
  - Librarian UI: `frontend/src/widgets/LibrarianOrdersTab/*` — кнопки Approve / Generate Code / Issue; модалки для ввода кода; обновление данных через React Query (useMutation + invalidate).

Второй спринт — уведомления и напоминания

- Добавить модель `Notification` и endpoint `GET /notifications`, `POST /notifications/send`.
- Добавить задачу/cron (BullMQ + Redis) для отправки напоминаний за N дней до срока возврата.

Архивация данных

- Простая опция: добавить булево `archived` или статус `ARCHIVED` и периодически (cron) переводить старые записи;
- Более сложная: перенос в отдельную таблицу `ArchivedOrder` для снижения объема активных таблиц.

Кэширование и производительность

- Frontend: централизованные настройки в `QueryProvider` (staleTime, cacheTime, retry, background refetch) и оптимистичные обновления.
- Backend: кеширование тяжёлых запросов (топ-книги, статистика) через Redis и nest cache manager.

Доп. фичи (по необходимости времени)

- Импорт базы из Excel: endpoint и парсер (`xlsx`), форма/CLI для загрузки.
- Экспорт отчетов: `exceljs` / `pdfkit` на бэкенде.
- Рекомендации: пока простая версия на основе `readBooks` + жанры/авторы; позже — бекграунд задача для улучшения.

Тестирование и выпуск

- E2E для ключевых флоу: регистрация, создание заказа, approve/issue, подтверждение получения.
- CI: запуск тестов + линтер + сборка фронта.

Как я могу помочь дальше

- Могу сразу создать skeleton для `order` модуля (backend) + Prisma-модель и пример миграции.
- Или подготовить OpenAPI / спецификацию для новых эндпоинтов перед реализацией.

---

Файл с планом создан; при желании внесу правки или начну реализацию первого спринта.
