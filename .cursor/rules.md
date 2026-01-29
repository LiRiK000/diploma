# Project Context — Library System

## Goal
Web-приложение для библиотеки с ролями:
- Пользователь
- Библиотекарь
- Администратор

## Core Features
### Общие
- Двухсторонняя система подтверждения выдачи/возврата книг
- RBAC (user / librarian / admin)
- Кэширование (TanStack Query / server-side)
- Архивация старых данных
- PWA (service worker)

## User Features
- Рекомендации по жанрам и авторам
- Заявки на получение книг
- Поиск и фильтрация
- Рецензии
- Избранное
- История чтения

## Librarian Features
- Дашборд с виджетами (drag & drop)
- Напоминания о возврате
- CRUD книг
- Статистика
- Чёрный список пользователей

## Application Flow — Book Request
1. Пользователь собирает корзину книг
2. Библиотекарь подтверждает заявку
3. Генерируется 8-значный код
4. Библиотекарь вводит код и выдает книги
5. Пользователь подтверждает получение

## Frontend Stack
- React 19.2
- TanStack Query
- Zustand
- Ant Design
- Zod
- Day.js

## Backend Stack
- Express (TypeScript)
- Prisma ORM
- JWT + Cookies
- bcrypt
