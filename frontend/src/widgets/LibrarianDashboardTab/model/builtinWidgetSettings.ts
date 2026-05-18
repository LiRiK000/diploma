import type { DateRangePreset } from '@entities/statistic/model/types'
import {
  DEFAULT_KPI_RANGE,
  DEFAULT_WIDGET_RANGE,
  type WidgetRangeConfig,
} from '@entities/statistic/lib/statsQuery'
import type { BuiltinWidgetId } from './builtinWidgets'

const STORAGE_KEY = 'librarian_builtin_widget_ranges'

type BuiltinRangeMap = Partial<Record<BuiltinWidgetId, WidgetRangeConfig>>

const DEFAULTS: Record<BuiltinWidgetId, WidgetRangeConfig> = {
  '1': DEFAULT_KPI_RANGE,
  '2': DEFAULT_WIDGET_RANGE,
  '3': { preset: 'week' },
  '4': DEFAULT_WIDGET_RANGE,
}

export function getDefaultBuiltinRange(id: BuiltinWidgetId): WidgetRangeConfig {
  return { ...DEFAULTS[id] }
}

export function loadBuiltinWidgetRanges(): BuiltinRangeMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as BuiltinRangeMap
    return parsed ?? {}
  } catch {
    return {}
  }
}

export function saveBuiltinWidgetRanges(map: BuiltinRangeMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function resolveBuiltinRange(
  id: BuiltinWidgetId,
  savedMap?: BuiltinRangeMap,
): WidgetRangeConfig {
  const saved = savedMap?.[id] ?? loadBuiltinWidgetRanges()[id]
  if (!saved?.preset) return getDefaultBuiltinRange(id)
  return {
    preset: saved.preset as DateRangePreset,
    from: saved.from,
    to: saved.to,
  }
}
