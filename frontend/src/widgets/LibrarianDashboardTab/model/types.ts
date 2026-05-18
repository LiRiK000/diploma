import type { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'

export interface DynamicWidgetProps {
  id: string
  config: WidgetConfig
  isEditing?: boolean
  isDragging?: boolean
  isResizing?: boolean
  onRemove?: () => void
}

export interface ChartPoint {
  name: string
  value: number
  issued?: number
  returned?: number
}
