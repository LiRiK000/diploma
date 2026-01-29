import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.config'
import { AppError } from '../middleware/error.middleware'

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        dateOfDeath: true,
        _count: { select: { books: true } },
      },
      orderBy: { lastName: 'asc' },
    })

    res.status(200).json({
      status: 'success',
      results: authors.length,
      data: authors,
    })
  } catch (error) {
    next(error)
  }
}

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, dateOfBirth, dateOfDeath } = req.body

    if (!firstName || !lastName || !dateOfBirth) {
      throw new AppError(
        'Необходимо указать firstName, lastName и dateOfBirth',
        400,
      )
    }

    const author = await prisma.author.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        dateOfDeath: dateOfDeath ? new Date(dateOfDeath) : null,
      },
    })

    res.status(201).json({
      status: 'success',
      data: author,
    })
  } catch (error) {
    next(error)
  }
}

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const { firstName, lastName, dateOfBirth, dateOfDeath } = req.body

    if (
      firstName === undefined &&
      lastName === undefined &&
      dateOfBirth === undefined &&
      dateOfDeath === undefined
    ) {
      throw new AppError('Нет полей для обновления автора', 400)
    }

    const existingAuthor = await prisma.author.findUnique({ where: { id } })

    if (!existingAuthor) {
      throw new AppError('Автор не найден', 404)
    }

    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: {
        firstName: firstName ?? existingAuthor.firstName,
        lastName: lastName ?? existingAuthor.lastName,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : existingAuthor.dateOfBirth,
        dateOfDeath:
          dateOfDeath !== undefined
            ? dateOfDeath
              ? new Date(dateOfDeath)
              : null
            : existingAuthor.dateOfDeath,
      },
    })

    res.status(200).json({
      status: 'success',
      data: updatedAuthor,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params

    const existingAuthor = await prisma.author.findUnique({ where: { id } })

    if (!existingAuthor) {
      throw new AppError('Автор не найден', 404)
    }

    await prisma.author.delete({ where: { id } })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}
export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const currentUserId = (req as any).user?.id

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
        _count: {
          select: { followers: true },
        },
        followers: currentUserId
          ? {
              where: { id: currentUserId },
              select: { id: true },
            }
          : undefined,
      },
    })

    if (!author) {
      throw new AppError('Автор не найден', 404)
    }

    const isFollowing = await prisma.user.findFirst({
      where: {
        id: currentUserId,
        followedAuthors: {
          some: {
            id: id,
          },
        },
      },
    })
    const topBooksData = await prisma.book.findMany({
      where: { authorId: id },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        genre: true, // Добавляем жанр в запрос
      },
    })

    // Преобразуем данные, чтобы автор и жанр были строками, а не объектами
    const topBooks = topBooksData.map(book => ({
      ...book,
      author: `${book.author.firstName} ${book.author.lastName}`,
      genre: book.genre.label, // Теперь здесь будет просто название жанра (например, "Фэнтези")
    }))

    const result = {
      ...author,
      author: `${author.firstName} ${author.lastName}`,
      topBook: topBooks,
      followersCount: author._count.followers,
      isFollowing: !!isFollowing,
    }
    delete (result as any).followers
    delete (result as any)._count

    res.status(200).json({
      status: 'success',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const toggleFollowAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = req.params.id
    const userId = (req as any).user.id // ID текущего пользователя из JWT

    // 1. Ищем, подписан ли пользователь уже
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followedAuthors: {
          where: { id: authorId },
          select: { id: true },
        },
      },
    })

    const isAlreadyFollowing =
      user?.followedAuthors.length && user.followedAuthors.length > 0

    // 2. Инвертируем состояние (connect или disconnect)
    await prisma.user.update({
      where: { id: userId },
      data: {
        followedAuthors: isAlreadyFollowing
          ? { disconnect: { id: authorId } }
          : { connect: { id: authorId } },
      },
    })

    res.status(200).json({
      status: 'success',
      message: isAlreadyFollowing
        ? 'Вы успешно отписались'
        : 'Вы успешно подписались',
      isFollowing: !isAlreadyFollowing, // Возвращаем актуальное состояние
    })
  } catch (error) {
    next(new AppError('Не удалось изменить состояние подписки', 400))
  }
}
