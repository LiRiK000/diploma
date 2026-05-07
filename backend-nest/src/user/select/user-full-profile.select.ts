import { Prisma } from '@prisma/client';

export const userFullProfileSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  surname: true,
  displayName: true,
  phone: true,
  birthDate: true,
  gender: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  _count: {
    select: {
      favoriteBooks: true,
      readBooks: true,
    },
  },
});

export type UserFullProfile = Prisma.UserGetPayload<{
  select: typeof userFullProfileSelect;
}>;
