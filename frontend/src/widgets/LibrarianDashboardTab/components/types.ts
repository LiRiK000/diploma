import { WidgetConfig } from '@features/widget-builder/model/useWidgetBuilderStore'

export interface DynamicWidgetProps {
  id: string
  config: WidgetConfig
  isEditing?: boolean
  isDragging?: boolean
  isResizing?: boolean
}
