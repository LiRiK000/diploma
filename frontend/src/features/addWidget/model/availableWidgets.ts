export interface AvailableWidgetInfo {
  type: string
  title: string
  description: string

  defaultSize: {
    w: number
    h: number
  }

  preview?: string

  category?: string

  minSize?: {
    w: number
    h: number
  }
}

export const AVAILABLE_WIDGETS: AvailableWidgetInfo[] = [
  {
    type: 'librarian_kpi',
    title: 'KPI Сотрудника',
    description:
      'Статистика обработанных книг, зарегистрированных читателей и скорость обслуживания.',
    defaultSize: { w: 3, h: 2 },
  },
  {
    type: 'overdue_trend',
    title: 'Тренды задолженностей',
    description:
      'Аналитический график динамики возврата книг и просроченных экземпляров.',
    defaultSize: { w: 6, h: 4 },
  },
  {
    type: 'top_genres',
    title: 'Популярные жанры',
    description:
      'Диаграмма предпочтений читателей за выбранный промежуток времени.',
    defaultSize: { w: 3, h: 4 },
  },
  {
    type: 'recent_orders',
    title: 'Последние заказы',
    description:
      'Лента операционной активности: бронирования, выдачи и возвраты в реальном времени.',
    defaultSize: { w: 3, h: 3 },
  },
]

export const getWidgetSizeLabel = (w: number, h: number) => {
  if (w >= 6) return 'Large'
  if (w >= 4) return 'Medium'

  return 'Small'
}
