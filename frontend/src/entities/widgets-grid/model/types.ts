import { Layouts } from 'react-grid-layout'

export interface IFullScreenProperties {
  isFullscreen: boolean
  fullScreenItemId: string | null
}

export interface IFullScreenState {
  gridFullScreenStates: Record<string, IFullScreenProperties>
  toggleFullscreen: (itemId?: string) => void
}
interface ILayoutProperties {
  gridLayoutsStates: Record<string, Layouts | null>
  hasLayoutsChanged: Record<string, boolean>
}

export interface ILayoutState extends ILayoutProperties {
  loadLayouts: () => void
  saveLayouts: (layouts: Layouts) => void
  removeLayouts: () => void
  loadHasLayoutsChanged: () => void
  setLayoutsChanged: (hasChanged: boolean) => void
}
