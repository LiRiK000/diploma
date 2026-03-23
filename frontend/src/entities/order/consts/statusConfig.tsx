import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  BookOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import React from 'react'

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'READY_TO_PICKUP'
  | 'ON_HAND'
  | 'OVERDUE'
  | 'RETURNED'
  | 'CANCELLED'

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; step: number }
> = {
  PENDING: { label: 'На рассмотрении', color: 'orange', step: 0 },
  APPROVED: { label: 'Одобрен', color: 'cyan', step: 1 },
  READY_TO_PICKUP: { label: 'Готов к выдаче', color: 'blue', step: 2 },
  ON_HAND: { label: 'У вас на руках', color: 'green', step: 3 },
  OVERDUE: { label: 'Просрочен', color: 'red', step: 3 },
  RETURNED: { label: 'Возвращен', color: 'purple', step: 4 },
  CANCELLED: { label: 'Отменен', color: 'default', step: -1 },
}

export const ORDER_STEPS = [
  { title: 'Заявка', icon: <ClockCircleOutlined /> },
  { title: 'Одобрено', icon: <CheckCircleOutlined /> },
  { title: 'Выдача', icon: <InboxOutlined /> },
  { title: 'У вас', icon: <BookOutlined /> },
  { title: 'Возврат', icon: <RollbackOutlined /> },
]
