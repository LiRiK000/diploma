import { OrderStatus } from '@shared/services/Order/types'

export const statusMap: Record<OrderStatus, { label: string; color: string }> =
  {
    PENDING: { label: 'На рассмотрении', color: 'orange' },
    APPROVED: { label: 'Одобрен', color: 'cyan' },
    READY_TO_PICKUP: { label: 'Готов к выдаче', color: 'blue' },
    ON_HAND: { label: 'У вас на руках', color: 'green' },
    RETURNED: { label: 'Возвращено', color: 'purple' },
    CANCELLED: { label: 'Отменен', color: 'red' },
  }

export const getStatusStep = (status: OrderStatus) => {
  const steps: Record<string, number> = {
    PENDING: 0,
    APPROVED: 1,
    READY_TO_PICKUP: 2,
    ON_HAND: 3,
  }
  return steps[status] ?? 0
}
