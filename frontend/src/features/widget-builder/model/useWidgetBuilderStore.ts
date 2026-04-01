import { create } from 'zustand'

export type WidgetType = 'bar' | 'line' | 'pie'
export type DataSource =
  | 'popular_genres'
  | 'popular_authors'
  | 'workload'
  | 'overdue'

export interface WidgetConfig {
  title: string
  type: WidgetType
  source: DataSource
  range: 'week' | 'month' | 'year'
}

interface WidgetBuilderState {
  config: WidgetConfig
  isOpen: boolean
  setOpen: (open: boolean) => void
  updateConfig: (update: Partial<WidgetConfig>) => void
  reset: () => void
  onSave?: (config: WidgetConfig) => void
  setOnSave: (fn: (config: WidgetConfig) => void) => void
  save: () => void
}

const defaultConfig: WidgetConfig = {
  title: 'Новый отчет',
  type: 'bar',
  source: 'popular_genres',
  range: 'week',
}

export const useWidgetBuilderStore = create<WidgetBuilderState>((set, get) => ({
  config: defaultConfig,
  isOpen: false,
  setOpen: isOpen => set({ isOpen }),
  updateConfig: update =>
    set(state => ({ config: { ...state.config, ...update } })),
  reset: () => set({ config: defaultConfig }),
  setOnSave: fn => set({ onSave: fn }),
  save: () => {
    const { config, onSave, reset, setOpen } = get()
    if (onSave) onSave(config)
    reset()
    setOpen(false)
  },
}))
