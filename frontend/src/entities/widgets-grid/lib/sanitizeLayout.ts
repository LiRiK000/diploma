import { Layout, Layouts } from 'react-grid-layout'

const toFiniteNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  return fallback
}

export const sanitizeLayoutItem = (item: Layout, fallbackY = 0): Layout => ({
  ...item,
  x: toFiniteNumber(item.x, 0),
  y: toFiniteNumber(item.y, fallbackY),
  w: Math.max(1, toFiniteNumber(item.w, 4)),
  h: Math.max(1, toFiniteNumber(item.h, 4)),
  minW:
    item.minW !== undefined
      ? Math.max(1, toFiniteNumber(item.minW, 2))
      : undefined,
  minH:
    item.minH !== undefined
      ? Math.max(1, toFiniteNumber(item.minH, 2))
      : undefined,
})

export const sanitizeLayouts = (layouts: Layouts): Layouts => {
  const result: Layouts = {}

  for (const [bp, items] of Object.entries(layouts)) {
    if (!Array.isArray(items)) continue

    let fallbackY = 0
    result[bp] = items.map(raw => {
      const layout = sanitizeLayoutItem(raw as Layout, fallbackY)
      fallbackY = layout.y + layout.h
      return layout
    })
  }

  return result
}
