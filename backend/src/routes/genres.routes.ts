import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { getAllGenres } from "../controller/genres.controller";
import type { Router as ExpressRouter } from "express";

export const genresRouter: ExpressRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Работа с жанрами литературы
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Получить все жанры
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Список жанров
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
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                       label:
 *                         type: string
 */
genresRouter.get("/", getAllGenres);

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Создать новый жанр
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - label
 *             properties:
 *               value:
 *                 type: string
 *               label:
 *                 type: string
 *     responses:
 *       201:
 *         description: Жанр успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Жанр с таким value уже существует
 */
