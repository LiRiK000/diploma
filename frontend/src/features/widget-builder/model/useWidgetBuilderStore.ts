import { create } from 'zustand'
import type { DateRangePreset } from '@entities/statistic/model/types'

export type WidgetType = 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'radar'

export type DataSource =
  | 'popular_genres'
  | 'popular_authors'
  | 'workload'
  | 'overdue'
  | 'orders_status'
  | 'overview_activity'

export type WidgetSizePreset = 'compact' | 'standard' | 'wide' | 'tall' | 'hero'
export type WidgetPlacement = 'auto' | 'top' | 'bottom' | 'left' | 'right'

export interface WidgetConfig {
  title: string
  type: WidgetType
  source: DataSource
  range: DateRangePreset
  from?: string
  to?: string
  sizePreset: WidgetSizePreset
  placement: WidgetPlacement
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
  title: 'Новый отчёт',
  type: 'bar',
  source: 'popular_genres',
  range: 'month',
  sizePreset: 'standard',
  placement: 'auto',
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
    if (onSave) onSave({ ...config })
    reset()
    setOpen(false)
  },
}))
