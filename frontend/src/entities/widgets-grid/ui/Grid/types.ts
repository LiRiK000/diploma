import { Layouts } from 'react-grid-layout'

export interface GridItemData {
  id: string
  content: React.ReactNode
}

export interface GridProps {
  items: GridItemData[]
  layouts: Layouts
  isDraggable?: boolean
  isResizable?: boolean
  hideOverflowX?: boolean
  hideOverflowY?: boolean
}
