import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/error.middleware'

type BookSearchResult = {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  availableQuantity: number
  sim: number
}
type BookSuggestion = {
  id: string
  title: string
  author: string
}
export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = (req.query.q as string)?.trim()

    if (!query) {
      throw new AppError('Введите поисковый запрос', 400)
    }

    const take = Number(req.query.take) || 20

    const books = await prisma.$queryRaw<BookSearchResult[]>`
      SELECT id, title, "description", "coverImage", "availableQuantity",
             similarity(title, ${query}) AS sim
      FROM "books"
      WHERE similarity(title, ${query}) > 0.3
         OR title ILIKE ${'%' + query + '%'}
         OR description ILIKE ${'%' + query + '%'}
      ORDER BY sim DESC
      LIMIT ${take};
    `

    const formatted = books.map(b => ({
      id: b.id,
      title: b.title,
      description: b.description,
      coverUrl: b.coverImage || '',
      availableQuantity: b.availableQuantity,
    }))

    res.status(200).json({
      status: 'success',
      results: formatted.length,
      data: formatted,
    })
  } catch (error) {
    next(error)
  }
}

export const getBookSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = (req.query.q as string)?.trim()

    if (!query) {
      throw new AppError('Введите поисковый запрос', 400)
    }

    const take = Number(req.query.take) || 8

    // Поиск с учетом похожести + JOIN с авторами
    const suggestions = await prisma.$queryRaw<BookSuggestion[]>`
      SELECT b.id,
             b.title,
             a."firstName" || ' ' || a."lastName" AS author
      FROM "books" b
      LEFT JOIN "authors" a ON b."authorId" = a.id
      WHERE similarity(b.title, ${query}) > 0.3
         OR b.title ILIKE ${'%' + query + '%'}
         OR (a."firstName" || ' ' || a."lastName") ILIKE ${'%' + query + '%'}
      ORDER BY similarity(b.title, ${query}) DESC
      LIMIT ${take};
    `

    res.status(200).json({
      status: 'success',
      results: suggestions.length,
      data: suggestions.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
      })),
    })
  } catch (error) {
    next(error)
  }
}
