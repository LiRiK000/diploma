import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Users,
  Star,
} from 'lucide-react'
import { routes } from '@shared/constants'

export const LIBRARIAN_ROUTES = {
  dashboard: {
    key: routes.librarian,
    label: 'Главная',
    icon: <LayoutDashboard size={18} />,
  },
  orders: {
    key: `${routes.librarian}/orders`,
    label: 'Открытые заявки',
    icon: <ShoppingBag size={18} />,
  },
  books: {
    key: `${routes.librarian}/books`,
    label: 'Книги',
    icon: <BookOpen size={18} />,
  },
  authors: {
    key: `${routes.librarian}/authors`,
    label: 'Авторы',
    icon: <Users size={18} />,
  },
  recommendations: {
    key: `${routes.librarian}/recommendations`,
    label: 'Рекомендации',
    icon: <Star size={18} />,
  },
} as const

export const librarianMenuFields = Object.values(LIBRARIAN_ROUTES).map(
  ({ key, label, icon }) => ({
    key,
    label,
    icon,
  }),
)
