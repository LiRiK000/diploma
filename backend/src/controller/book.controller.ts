import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/error.middleware'

export const getPaginatedBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const take = Number(req.query.take) || 8
    const cursor = req.query.cursor
      ? { id: req.query.cursor as string }
      : undefined

    const books = await prisma.book.findMany({
      take: take + 1,
      ...(cursor && { skip: 1, cursor }),
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        availableQuantity: true,
        subjects: true,
        coverImage: true,
        genre: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    const hasNextPage = books.length > take
    const items = hasNextPage ? books.slice(0, -1) : books
    const formatted = items.map(b => ({
      id: b.id,
      title: b.title,
      author: `${b.author.firstName} ${b.author.lastName}`,
      coverUrl: b.coverImage || '',
      availableQuantity: b.availableQuantity,
      genre: b.genre.label,
    }))

    res.status(200).json({
      status: 'success',
      data: {
        items: formatted,
        nextCursor: hasNextPage ? items[items.length - 1].id : null,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
        genre: {
          select: { id: true, label: true, value: true },
        },
        recommendedBooks: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },

        reviews: {
          select: {
            id: true,
            description: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
        },
      },
    })

    if (!book) {
      throw new AppError('Книга не найдена', 404)
    }

    const formatted = {
      id: book.id,
      title: book.title,
      author: `${book.author.firstName} ${book.author.lastName}`,
      coverUrl: book.coverImage,
      availableQuantity: book.availableQuantity,
      description: book.description,
      subjects: book.subjects,
      publishYear: book.publishedDate
        ? new Date(book.publishedDate).getFullYear()
        : null,
      ratingsCount: book.reviews.length,
      details: {
        pages: book.pageCount,
        language: book.language,
        publisher: book.publisher,
        genre: book.genre.label,
      },
      authorBio: '',
      tags: book.subjects || [],
      recommendedBooks: book.recommendedBooks.map(r => ({
        id: r.id,
        title: r.title,
        author: `${r.author.firstName} ${r.author.lastName}`,
        coverUrl: r.coverImage,
      })),
      reviews: book.reviews.map(r => ({
        id: r.id,
        text: r.description,
        createdAt: r.createdAt,
        user: `${r.user.name} ${r.user.surname}`,
      })),
    }

    return res.status(200).json({
      status: 'success',
      data: formatted,
    })
  } catch (error) {
    next(error)
  }
}
