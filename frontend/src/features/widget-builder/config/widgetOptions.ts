import type { DataSource, WidgetSizePreset, WidgetPlacement, WidgetType } from '../model/useWidgetBuilderStore'

export const CHART_TYPE_OPTIONS: {
  value: WidgetType
  label: string
  description: string
}[] = [
  { value: 'bar', label: 'Столбцы', description: 'Сравнение категорий' },
  { value: 'line', label: 'Линия', description: 'Тренд во времени' },
  { value: 'area', label: 'Область', description: 'Нагрузка и динамика' },
  { value: 'pie', label: 'Круг', description: 'Доли и проценты' },
  { value: 'donut', label: 'Кольцо', description: 'Компактные доли' },
  { value: 'radar', label: 'Радар', description: 'Профиль по осям' },
]

export const DATA_SOURCE_OPTIONS: {
  value: DataSource
  label: string
  description: string
  compatibleTypes: WidgetType[]
}[] = [
  {
    value: 'popular_genres',
    label: 'Выдачи по жанрам',
    description: 'Топ жанров за период',
    compatibleTypes: ['bar', 'pie', 'donut', 'radar'],
  },
  {
    value: 'workload',
    label: 'Нагрузка библиотеки',
    description: 'Выдано и возвращено',
    compatibleTypes: ['line', 'area', 'bar'],
  },
  {
    value: 'overdue',
    label: 'Просрочки',
    description: 'Заказы по дням просрочки',
    compatibleTypes: ['bar', 'line'],
  },
  {
    value: 'orders_status',
    label: 'Статусы заказов',
    description: 'Распределение по статусам',
    compatibleTypes: ['pie', 'donut', 'bar'],
  },
  {
    value: 'overview_activity',
    label: 'Активность',
    description: 'Ключевые метрики за сутки',
    compatibleTypes: ['bar', 'line', 'area'],
  },
]

export const RANGE_OPTIONS = [
  { value: 'week' as const, label: '7 дней' },
  { value: 'month' as const, label: '30 дней' },
  { value: 'year' as const, label: '12 месяцев' },
  { value: 'custom' as const, label: 'Свой период' },
]

export const SIZE_PRESET_OPTIONS: {
  value: WidgetSizePreset
  label: string
  description: string
  w: number
  h: number
}[] = [
  { value: 'compact', label: 'Компакт', description: '4×5', w: 4, h: 5 },
  { value: 'standard', label: 'Стандарт', description: '6×6', w: 6, h: 6 },
  { value: 'wide', label: 'Широкий', description: '8×5', w: 8, h: 5 },
  { value: 'tall', label: 'Высокий', description: '4×9', w: 4, h: 9 },
  { value: 'hero', label: 'Панорама', description: '12×6', w: 12, h: 6 },
]

export const PLACEMENT_OPTIONS: {
  value: WidgetPlacement
  label: string
  description: string
}[] = [
  { value: 'auto', label: 'Авто', description: 'В конец сетки' },
  { value: 'top', label: 'Сверху', description: 'Над виджетами' },
  { value: 'bottom', label: 'Снизу', description: 'Под всеми' },
  { value: 'left', label: 'Слева', description: 'В левую колонку' },
  { value: 'right', label: 'Справа', description: 'В правую колонку' },
]

export const getSizePreset = (preset: WidgetSizePreset) =>
  SIZE_PRESET_OPTIONS.find(s => s.value === preset) ?? SIZE_PRESET_OPTIONS[1]

export const getSourceLabel = (source: DataSource) =>
  DATA_SOURCE_OPTIONS.find(s => s.value === source)?.label ?? source

export const getChartLabel = (type: WidgetType) =>
  CHART_TYPE_OPTIONS.find(c => c.value === type)?.label ?? type
