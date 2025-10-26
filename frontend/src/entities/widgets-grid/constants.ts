export const BREAKPOINTS = {
  lg: 1440,
  md: 1200,
  sm: 996,
  xs: 778,
} as const

export const LAYOUTS_STORAGE_KEY = 'librarian_layouts'
export const LAYOUTS_CHANGED_SIGN_KEY = 'librarian_layouts_changed'

export const COLS = {
  lg: 24,
  md: 24,
  sm: 12,
  xs: 8,
} as const

export const ROWS = 24

export const WIDGET_MARGINS = [20, 20] as const
export const CONTAINER_PADDING = [0, 0] as const

export const DEFAULT_WIDGET_SIZES = {
  lg: { w: 8, h: 8 },
  md: { w: 8, h: 6 },
  sm: { w: 6, h: 6 },
  xs: { w: 8, h: 6 },
} as const

export const FULLSCREEN_WIDGET_SIZES = {
  lg: { w: 24, h: 24 },
  md: { w: 24, h: 24 },
  sm: { w: 12, h: 12 },
  xs: { w: 8, h: 8 },
} as const

export const GRID_ID = 'librarian_grid' as const
