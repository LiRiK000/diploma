import { create } from 'zustand'
import { IFullScreenState, ILayoutState } from './types'
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
import { Layouts } from 'react-grid-layout'

export const useFullscreenStore = create<IFullScreenState>(set => ({
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

export const useLayoutStore = create<ILayoutState>((set, get) => ({
  gridLayoutsStates: {},
  hasLayoutsChanged: {},
  loadLayouts: () => {
    const savedLayouts = getLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID)
    if (!savedLayouts) return

    try {
      const layouts = JSON.parse(savedLayouts)
      set({
        gridLayoutsStates: { ...get().gridLayoutsStates, [GRID_ID]: layouts },
      })
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
      set({
        hasLayoutsChanged: {
          ...get().hasLayoutsChanged,
          [GRID_ID]: hasChanged,
        },
      })
    } catch (error) {
      console.error('Error parsing hasLayoutsChanged:', error)
    }
  },
  saveLayouts: (layouts: Layouts) => {
    setLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID, JSON.stringify(layouts))
    set({
      gridLayoutsStates: { ...get().gridLayoutsStates, [GRID_ID]: layouts },
    })
  },
  removeLayouts: () => {
    removeLocalStorageItem(LAYOUTS_STORAGE_KEY + GRID_ID)
    setLocalStorageItem(LAYOUTS_CHANGED_SIGN_KEY + GRID_ID, 'false')
    set({
      gridLayoutsStates: { ...get().gridLayoutsStates, [GRID_ID]: null },
      hasLayoutsChanged: { ...get().hasLayoutsChanged, [GRID_ID]: false },
    })
  },
  setLayoutsChanged: (hasChanged: boolean) => {
    setLocalStorageItem(
      LAYOUTS_CHANGED_SIGN_KEY + GRID_ID,
      hasChanged.toString(),
    )
    set({
      hasLayoutsChanged: {
        ...get().hasLayoutsChanged,
        [GRID_ID]: hasChanged,
      },
    })
  },
}))
