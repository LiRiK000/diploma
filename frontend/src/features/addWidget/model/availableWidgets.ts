export type WidgetRenderType = 'line' | 'bar' | 'pie' | 'kpi' | 'table'

export interface AvailableWidgetInfo {
  type: string
  title: string
  description: string
  defaultSize: { w: number; h: number }
  supportedRenderTypes: { type: WidgetRenderType; label: string }[] // Какие графики поддерживает виджет
  preview?: string
  category?: string
  minSize?: { w: number; h: number }
}

export const AVAILABLE_WIDGETS: AvailableWidgetInfo[] = [
  {
    type: 'librarian_kpi',
    title: 'KPI Сотрудника',
    description:
      'Статистика обработанных книг, зарегистрированных читателей и скорость обслуживания.',
    defaultSize: { w: 3, h: 2 },
    supportedRenderTypes: [
      { type: 'kpi', label: 'Карточки с числами' },
      { type: 'bar', label: 'Столбчатая диаграмма' },
    ],
  },
  {
    type: 'overdue_trend',
    title: 'Тренды задолженностей',
    description:
      'Аналитический график динамики возврата книг и просроченных экземпляров.',
    defaultSize: { w: 6, h: 4 },
    supportedRenderTypes: [
      { type: 'line', label: 'Линейный график' },
      { type: 'bar', label: 'Гистограмма (Столбцы)' },
    ],
  },
  {
    type: 'top_genres',
    title: 'Популярные жанры',
    description:
      'Диаграмма предпочтений читателей за выбранный промежуток времени.',
    defaultSize: { w: 3, h: 4 },
    supportedRenderTypes: [
      { type: 'pie', label: 'Круговая диаграмма' },
      { type: 'bar', label: 'Горизонтальные столбцы' },
      { type: 'table', label: 'Топ-список (Таблица)' },
    ],
  },
  {
    type: 'recent_orders',
    title: 'Последние заказы',
    description:
      'Лента операционной активности: бронирования, выдачи и возвраты в реальном времени.',
    defaultSize: { w: 3, h: 3 },
    supportedRenderTypes: [{ type: 'table', label: 'Интерактивный список' }],
  },
]
