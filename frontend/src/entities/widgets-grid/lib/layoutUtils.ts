import { Layout, Layouts } from 'react-grid-layout'
import { GridItemConfig } from '../types'
import { sanitizeLayoutItem } from './sanitizeLayout'

const layoutFromItem = (item: GridItemConfig, fallbackY = 0): Layout => ({
  i: item.id,
  x: item.gridParams?.x ?? 0,
  y:
    typeof item.gridParams?.y === 'number' && Number.isFinite(item.gridParams.y)
      ? item.gridParams.y
      : fallbackY,
  w: item.gridParams?.w ?? 6,
  h: item.gridParams?.h ?? 6,
  minW: item.gridParams?.minW ?? 3,
  minH: item.gridParams?.minH ?? 4,
})

export const expandResponsiveLayouts = (lg: Layout[]): Layouts => ({
  lg,
  md: lg,
  sm: lg,
  xs: lg,
})

export const mergeLayoutsWithItems = (
  saved: Layouts | null,
  items: GridItemConfig[],
  fallback: Layouts,
): Layouts => {
  const itemIds = new Set(items.map(i => i.id))
  const breakpoints = ['lg', 'md', 'sm', 'xs'] as const
  const merged: Layouts = {}

  for (const bp of breakpoints) {
    const source = saved?.[bp] ?? saved?.lg ?? fallback[bp] ?? fallback.lg ?? []
    const base = fallback[bp] ?? fallback.lg ?? []
    const byId = new Map(source.map(l => [l.i, l]))

    let fallbackY = 0
    merged[bp] = items.map(item => {
      const existing = byId.get(item.id)
      const defaults = base.find(l => l.i === item.id)
      const layout = sanitizeLayoutItem(
        existing ?? defaults ?? layoutFromItem(item, fallbackY),
        fallbackY,
      )
      fallbackY = layout.y + layout.h
      return layout
    })

    merged[bp] = merged[bp]!.filter(l => itemIds.has(l.i))
  }

  return merged
}
