import { Prisma } from '@prisma/client';

export const userListSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
  surname: true,
  role: true,
  isInBlacklist: true,
  isSuspended: true,
  suspendedUntil: true,
  banReason: true,
  createdAt: true,
});

export type UserListItem = Prisma.UserGetPayload<{
  select: typeof userListSelect;
}>;
