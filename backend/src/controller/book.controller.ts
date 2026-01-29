import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.config'

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
        authorId: true,
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
      authorId: b.authorId,
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
      authorId: book.author.id,
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

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      authorId,
      genreId,
      availableQuantity,
      description,
      subjects,
      publisher,
      publishedDate,
      pageCount,
      language,
      coverImage,
    } = req.body

    if (!title || !authorId || !genreId) {
      throw new AppError(
        'Необходимо указать title, authorId и genreId для создания книги',
        400,
      )
    }

    const book = await prisma.book.create({
      data: {
        title,
        authorId,
        genreId,
        availableQuantity: availableQuantity ?? 0,
        description: description ?? null,
        subjects: Array.isArray(subjects) ? subjects : [],
        publisher: publisher ?? null,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        pageCount: pageCount ?? null,
        language: language ?? null,
        coverImage: coverImage ?? null,
      },
    })

    res.status(201).json({
      status: 'success',
      data: book,
    })
  } catch (error) {
    next(error)
  }
}

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const {
      title,
      authorId,
      genreId,
      availableQuantity,
      description,
      subjects,
      publisher,
      publishedDate,
      pageCount,
      language,
      coverImage,
    } = req.body

    const existingBook = await prisma.book.findUnique({ where: { id } })

    if (!existingBook) {
      throw new AppError('Книга не найдена', 404)
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: title ?? existingBook.title,
        authorId: authorId ?? existingBook.authorId,
        genreId: genreId ?? existingBook.genreId,
        availableQuantity:
          availableQuantity !== undefined
            ? availableQuantity
            : existingBook.availableQuantity,
        description: description ?? existingBook.description,
        subjects: Array.isArray(subjects)
          ? subjects
          : (existingBook.subjects ?? []),
        publisher: publisher ?? existingBook.publisher,
        publishedDate: publishedDate
          ? new Date(publishedDate)
          : existingBook.publishedDate,
        pageCount: pageCount ?? existingBook.pageCount,
        language: language ?? existingBook.language,
        coverImage: coverImage ?? existingBook.coverImage,
      },
    })

    res.status(200).json({
      status: 'success',
      data: updatedBook,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params

    const existingBook = await prisma.book.findUnique({ where: { id } })

    if (!existingBook) {
      throw new AppError('Книга не найдена', 404)
    }

    await prisma.book.delete({ where: { id } })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}
