import { Router } from 'express'
import { protect } from '../middleware/auth.middleware'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  totalCart,
} from '../controller/cart.controller'
import type { Router as ExpressRouter } from 'express'

export const cartRouter: ExpressRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Работа с корзиной пользователя
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Получить корзину пользователя
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Корзина пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 *                     totalItems:
 *                       type: integer
 *                     canAddMore:
 *                       type: boolean
 */
cartRouter.get('/', protect, getCart)

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Добавить книгу в корзину
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: ID книги
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 description: Количество (по умолчанию 1)
 *     responses:
 *       201:
 *         description: Книга добавлена в корзину
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Неверные данные или лимит превышен
 *       404:
 *         description: Книга не найдена
 */
cartRouter.post('/add', protect, addToCart)

/**
 * @swagger
 * /api/cart/item/{id}:
 *   patch:
 *     summary: Обновить количество в корзине
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID элемента корзины
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Новое количество
 *     responses:
 *       200:
 *         description: Количество обновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Неверное количество
 *       404:
 *         description: Элемент не найден
 */
// Под вопросом
cartRouter.patch('/item/:id', protect, updateCartItem)

/**
 * @swagger
 * /api/cart/item/{id}:
 *   delete:
 *     summary: Удалить книгу из корзины
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID элемента корзины
 *     responses:
 *       200:
 *         description: Книга удалена из корзины
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Удалено
 *       404:
 *         description: Элемент не найден
 */
cartRouter.delete('/item/:id', protect, removeFromCart)

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Очистить всю корзину
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Корзина очищена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Корзина очищена
 */

cartRouter.get('/total', protect, totalCart)
