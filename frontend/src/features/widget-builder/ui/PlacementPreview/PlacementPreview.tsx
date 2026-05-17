import { Layout, Layouts } from 'react-grid-layout'
import { getSizePreset } from '../../config/widgetOptions' // Убедитесь, что путь правильный
import { GRID_COLS } from '@entities/widgets-grid/ui/Grid/model/constants'

export type PlacementZone = 'auto' | 'top' | 'bottom' | 'left' | 'right'

export interface NewWidgetPlacement {
  w?: number
  h?: number
  minW?: number
  minH?: number
  zone?: PlacementZone
  sizePreset?: string
  placement?: PlacementZone
}

const DEFAULT_W = 6
const DEFAULT_H = 6

const bottomY = (layout: Layout[]) =>
  layout.reduce((max, item) => Math.max(max, item.y + item.h), 0)

const overlaps = (
  a: { x: number; y: number; w: number; h: number },
  b: Layout,
) =>
  !(
    a.x + a.w <= b.x ||
    a.x >= b.x + b.w ||
    a.y + a.h <= b.y ||
    a.y >= b.y + b.h
  )

const findFreePosition = (
  layout: Layout[],
  cols: number,
  w: number,
  h: number,
): { x: number; y: number } => {
  const safeW = Math.min(w, cols)
  const maxY = Math.max(bottomY(layout), 0)

  for (let y = 0; y <= maxY + h; y++) {
    for (let x = 0; x <= cols - safeW; x++) {
      const candidate = { x, y, w: safeW, h }
      if (!layout.some(item => overlaps(candidate, item))) {
        return { x, y }
      }
    }
  }

  return { x: 0, y: maxY }
}

const computeForCols = (
  layout: Layout[],
  cols: number,
  {
    w,
    h,
    minW,
    minH,
    zone,
  }: {
    w: number
    h: number
    minW?: number
    minH?: number
    zone: PlacementZone
  },
  widgetId: string,
): Layout => {
  const safeW = Math.min(w, cols)
  const minWidth = minW ? Math.min(minW, safeW) : Math.min(2, safeW)

  const base = {
    i: widgetId,
    w: safeW,
    h,
    minW: minWidth,
    minH: minH ?? 2,
  }

  if (zone === 'top') {
    return { ...base, x: 0, y: 0 }
  }

  if (zone === 'bottom') {
    return { ...base, x: 0, y: bottomY(layout) }
  }

  if (zone === 'left') {
    const leftColEnd = cols <= 4 ? cols : Math.ceil(cols / 2)
    const slotW = Math.min(safeW, leftColEnd)
    const leftLayout = layout.filter(l => l.x + l.w <= leftColEnd)
    const pos = findFreePosition(leftLayout, leftColEnd, slotW, h)
    return { ...base, w: slotW, x: pos.x, y: pos.y }
  }

  if (zone === 'right') {
    const rightStart = cols <= 4 ? 0 : Math.floor(cols / 2)
    const slotW = cols <= 4 ? cols : Math.min(safeW, cols - rightStart)
    const rightLayout = layout
      .filter(l => l.x >= rightStart)
      .map(l => ({ ...l, x: l.x - rightStart }))
    const pos = findFreePosition(rightLayout, cols - rightStart, slotW, h)
    return { ...base, w: slotW, x: rightStart + pos.x, y: pos.y }
  }

  const pos = findFreePosition(layout, cols, safeW, h)
  return { ...base, x: pos.x, y: pos.y }
}

export const insertWidgetIntoLayouts = (
  layouts: Layouts,
  widgetId: string,
  placement: NewWidgetPlacement,
): Layouts => {
  const result: Layouts = {}

  const safeLayouts =
    Object.keys(layouts).length > 0
      ? layouts
      : { lg: [], md: [], sm: [], xs: [] }

  // Умный маппинг: если w/h нет, но передан текстовый пресет (например, 'standard') — берем цифры из него
  let targetW = placement.w
  let targetH = placement.h

  if ((!targetW || !targetH) && placement.sizePreset) {
    const preset = getSizePreset(placement.sizePreset as any)
    targetW = preset.w
    targetH = preset.h
  }

  // Фиксируем финальные значения ширины и высоты
  const finalW = targetW ?? DEFAULT_W
  const finalH = targetH ?? DEFAULT_H
  const finalZone = placement.zone ?? placement.placement ?? 'auto'

  for (const [bp, layout] of Object.entries(safeLayouts)) {
    const cols = GRID_COLS[bp as keyof typeof GRID_COLS] ?? GRID_COLS.lg
    const list = layout ?? []

    const newItem = computeForCols(
      list,
      cols,
      {
        w: finalW,
        h: finalH,
        zone: finalZone,
        minW: placement.minW,
        minH: placement.minH,
      },
      widgetId,
    )
    result[bp] = [...list, newItem]
  }

  return result
}
