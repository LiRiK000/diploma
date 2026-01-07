import { CSSProperties, ReactNode } from 'react'

export interface IWidgetWrapper {
  title?: string
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
