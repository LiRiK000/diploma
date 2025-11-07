import { Router } from 'express'
import { protect, restrictTo } from '../middleware/auth.middleware'
import {
  getAllAuthors,
  createAuthor,
  getAuthorById,
} from '../controller/author.controller'
import type { Router as ExpressRouter } from 'express'

export const authorsRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Работа с авторами книг
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Получить всех авторов
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Список авторов
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
 *                     $ref: '#/components/schemas/Author'
 */
authorsRouter.get('/', getAllAuthors)

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Получить автора по ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID автора
 *     responses:
 *       200:
 *         description: Данные автора
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       404:
 *         description: Автор не найден
 */
authorsRouter.get('/:id', getAuthorById)

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Создать нового автора
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               dateOfDeath:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Автор успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Ошибка при создании автора
 */
authorsRouter.post('/', protect, restrictTo(['LIBRARIAN']), createAuthor)
