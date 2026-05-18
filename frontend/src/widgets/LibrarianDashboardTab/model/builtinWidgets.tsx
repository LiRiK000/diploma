import type { FC } from 'react'
import type { GridItemConfig, WidgetGridProps } from '@entities/widgets-grid/types'
import type { WidgetRangeConfig } from '@entities/statistic/lib/statsQuery'
import { LibrarianKpiWidget } from '@widgets/LibrarianKpiWidget'
import { OverdueTrendWidget } from '@widgets/OverdueTrendWidget'
import { LibraryWorkloadWidget } from '@widgets/LibraryWorkloadWidget'
import { TopGenresWidget } from '@widgets/TopGenresWidget'
import {
  getDefaultBuiltinRange,
  resolveBuiltinRange,
} from './builtinWidgetSettings'

export const BUILTIN_WIDGET_IDS = ['1', '2', '3', '4'] as const
export type BuiltinWidgetId = (typeof BUILTIN_WIDGET_IDS)[number]

type BuiltinWidgetComponent = FC<WidgetGridProps>

const BUILTIN_REGISTRY: Record<BuiltinWidgetId, BuiltinWidgetComponent> = {
  '1': LibrarianKpiWidget,
  '2': OverdueTrendWidget,
  '3': LibraryWorkloadWidget,
  '4': TopGenresWidget,
}

export function buildBuiltinGridItems(
  isEditing: boolean,
  getRange: (id: BuiltinWidgetId) => WidgetRangeConfig,
  setRange: (id: BuiltinWidgetId, config: WidgetRangeConfig) => void,
): GridItemConfig[] {
  return BUILTIN_WIDGET_IDS.map(id => {
    const Widget = BUILTIN_REGISTRY[id]
    const rangeConfig = getRange(id)

    return {
      id,
      rangeConfig,
      onRangeChange: (config: WidgetRangeConfig) => setRange(id, config),
      content: props => <Widget {...props} />,
    }
  })
}

