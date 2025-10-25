import { Breakpoint } from '../types'
import {
  BREAKPOINTS,
  COLS,
  DEFAULT_WIDGET_SIZES,
  FULLSCREEN_WIDGET_SIZES,
} from '../constants'
import { Layout } from 'react-grid-layout'

export const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

export const createLayout = (
  items: string[],
  breakpoint: Breakpoint,
  fullscreenItemId?: string | null,
): Layout[] => {
  const sizes = fullscreenItemId
    ? FULLSCREEN_WIDGET_SIZES[breakpoint]
    : DEFAULT_WIDGET_SIZES[breakpoint]
  const cols = COLS[breakpoint]

  return items.map((id, index) => {
    if (fullscreenItemId === id) {
      return {
        i: id,
        x: 0,
        y: 0,
        w: COLS[breakpoint],
        h: FULLSCREEN_WIDGET_SIZES[breakpoint].h,
        minW: COLS[breakpoint],
        minH: FULLSCREEN_WIDGET_SIZES[breakpoint].h,
        maxW: COLS[breakpoint],
        maxH: FULLSCREEN_WIDGET_SIZES[breakpoint].h,
        isDraggable: false,
        isResizable: false,
      }
    }

    const itemsPerRow = Math.floor(cols / sizes.w)
    const row = Math.floor(index / itemsPerRow)
    const col = index % itemsPerRow

    return {
      i: id,
      x: col * sizes.w,
      y: row * sizes.h,
      w: sizes.w,
      h: sizes.h,
      minW: Math.max(1, Math.floor(sizes.w * 0.5)),
      minH: Math.max(2, Math.floor(sizes.h * 0.5)),
      maxW: cols,
      maxH: sizes.h * 2,
      isDraggable: !fullscreenItemId,
      isResizable: !fullscreenItemId,
    }
  })
}

export const createInitialLayouts = (
  items: string[],
  fullscreenItemId?: string | null,
) => {
  return (Object.keys(BREAKPOINTS) as Array<Breakpoint>).reduce(
    (acc, breakpoint) => {
      acc[breakpoint] = createLayout(items, breakpoint, fullscreenItemId)
      return acc
    },
    {} as Record<Breakpoint, Layout[]>,
  )
}
