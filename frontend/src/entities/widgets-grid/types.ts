import { ReactNode } from 'react'
import { Layouts } from 'react-grid-layout'

export interface WidgetGridProps {
  id: string
  isDragging?: boolean
  isResizing?: boolean
  isEditing?: boolean
}

export interface GridItemConfig {
  id: string
  content: (props: WidgetGridProps) => ReactNode
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
