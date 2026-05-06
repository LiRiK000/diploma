import React from 'react'
import {
  Timer,
  CheckCircle2,
  PackageCheck,
  BookOpenCheck,
  History,
  XCircle,
  AlertCircle,
} from 'lucide-react'

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'READY_TO_PICKUP'
  | 'ON_HAND'
  | 'OVERDUE'
  | 'RETURNED'
  | 'CANCELLED'

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; step: number; icon: React.ReactNode }
> = {
  PENDING: {
    label: 'На рассмотрении',
    color: 'orange',
    step: 0,
    icon: <Timer size={16} />,
  },
  APPROVED: {
    label: 'Одобрен',
    color: 'cyan',
    step: 1,
    icon: <CheckCircle2 size={16} />,
  },
  READY_TO_PICKUP: {
    label: 'Готов к выдаче',
    color: 'blue',
    step: 2,
    icon: <PackageCheck size={16} />,
  },
  ON_HAND: {
    label: 'На руках',
    color: 'green',
    step: 3,
    icon: <BookOpenCheck size={16} />,
  },
  OVERDUE: {
    label: 'Просрочен',
    color: 'red',
    step: 3,
    icon: <AlertCircle size={16} />,
  },
  RETURNED: {
    label: 'Возвращен',
    color: 'purple',
    step: 4,
    icon: <History size={16} />,
  },
  CANCELLED: {
    label: 'Отменен',
    color: 'default',
    step: -1,
    icon: <XCircle size={16} />,
  },
}

export const ORDER_STEPS = [
  {
    title: 'Заявка',
    icon: <Timer size={20} strokeWidth={1.5} />,
  },
  {
    title: 'Одобрено',
    icon: <CheckCircle2 size={20} strokeWidth={1.5} />,
  },
  {
    title: 'Выдача',
    icon: <PackageCheck size={20} strokeWidth={1.5} />,
  },
  {
    title: 'На руках',
    icon: <BookOpenCheck size={20} strokeWidth={1.5} />,
  },
  {
    title: 'Возврат',
    icon: <History size={20} strokeWidth={1.5} />,
  },
]
