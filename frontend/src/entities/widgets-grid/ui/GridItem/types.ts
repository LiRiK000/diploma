import { ReactNode } from 'react'

export interface GridItemProps {
  children: ReactNode
  isDragging: boolean
  isResizing: boolean
}
