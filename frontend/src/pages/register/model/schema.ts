import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email('Неверный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    passwordConfirm: z.string(),
    name: z.string().min(1, 'Имя обязательно'),
    surname: z.string().min(1, 'Фамилия обязательна'),
    displayName: z.string().optional(),
    phone: z
      .string()
      .regex(/^7\d{10}$/, 'Формат: 79991234567')
      .optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    birthDate: z
      .preprocess(
        arg => {
          if (arg && typeof (arg as any).toISOString === 'function') {
            return (arg as any).toISOString()
          }
          return arg
        },
        z.string().datetime().optional().or(z.literal('')),
      )
      .optional(),
  })
  .refine(data => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Пароли не совпадают',
  })
export type RegisterDto = z.infer<typeof registerSchema>
