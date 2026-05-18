import type { Layouts } from 'react-grid-layout'
import type { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'
import { getSizePreset } from '@features/widget-builder/config/widgetOptions'
import type { GridItemConfig } from '@entities/widgets-grid/types'
import { GRID_ID } from '@entities/widgets-grid/constants'
import {
  loadLayoutsFromStorage,
  saveLayoutsToStorage,
} from '@entities/widgets-grid/lib/layoutStorage'
import { insertWidgetIntoLayouts } from '@entities/widgets-grid/lib/placement'
import { mergeLayoutsWithItems } from '@entities/widgets-grid/lib/layoutUtils'
import { useLayoutStore } from '@entities/widgets-grid/model/store'

function commitLayouts(layouts: Layouts) {
  saveLayoutsToStorage(layouts)
  const { saveLayouts, setLayoutsChanged } = useLayoutStore.getState()
  saveLayouts(layouts)
  setLayoutsChanged(true)
}

/** Слияние сохранённой сетки с текущим списком виджетов */
export function resolveDashboardLayouts(
  items: GridItemConfig[],
  fallback: Layouts,
): Layouts {
  return mergeLayoutsWithItems(loadLayoutsFromStorage(), items, fallback)
}

/** Добавить пользовательский виджет в раскладку всех брейкпоинтов */
export function addWidgetToLayouts(
  widgetId: string,
  config: WidgetConfig,
  fallback: Layouts,
) {
  const size = getSizePreset(config.sizePreset)
  const base = loadLayoutsFromStorage() ?? fallback
  const updated = insertWidgetIntoLayouts(base, widgetId, {
    w: size.w,
    h: size.h,
    minW: 3,
    minH: 4,
    zone: config.placement,
  })
  commitLayouts(updated)
}

/** Убрать виджет из раскладки */
export function removeWidgetFromLayouts(widgetId: string, fallback: Layouts) {
  const store = useLayoutStore.getState()
  const current =
    store.gridLayoutsStates[GRID_ID] ??
    loadLayoutsFromStorage() ??
    fallback

  const updated = Object.fromEntries(
    Object.entries(current).map(([bp, layout]) => [
      bp,
      (layout ?? []).filter(item => item.i !== widgetId),
    ]),
  ) as Layouts

  commitLayouts(updated)
}
