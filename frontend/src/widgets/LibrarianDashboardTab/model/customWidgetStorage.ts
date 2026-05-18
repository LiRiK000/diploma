import type { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'
import { getSizePreset } from '@features/widget-builder/config/widgetOptions'
import type { GridItemConfig } from '@entities/widgets-grid/types'

const STORAGE_KEY = 'librarian_custom_widgets'

export interface StoredCustomWidget {
  id: string
  config: WidgetConfig
  gridParams?: GridItemConfig['gridParams']
}

const normalizeConfig = (raw: Partial<WidgetConfig>): WidgetConfig => ({
  title: raw.title ?? 'Виджет',
  type: raw.type ?? 'bar',
  source: raw.source ?? 'popular_genres',
  range: raw.range ?? 'month',
  from: raw.from,
  to: raw.to,
  sizePreset: raw.sizePreset ?? 'standard',
  placement: raw.placement ?? 'auto',
})

export function createCustomWidget(config: WidgetConfig): StoredCustomWidget {
  const size = getSizePreset(config.sizePreset)
  return {
    id: `custom-${Date.now()}`,
    config,
    gridParams: {
      w: size.w,
      h: size.h,
      minW: 3,
      minH: 4,
      x: 0,
    },
  }
}

export function loadCustomWidgets(): StoredCustomWidget[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map((item: StoredCustomWidget) => ({
      ...item,
      config: normalizeConfig(item.config),
      gridParams: item.gridParams
        ? {
            ...item.gridParams,
            ...(typeof item.gridParams.y === 'number' &&
            Number.isFinite(item.gridParams.y)
              ? { y: item.gridParams.y }
              : {}),
          }
        : undefined,
    }))
  } catch {
    return []
  }
}

export function saveCustomWidgets(widgets: StoredCustomWidget[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets))
}
