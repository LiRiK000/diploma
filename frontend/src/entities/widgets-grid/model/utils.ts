import { GRID_ID, LAYOUTS_STORAGE_KEY } from '../constants'

export const getLocalStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error)
    return null
  }
}

export const setLocalStorageItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error)
  }
}

export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error)
  }
}

export const hasLayoutInLocalStorage = (): boolean => {
  return !!getLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID)
}
