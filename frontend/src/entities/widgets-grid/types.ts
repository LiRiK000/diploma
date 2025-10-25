import { ReactNode } from 'react'
import { ResponsiveProps, Layouts } from 'react-grid-layout'

export interface GridItem {
  id: string
  content: ReactNode
}

export interface GridProps {
  items: GridItem[]
  className?: string
  layouts?: Layouts
  compactType?: 'vertical' | 'horizontal' | null | undefined
  isDraggable?: boolean
  isResizable?: boolean
  useCSSTransforms?: boolean
  hideOverflowX?: boolean
  hideOverflowY?: boolean
  config?: ResponsiveProps
}

export type Breakpoint = 'lg' | 'md' | 'sm' | 'xs'
