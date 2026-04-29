import { Layout, Layouts } from 'react-grid-layout'

const isValidLayout = (item: unknown): item is Layout =>
  typeof item === 'object' &&
  item !== null &&
  'i' in item &&
  typeof (item as Layout).i === 'string' &&
  'x' in item &&
  'y' in item &&
  'w' in item &&
  'h' in item

const isLayouts = (value: unknown): value is Layouts =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  (value as Record<string, unknown[]>).lg?.every(isValidLayout)

const STORAGE_KEY = 'dashboard_layout'

export const saveLayoutsToStorage = (layouts: Layouts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
}

export const loadLayoutsFromStorage = (): Layouts | null => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return null

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(raw)
    return isLayouts(parsed) ? parsed : null
  } catch {
    return null
  }
}
