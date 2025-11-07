import { Router } from 'express'
import { protect, restrictTo } from '../middleware/auth.middleware'
import { getBookById, getPaginatedBooks } from '../controller/book.controller'
import type { Router as ExpressRouter } from 'express'

export const booksRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Работа с книгами
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Получить все книги
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Список всех книг
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 */
booksRouter.get('/', getPaginatedBooks)

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Получить книгу по ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID книги
 *     responses:
 *       200:
 *         description: Данные книги
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Книга не найдена
 */
booksRouter.get('/:id', getBookById)
