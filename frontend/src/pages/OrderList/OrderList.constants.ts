export const STATUS_MAP: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: 'В обработке' },
  APPROVED: { color: 'blue', label: 'Подтвержден' },
  READY_TO_PICKUP: { color: 'cyan', label: 'Готов к выдаче' },
  ON_HAND: { color: 'green', label: 'На руках' },
  CANCELLED: { color: 'red', label: 'Отменен' },
  COMPLETED: { color: 'gray', label: 'Завершен' },
  RETURNED: { color: 'purple', label: 'Возвращен' },
}

export const MAX_VISIBLE_COVERS = 5
export const DATE_FORMAT = 'D MMMM YYYY'
