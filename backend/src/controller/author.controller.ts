import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
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
      orderBy: { lastName: "asc" },
    });

    res.status(200).json({
      status: "success",
      results: authors.length,
      data: authors,
    });
  } catch (error) {
    next(error);
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, dateOfBirth, dateOfDeath } = req.body;

    if (!firstName || !lastName || !dateOfBirth) {
      throw new AppError(
        "Необходимо указать firstName, lastName и dateOfBirth",
        400
      );
    }

    const author = await prisma.author.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        dateOfDeath: dateOfDeath ? new Date(dateOfDeath) : null,
      },
    });

    res.status(201).json({
      status: "success",
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!author) {
      throw new AppError("Автор не найден", 404);
    }

    res.status(200).json({
      status: "success",
      data: author,
    });
  } catch (error) {
    next(error);
  }
};
