import { Layout } from 'react-grid-layout'

export interface GridMetrics {
  cols: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
  width: number
}

export interface PixelRect {
  left: number
  top: number
  width: number
  height: number
}

export const layoutCellToPixels = (
  cell: Pick<Layout, 'x' | 'y' | 'w' | 'h'>,
  metrics: GridMetrics,
): PixelRect => {
  const { cols, rowHeight, margin, containerPadding, width } = metrics
  const [marginX, marginY] = margin
  const [padX, padY] = containerPadding

  const innerWidth = Math.max(0, width - padX * 2)
  const colWidth = (innerWidth - marginX * (cols - 1)) / cols

  const left = padX + cell.x * (colWidth + marginX)
  const top = padY + cell.y * (rowHeight + marginY)
  const boxWidth = cell.w * colWidth + Math.max(0, cell.w - 1) * marginX
  const boxHeight = cell.h * rowHeight + Math.max(0, cell.h - 1) * marginY

  return { left, top, width: boxWidth, height: boxHeight }
}
