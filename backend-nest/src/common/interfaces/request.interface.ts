import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    // добавь другие поля из JWT токена, если нужно
  };
}
