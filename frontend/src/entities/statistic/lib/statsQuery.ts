import type { DateRangePreset, StatsRangeQueryDto } from '../model/types'

export interface WidgetRangeConfig {
  preset: DateRangePreset
  from?: string
  to?: string
}

export const RANGE_LABELS: Record<DateRangePreset, string> = {
  today: 'Сегодня',
  week: '7 дней',
  month: '30 дней',
  year: '12 месяцев',
  custom: 'Свой период',
}

const PRESET_OPTIONS: DateRangePreset[] = [
  'today',
  'week',
  'month',
  'year',
  'custom',
]

export const WIDGET_RANGE_OPTIONS = PRESET_OPTIONS.map(value => ({
  value,
  label: RANGE_LABELS[value],
}))

/** Query-параметры для API statistics (пресет уходит на бэкенд) */
export function toStatsQuery(config: WidgetRangeConfig): StatsRangeQueryDto {
  if (config.preset === 'custom' && config.from && config.to) {
    return {
      range: 'custom',
      from: config.from,
      to: config.to,
    }
  }
  return { range: config.preset }
}

export function getRangeSubtitle(config: WidgetRangeConfig): string {
  if (config.preset === 'custom' && config.from && config.to) {
    const from = new Date(config.from).toLocaleDateString('ru-RU')
    const to = new Date(config.to).toLocaleDateString('ru-RU')
    return `${from} — ${to}`
  }
  return RANGE_LABELS[config.preset]
}

export const DEFAULT_WIDGET_RANGE: WidgetRangeConfig = { preset: 'month' }

export const DEFAULT_KPI_RANGE: WidgetRangeConfig = { preset: 'today' }
