import type { Layout, Layouts } from 'react-grid-layout'
import { expandResponsiveLayouts } from '@entities/widgets-grid/lib/layoutUtils'

/** Стартовая раскладка встроенных виджетов (id: 1–4) */
const LG_BUILTIN_LAYOUT: Layout[] = [
  { i: '1', x: 0, y: 0, w: 6, h: 10, minW: 3, minH: 4 },
  { i: '2', x: 6, y: 0, w: 6, h: 10, minW: 3, minH: 4 },
  { i: '3', x: 0, y: 10, w: 8, h: 8, minW: 3, minH: 4 },
  { i: '4', x: 8, y: 10, w: 4, h: 8, minW: 3, minH: 4 },
]

export const LIBRARIAN_DEFAULT_LAYOUTS: Layouts = expandResponsiveLayouts(
  LG_BUILTIN_LAYOUT,
)
