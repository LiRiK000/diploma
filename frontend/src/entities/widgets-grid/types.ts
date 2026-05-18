import { ReactNode } from 'react'
import { Layouts } from 'react-grid-layout'

import type { WidgetRangeConfig } from '@entities/statistic/lib/statsQuery'

export interface WidgetGridProps {
  id: string
  isDragging?: boolean
  isResizing?: boolean
  isEditing?: boolean
  rangeConfig?: WidgetRangeConfig
  onRangeChange?: (config: WidgetRangeConfig) => void
}

export interface GridItemConfig {
  id: string
  content: (props: WidgetGridProps) => ReactNode
  rangeConfig?: WidgetRangeConfig
  onRangeChange?: (config: WidgetRangeConfig) => void
  gridParams?: {
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
  }
}
export interface GridProps {
  items: GridItemConfig[]
  layouts?: Layouts
  isDraggable?: boolean
  isResizable?: boolean
  hideOverflowX?: boolean
  hideOverflowY?: boolean
}
