import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.config'

import { AppError } from '../middleware/error.middleware'

export const getAllGenres = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const genres = await prisma.genre.findMany({
      select: { id: true, value: true, label: true },
      orderBy: { label: 'asc' },
    })

    res.status(200).json({
      status: 'success',
      results: genres.length,
      data: genres,
    })
  } catch (error) {
    next(error)
  }
}
