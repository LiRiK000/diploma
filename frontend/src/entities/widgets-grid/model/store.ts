import { create } from 'zustand'
import { Layouts } from 'react-grid-layout'
import { IFullScreenState, ILayoutState } from './types' // твой файл типов
import { initialFullScreenState } from './constants'
import {
  GRID_ID,
  LAYOUTS_CHANGED_SIGN_KEY,
  LAYOUTS_STORAGE_KEY,
} from '../constants'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from './utils'

export const useFullscreenStore = create<IFFullScreenState>(set => ({
  gridFullScreenStates: {},
  toggleFullscreen: (itemId?: string) => {
    set(state => {
      const currentGrid =
        state.gridFullScreenStates[GRID_ID] || initialFullScreenState
      const isFullscreen = !currentGrid.isFullscreen
      const fullScreenItemId = isFullscreen ? (itemId ?? null) : null

      return {
        gridFullScreenStates: {
          ...state.gridFullScreenStates,
          [GRID_ID]: {
            isFullscreen,
            fullScreenItemId,
          },
        },
      }
    })
  },
}))

// Расширяем интерфейс твоего ILayoutState в коде (или добавь эти методы в types.ts)
// Мы добавляем:
// - initializeDefaultLayouts (если в локалсторадже пусто)
// - commitLayouts (фиксация изменений на диск)
interface ILayoutStateExtended extends ILayoutState {
  initializeDefaultLayouts: (defaultLayouts: Layouts) => void
  updateLayoutsTemporarily: (layouts: Layouts) => void
  commitLayouts: () => void
}

export const useLayoutStore = create<ILayoutStateExtended>((set, get) => ({
  gridLayoutsStates: {},
  hasLayoutsChanged: {},

  initializeDefaultLayouts: (defaultLayouts: Layouts) => {
    const currentLayouts = get().gridLayoutsStates[GRID_ID]
    if (currentLayouts) return // Уже инициализировано

    const savedLayouts = getLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID)

    if (savedLayouts) {
      try {
        const layouts = JSON.parse(savedLayouts)
        set(state => ({
          gridLayoutsStates: {
            ...state.gridLayoutsStates,
            [GRID_ID]: layouts.lg ? layouts : defaultLayouts,
          },
        }))
        return
      } catch (error) {
        console.error('Error parsing saved layouts:', error)
      }
    }

    // Если в диске пусто, берем дефолтные параметры
    set(state => ({
      gridLayoutsStates: {
        ...state.gridLayoutsStates,
        [GRID_ID]: defaultLayouts,
      },
    }))
  },

  loadLayouts: () => {
    const savedLayouts = getLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID)
    if (!savedLayouts) return

    try {
      const layouts = JSON.parse(savedLayouts)
      set(state => ({
        gridLayoutsStates: { ...state.gridLayoutsStates, [GRID_ID]: layouts },
      }))
    } catch (error) {
      console.error('Error parsing saved layouts:', error)
    }
  },

  loadHasLayoutsChanged: () => {
    const hasChangedJson = getLocalStorageItem(
      LAYOUTS_CHANGED_SIGN_KEY + GRID_ID,
    )
    if (!hasChangedJson) return

    try {
      const hasChanged = JSON.parse(hasChangedJson)
      set(state => ({
        hasLayoutsChanged: {
          ...state.hasLayoutsChanged,
          [GRID_ID]: hasChanged,
        },
      }))
    } catch (error) {
      console.error('Error parsing hasLayoutsChanged:', error)
    }
  },

  // Временное обновление сетки во время перетаскивания (без записи на диск)
  updateLayoutsTemporarily: (layouts: Layouts) => {
    set(state => ({
      gridLayoutsStates: { ...state.gridLayoutsStates, [GRID_ID]: layouts },
      hasLayoutsChanged: { ...state.hasLayoutsChanged, [GRID_ID]: true },
    }))
    setLocalStorageItem(LAYOUTS_CHANGED_SIGN_KEY + GRID_ID, 'true')
  },

  // Принудительное сохранение текущего стейта на диск (вызывается из Хедера)
  commitLayouts: () => {
    const currentLayouts = get().gridLayoutsStates[GRID_ID]
    if (!currentLayouts) return

    setLocalStorageItem(
      LAYOUTS_STORAGE_KEY + GRID_ID,
      JSON.stringify(currentLayouts),
    )
    setLocalStorageItem(LAYOUTS_CHANGED_SIGN_KEY + GRID_ID, 'false')

    set(state => ({
      hasLayoutsChanged: { ...state.hasLayoutsChanged, [GRID_ID]: false },
    }))
  },

  saveLayouts: (layouts: Layouts) => {
    setLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID, JSON.stringify(layouts))
    set(state => ({
      gridLayoutsStates: { ...state.gridLayoutsStates, [GRID_ID]: layouts },
    }))
  },

  removeLayouts: () => {
    removeLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID)
    setLocalStorageItem(LAYOUTS_CHANGED_SIGN_KEY + GRID_ID, 'false')
    set(state => ({
      gridLayoutsStates: { ...state.gridLayoutsStates, [GRID_ID]: null },
      hasLayoutsChanged: { ...state.hasLayoutsChanged, [GRID_ID]: false },
    }))
  },

  setLayoutsChanged: (hasChanged: boolean) => {
    setLocalStorageItem(
      LAYOUTS_CHANGED_SIGN_KEY + GRID_ID,
      hasChanged.toString(),
    )
    set(state => ({
      hasLayoutsChanged: { ...state.hasLayoutsChanged, [GRID_ID]: hasChanged },
    }))
  },
}))
