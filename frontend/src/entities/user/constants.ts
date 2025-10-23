export const USER_ROLES = {
  LIBRARIAN: 'LIBRARIAN',
  USER: 'USER',
} as const

export const USER_ROLES_LABELS = {
  [USER_ROLES.LIBRARIAN]: 'Библиотекарь',
  [USER_ROLES.USER]: 'Пользователь',
} as const
