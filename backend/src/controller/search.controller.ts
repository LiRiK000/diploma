import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.config'
import { AppError } from '../middleware/error.middleware'

type BookSearchResult = {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  availableQuantity: number
  authorId: string
  author: string | null
  genre: string | null
  sim: number
}

const formatBooks = (books: BookSearchResult[]) => {
  return books.map(b => ({
    id: b.id,
    title: b.title,
    description: b.description,
    coverUrl: b.coverImage || '',
    availableQuantity: b.availableQuantity,
    authorId: b.authorId,
    author: b.author,
    genre: b.genre,
  }))
}
export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = (req.query.q as string)?.trim()
    const take = Number(req.query.take) || 20

    // 1. Пытаемся найти точные или очень сильные совпадения (> 0.6)
    const exactMatches = await prisma.$queryRaw<BookSearchResult[]>`
      SELECT b.id,
             b.title,
             b."description",
             b."coverImage",
             b."availableQuantity",
             b."authorId",
             (a."firstName" || ' ' || a."lastName") AS author,
             g.label AS genre,
             similarity(title, ${query}) AS sim
      FROM "books" b
      JOIN "authors" a ON b."authorId" = a.id
      JOIN "genres" g ON b."genreId" = g.id
      WHERE similarity(b.title, ${query}) > 0.6
      ORDER BY sim DESC LIMIT ${take};
    `

    if (exactMatches.length > 0) {
      return res.status(200).json({
        status: 'success',
        matchType: 'exact',
        data: formatBooks(exactMatches),
      })
    }

    // 2. Если точных нет, ищем "похожие" (широкий поиск по жанру или части названия)
    const recommendations = await prisma.$queryRaw<BookSearchResult[]>`
      SELECT b.id,
             b.title,
             b."description",
             b."coverImage",
             b."availableQuantity",
             b."authorId",
             (a."firstName" || ' ' || a."lastName") AS author,
             g.label AS genre,
             0.1 AS sim
      FROM "books" b
      JOIN "authors" a ON b."authorId" = a.id
      JOIN "genres" g ON b."genreId" = g.id
      WHERE b.title ILIKE ${'%' + query + '%'}
         OR b."description" ILIKE ${'%' + query + '%'}
      ORDER BY b."availableQuantity" DESC LIMIT ${take};
    `

    res.status(200).json({
      status: 'success',
      matchType: 'recommendations', // Ключевой флаг
      data: formatBooks(recommendations),
    })
  } catch (error) {
    next(error)
  }
}

type SuggestionItem = {
  id: string
  title: string
  author: string | null
  type: 'book' | 'author'
  sim: number
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

    // Используем UNION для поиска и по книгам, и по авторам
    const suggestions = await prisma.$queryRaw<SuggestionItem[]>`
      -- Сначала ищем авторов
      SELECT 
        id, 
        ("firstName" || ' ' || "lastName") AS title, 
        NULL AS author, 
        'author' AS type,
        similarity(("firstName" || ' ' || "lastName"), ${query}) AS sim
      FROM "authors"
      WHERE similarity(("firstName" || ' ' || "lastName"), ${query}) > 0.3
         OR ("firstName" || ' ' || "lastName") ILIKE ${'%' + query + '%'}

      UNION ALL

      SELECT 
        b.id, 
        b.title, 
        (a."firstName" || ' ' || a."lastName") AS author, 
        'book' AS type,
        similarity(b.title, ${query}) AS sim
      FROM "books" b
      LEFT JOIN "authors" a ON b."authorId" = a.id
      WHERE similarity(b.title, ${query}) > 0.3
         OR b.title ILIKE ${'%' + query + '%'}

      ORDER BY sim DESC
      LIMIT ${take};
    `

    res.status(200).json({
      status: 'success',
      results: suggestions.length,
      data: suggestions.map(s => ({
        id: s.id,
        title: s.title,
        author: s.author,
        type: s.type,
      })),
    })
  } catch (error) {
    next(error)
  }
}
