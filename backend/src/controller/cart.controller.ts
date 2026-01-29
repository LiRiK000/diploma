import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.config'

import { AppError } from '../middleware/error.middleware'

const MAX_CART_ITEMS = 3
// TODO => проверка id, плюрализация
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                coverImage: true,
                availableQuantity: true,
                author: { select: { firstName: true, lastName: true } },
                genre: { select: { label: true } },
              },
            },
          },
        },
      },
    })

    const items = (cart?.items || []).map(item => ({
      id: item.id,
      bookId: item.book.id,
      title: item.book.title,
      author: `${item.book.author.firstName} ${item.book.author.lastName}`,
      coverUrl: item.book.coverImage || null,
      genre: item.book.genre.label,
      quantity: item.quantity,
      available: item.book.availableQuantity,
    }))

    res.json({
      status: 'success',
      data: {
        items,
        totalItems: items.length,
        canAddMore: items.length < MAX_CART_ITEMS,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id

    const { bookId, quantity = 1 } = req.body

    if (!bookId) throw new AppError('bookId обязателен', 400)
    if (quantity < 1) throw new AppError('quantity должен быть ≥ 1', 400)

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, title: true, availableQuantity: true },
    })
    if (!book) throw new AppError('Книга не найдена', 404)
    if (book.availableQuantity < quantity) {
      throw new AppError(`Доступно только ${book.availableQuantity} экз.`, 400)
    }

    let cart = await prisma.cart.findUnique({ where: { userId } })
    if (!cart) {
      try {
        cart = await prisma.cart.create({ data: { userId } })
      } catch (error) {
        throw new AppError('При создании корзины произошла ошибка', 500)
      }
    }

    const currentItems = await prisma.cartItem.count({
      where: { cartId: cart.id },
    })
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
    })

    if (!existingItem && currentItems >= MAX_CART_ITEMS) {
      throw new AppError(`Максимум ${MAX_CART_ITEMS} книги в корзине`, 400)
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, bookId, quantity },
    })

    res.status(201).json({
      status: 'success',
      data: { cartItem },
    })
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 1) throw new AppError('quantity ≥ 1', 400)

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true, book: { select: { availableQuantity: true } } },
    })

    if (!item || item.cart.userId !== userId)
      throw new AppError('Не найдено', 404)
    if (quantity > item.book.availableQuantity) {
      throw new AppError(`Доступно только ${item.book.availableQuantity}`, 400)
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    })

    res.json({ status: 'success', data: updated })
  } catch (error) {
    next(error)
  }
}

export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    })

    if (!item || item.cart.userId !== userId)
      throw new AppError('Не найдено', 404)

    await prisma.cartItem.delete({ where: { id } })

    res.json({ status: 'success', message: 'Удалено' })
  } catch (error) {
    next(error)
  }
}

export const totalCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id

    const totalItems = await prisma.cartItem.count({
      where: { cart: { userId } },
    })

    res.json({ totalItems })
  } catch (error) {
    next(error)
  }
}
