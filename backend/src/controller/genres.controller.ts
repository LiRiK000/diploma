import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";

export const getAllGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const genres = await prisma.genre.findMany({
      select: { value: true, label: true },
      orderBy: { label: "asc" },
    });

    res.status(200).json({
      status: "success",
      results: genres.length,
      data: genres,
    });
  } catch (error) {
    next(error);
  }
};

export const createGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { value, label } = req.body;

    if (!value || !label) {
      throw new AppError("Необходимо указать value и label", 400);
    }

    const existingGenre = await prisma.genre.findUnique({
      where: { value },
    });

    if (existingGenre) {
      throw new AppError("Жанр с таким value уже существует", 400);
    }

    const genre = await prisma.genre.create({
      data: { value, label },
    });

    res.status(201).json({
      status: "success",
      data: genre,
    });
  } catch (error) {
    next(error);
  }
};
