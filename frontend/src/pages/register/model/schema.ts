import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.email({ message: 'Неверный email' }),
    password: z
      .string()
      .min(8, { message: 'Пароль должен быть не менее 8 символов' }),
    passwordConfirm: z
      .string()
      .min(8, { message: 'Пароль должен быть не менее 8 символов' }),
    name: z.string().min(1, { message: 'Имя обязательно' }),
    surname: z.string().min(1, { message: 'Фамилия обязательна' }),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  })
