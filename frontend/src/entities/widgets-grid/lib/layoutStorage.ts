import { Layout, Layouts } from 'react-grid-layout'
import { GRID_ID, LAYOUTS_STORAGE_KEY } from '../constants'
import { sanitizeLayouts } from './sanitizeLayout'

const LEGACY_STORAGE_KEY = 'dashboard_layout'

const isValidLayout = (item: unknown): item is Layout =>
  typeof item === 'object' &&
  item !== null &&
  'i' in item &&
  typeof (item as Layout).i === 'string' &&
  'x' in item &&
  'y' in item &&
  'w' in item &&
  'h' in item

export const loadLayoutsFromStorage = (): Layouts | null => {
  try {
    const raw = localStorage.getItem(LAYOUTS_STORAGE_KEY + GRID_ID)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (
        parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as Layouts).lg)
      ) {
        return sanitizeLayouts(parsed as Layouts)
      }
    }

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy)
      if (
        parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as Layouts).lg)
      ) {
        const layouts = sanitizeLayouts(parsed as Layouts)
        localStorage.setItem(
          LAYOUTS_STORAGE_KEY + GRID_ID,
          JSON.stringify(layouts),
        )
        localStorage.removeItem(LEGACY_STORAGE_KEY)
        return layouts
      }
    }
  } catch {
    return null
  }
  return null
}

export const saveLayoutsToStorage = (layouts: Layouts) => {
  localStorage.setItem(
    LAYOUTS_STORAGE_KEY + GRID_ID,
    JSON.stringify(sanitizeLayouts(layouts)),
  )
}
