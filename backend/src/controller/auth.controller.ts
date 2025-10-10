import { NextFunction, Request, Response } from 'express';

import { AppError } from '../middleware/error.middleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const signAccessToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '15m', // 15 минут
  });
};

const signRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d', // 7 дней
  });
};

const createSendTokens = async (
  user: any,
  statusCode: number,
  res: Response,
) => {
  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 минут
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  });

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name, surname } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Пользователь с таким email уже существует', 400);
    }

    if (!name || !surname) {
      throw new AppError('Необходимо указать полное имя', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        surname,
        password: hashedPassword,
      },
    });

    await createSendTokens(user, 201, res);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Ошибка при регистрации', 500));
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Неверный email или пароль', 401);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError('Неверный email или пароль', 401);
    }

    await createSendTokens(user, 200, res);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Ошибка при входе', 500));
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Выход выполнен успешно',
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Ошибка при выходе', 500));
    }
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AppError('Не предоставлен refresh token', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as { id: string };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Refresh token истек', 401);
      }
      throw new AppError('Недействительный refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Недействительный refresh token', 401);
    }

    await createSendTokens(user, 200, res);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Ошибка при обновлении токенов', 500));
    }
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          surname: user.surname,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Ошибка при получении данных пользователя', 500));
    }
  }
};
