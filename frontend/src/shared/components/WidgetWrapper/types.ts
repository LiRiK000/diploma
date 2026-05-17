import { CSSProperties, ReactNode } from 'react'

export interface IWidgetWrapper {
  id: string
  title?: string
  subtitle?: string
  onRemove?: () => void
  className?: string
  style?: CSSProperties
  contentClass?: string
  children?: ReactNode
  headerContent?: ReactNode
  beforeTitle?: ReactNode
  afterTitle?: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: ReactNode | string
}
