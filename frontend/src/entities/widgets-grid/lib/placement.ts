import { Layout, Layouts } from 'react-grid-layout'
import { GRID_COLS } from '../ui/Grid/model/constants'

export type PlacementZone = 'auto' | 'top' | 'bottom' | 'left' | 'right'

export interface NewWidgetPlacement {
  w: number
  h: number
  minW?: number
  minH?: number
  zone?: PlacementZone
}

// Дефолтные размеры на случай, если из конструктора прилетели пустые/нулевые w и h
const DEFAULT_W = 4
const DEFAULT_H = 3

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
  const maxY = Math.max(bottomY(layout), 0) // Безопасный старт с 0, а не с 1

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
  { w, h, minW, minH, zone }: NewWidgetPlacement,
  widgetId: string,
): Layout => {
  // 1. Защита от пустых размеров (fallback на дефолты)
  const baseW = w || DEFAULT_W
  const baseH = h || DEFAULT_H

  // Ширина не может быть больше, чем всего колонок в текущем брейкпоинте
  const safeW = Math.min(baseW, cols)
  const minWidth = minW ? Math.min(minW, safeW) : Math.min(2, safeW)

  const base = {
    i: widgetId,
    w: safeW,
    h: baseH,
    minW: minWidth,
    minH: minH ?? 2,
  }

  if (zone === 'top') {
    return { ...base, x: 0, y: 0 }
  }

  if (zone === 'bottom') {
    return { ...base, x: 0, y: bottomY(layout) }
  }

  // Зона СЛЕВА
  if (zone === 'left') {
    // На мобилках (cols <= 4) отдаем всю ширину экрана, иначе делим пополам
    const leftColEnd = cols <= 4 ? cols : Math.ceil(cols / 2)
    const slotW = Math.min(safeW, leftColEnd)

    const leftLayout = layout.filter(l => l.x + l.w <= leftColEnd)
    const pos = findFreePosition(leftLayout, leftColEnd, slotW, baseH)

    return { ...base, w: slotW, x: pos.x, y: pos.y }
  }

  // Зона СПРАВА
  if (zone === 'right') {
    // На мобилках (cols <= 4) смещаем в самый левый край и даем полную ширину
    const rightStart = cols <= 4 ? 0 : Math.floor(cols / 2)
    const slotW = cols <= 4 ? cols : Math.min(safeW, cols - rightStart)

    const rightLayout = layout
      .filter(l => l.x >= rightStart)
      .map(l => ({ ...l, x: l.x - rightStart }))

    const pos = findFreePosition(rightLayout, cols - rightStart, slotW, baseH)
    return { ...base, w: slotW, x: rightStart + pos.x, y: pos.y }
  }

  // Зона АВТО (в конец сетки)
  const pos = findFreePosition(layout, cols, safeW, baseH)
  return { ...base, x: pos.x, y: pos.y }
}

export const insertWidgetIntoLayouts = (
  layouts: Layouts,
  widgetId: string,
  placement: NewWidgetPlacement,
): Layouts => {
  const result: Layouts = {}

  // Гарантируем, что если layouts пришел пустой, мы проинициализируем основные брейкпоинты
  const safeLayouts =
    Object.keys(layouts).length > 0
      ? layouts
      : { lg: [], md: [], sm: [], xs: [] }

  for (const [bp, layout] of Object.entries(safeLayouts)) {
    const cols = GRID_COLS[bp as keyof typeof GRID_COLS] ?? GRID_COLS.lg
    const list = layout ?? []

    const newItem = computeForCols(
      list,
      cols,
      { ...placement, zone: placement.zone ?? 'auto' },
      widgetId,
    )
    result[bp] = [...list, newItem]
  }

  return result
}
