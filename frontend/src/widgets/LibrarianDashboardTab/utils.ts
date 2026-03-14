import { Layouts } from 'react-grid-layout'

export const getWidgetsLayouts = (): Layouts => ({
  lg: [
    { i: '1', x: 0, y: 0, w: 6, h: 8, minW: 3, minH: 4 },
    { i: '2', x: 6, y: 0, w: 6, h: 8, minW: 3, minH: 4 },

    { i: '3', x: 0, y: 8, w: 8, h: 10, minW: 4, minH: 6 },
    { i: '4', x: 8, y: 8, w: 4, h: 10, minW: 3, minH: 6 },
  ],

  md: [
    { i: '1', x: 0, y: 0, w: 5, h: 8 },
    { i: '2', x: 5, y: 0, w: 5, h: 8 },

    { i: '3', x: 0, y: 8, w: 10, h: 10 },
    { i: '4', x: 0, y: 18, w: 10, h: 10 },
  ],

  sm: [
    { i: '1', x: 0, y: 0, w: 6, h: 7 },
    { i: '2', x: 0, y: 7, w: 6, h: 7 },

    { i: '3', x: 0, y: 14, w: 6, h: 9 },
    { i: '4', x: 0, y: 23, w: 6, h: 9 },
  ],

  xs: [
    { i: '1', x: 0, y: 0, w: 4, h: 7 },
    { i: '2', x: 0, y: 7, w: 4, h: 7 },
    { i: '3', x: 0, y: 14, w: 4, h: 9 },
    { i: '4', x: 0, y: 23, w: 4, h: 9 },
  ],
})

const COLS = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
}

const DEFAULT_H = 8
const DEFAULT_W = 4

export const createInitialLayouts = (ids: string[]): Layouts => {
  const create = (cols: number) => {
    let x = 0
    let y = 0

    return ids.map(id => {
      const item = {
        i: id,
        x,
        y,
        w: DEFAULT_W,
        h: DEFAULT_H,
        minW: 3,
        minH: 4,
      }

      x += DEFAULT_W

      if (x + DEFAULT_W > cols) {
        x = 0
        y += DEFAULT_H
      }

      return item
    })
  }

  return {
    lg: create(COLS.lg),
    md: create(COLS.md),
    sm: create(COLS.sm),
    xs: create(COLS.xs),
  }
}

const STORAGE_KEY = 'dashboard_layout'

export const saveLayoutsToStorage = (layouts: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
}

export const loadLayoutsFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
