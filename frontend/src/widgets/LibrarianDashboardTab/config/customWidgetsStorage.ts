import { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'
import { GridItemConfig } from '@entities/widgets-grid/types'

export interface StoredCustomWidget {
  id: string
  config: WidgetConfig
  gridParams?: GridItemConfig['gridParams']
}

const STORAGE_KEY = 'librarian_custom_widgets'

const defaultConfigFields: Pick<
  WidgetConfig,
  'sizePreset' | 'placement' | 'range'
> = {
  sizePreset: 'standard',
  placement: 'auto',
  range: 'month',
}

const normalizeConfig = (raw: Partial<WidgetConfig>): WidgetConfig => ({
  title: raw.title ?? 'Виджет',
  type: raw.type ?? 'bar',
  source: raw.source ?? 'popular_genres',
  range: raw.range ?? defaultConfigFields.range,
  sizePreset: raw.sizePreset ?? defaultConfigFields.sizePreset,
  placement: raw.placement ?? defaultConfigFields.placement,
})

export const loadCustomWidgets = (): StoredCustomWidget[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map((item: StoredCustomWidget) => {
      const { y: _y, ...gridParams } = item.gridParams ?? {}
      const safeY =
        typeof item.gridParams?.y === 'number' &&
        Number.isFinite(item.gridParams.y)
          ? item.gridParams.y
          : undefined

      return {
        ...item,
        config: normalizeConfig(item.config),
        gridParams: {
          ...gridParams,
          ...(safeY !== undefined ? { y: safeY } : {}),
        },
      }
    })
  } catch {
    return []
  }
}

export const saveCustomWidgets = (widgets: StoredCustomWidget[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets))
}
