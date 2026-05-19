import React, { useState, useCallback, useEffect } from 'react'
import GridLayout, { Layout, WidthProvider } from 'react-grid-layout'
import { Button, Space } from 'antd'
import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import styles from './WidgetGrid.module.scss'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { WidgetLoader } from '@entities/widget/ui'

const ResponsiveGridLayout = WidthProvider(GridLayout)

interface WidgetData {
  id: string
  key: string
  type: string
  title: string
  settings?: any
  layout?: any
}

interface WidgetGridProps {
  widgets: WidgetData[]
  initialLayout: Layout[]
  onSaveLayout: (newLayout: Layout[]) => Promise<void>
  onRemoveWidget: (id: string) => Promise<void>
  isEditingExternal: boolean
  setIsEditingExternal: (isEditing: boolean) => void
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  initialLayout,
  onSaveLayout,
  onRemoveWidget,
  isEditingExternal,
  setIsEditingExternal,
}) => {
  const [layout, setLayout] = useState<Layout[]>(initialLayout)
  const [isSaving, setIsSaving] = useState(false)
  const [activeFullscreenId, setActiveFullscreenId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const normalizedLayout = widgets.map(w => ({
      i: w.id,
      x: Number(w.layout?.x) ?? 0,
      y: Number(w.layout?.y) ?? 0,
      w: Number(w.layout?.w) || 6,
      h: Number(w.layout?.h) || 4,
    }))

    setLayout(normalizedLayout)
  }, [widgets])

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSaveLayout(layout)
      setIsEditingExternal(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleFullscreen = useCallback(
    (widgetId: string, isFullscreen: boolean) => {
      setActiveFullscreenId(isFullscreen ? widgetId : null)
    },
    [],
  )

  const isFullscreenActive = activeFullscreenId !== null

  return (
    <div>
      {!isFullscreenActive && (
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Space>
            {isEditingExternal ? (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={isSaving}
                style={{
                  borderRadius: 'var(--border-radius-primary)',
                  height: 38,
                }}
              >
                Сохранить сетку
              </Button>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditingExternal(true)}
                style={{
                  borderRadius: 'var(--border-radius-primary)',
                  height: 38,
                }}
              >
                Конструктор доски
              </Button>
            )}
          </Space>
        </div>
      )}

      <div
        className={[
          styles.gridContainer,
          isEditingExternal && styles.isEditing,
          isFullscreenActive && styles.fullscreenActive,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <ResponsiveGridLayout
          className="layout"
          layout={layout}
          onLayoutChange={handleLayoutChange}
          cols={12}
          rowHeight={80}
          isDraggable={isEditingExternal && !isFullscreenActive}
          isResizable={isEditingExternal && !isFullscreenActive}
          margin={[16, 16]}
          draggableHandle=".react-grid-dragHandle-wrapper"
        >
          {widgets.map(widget => {
            const isCurrentWidgetFullscreen = activeFullscreenId === widget.id

            return (
              <div
                key={widget.id}
                className={[
                  styles.gridItem,
                  isCurrentWidgetFullscreen && styles.containsFullscreen,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {isCurrentWidgetFullscreen && (
                  <div className={styles.gridItemPlaceholder} />
                )}

                <WidgetLoader
                  id={widget.id}
                  type={widget.type}
                  title={widget.title}
                  isEditing={isEditingExternal}
                  settings={widget.settings}
                  isFullscreen={isCurrentWidgetFullscreen}
                  onFullscreenChange={isFullscreen =>
                    handleToggleFullscreen(widget.id, isFullscreen)
                  }
                  onDeleteClick={onRemoveWidget}
                />
              </div>
            )
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  )
}
