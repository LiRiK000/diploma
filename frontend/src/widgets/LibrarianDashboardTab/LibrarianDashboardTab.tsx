import {
  FullScreenButton,
  Grid,
  ResetLayoutButton,
} from '@entities/widgets-grid'
import { WidgetWrapper } from '@shared/components/WidgetWrapper'
import { Space } from 'antd'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import { getWidgetsLayouts } from './utils'
import { useMemo } from 'react'

export const LibrarianDashboardTab = () => {
  const isEditing = useLibrarianSettingsStore(store => store.isEditing)

  const layouts = useMemo(() => getWidgetsLayouts(), [])

  return (
    <Grid
      hideOverflowX
      useCSSTransforms
      layouts={layouts}
      compactType={'horizontal'}
      isDraggable={isEditing}
      isResizable={isEditing}
      items={[
        {
          id: '1',
          content: (
            <WidgetWrapper
              title="1"
              isLoading={true}
              headerContent={
                <Space>
                  <ResetLayoutButton />
                  <FullScreenButton widgetId="1" />
                </Space>
              }
            >
              <div>1</div>
            </WidgetWrapper>
          ),
        },
        {
          id: '2',
          content: (
            <WidgetWrapper
              title="2"
              isEmpty={true}
              emptyMessage="Нет данных"
              headerContent={
                <Space>
                  <ResetLayoutButton />
                  <FullScreenButton widgetId="2" />
                </Space>
              }
            >
              <div>2</div>
            </WidgetWrapper>
          ),
        },
      ]}
    />
  )
}
