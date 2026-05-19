import React, { useState } from 'react'
import { Typography, Spin, Alert, message, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Layout } from 'react-grid-layout'

import { WidgetGrid } from '@features/configure-widgets/ui'
import { AvailableWidgetInfo } from '@features/addWidget/model/availableWidgets'

import {
  useDashboard,
  useUpdateDashboardLayout,
} from '@entities/widget/hooks/useDashboard'

import { WidgetConfigDrawer } from '@features/addWidget/ui/WidgetConfigDrawer/WidgetConfigDrawer'

import { useAddWidgetToDashboard } from '@entities/widget/hooks/useAddWidgetToDashboard'
import { useRemoveWidget } from '@entities/widget/hooks/useRemoveWidget'

import styles from './DashboardPage.module.scss'

const { Title } = Typography

export const DashboardPage: React.FC = () => {
  const dashboardKey = 'admin'

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  const { data: dashboard, isLoading, error } = useDashboard(dashboardKey)
  const { mutateAsync: updateLayout } = useUpdateDashboardLayout(dashboardKey)
  const { mutateAsync: addWidget } = useAddWidgetToDashboard(dashboardKey)
  const { mutateAsync: removeWidget } = useRemoveWidget(dashboardKey)

  const handleSaveLayout = async (newLayout: Layout[]) => {
    const payload = {
      items: newLayout.map(item => ({
        id: item.i,
        layout: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          i: item.i,
        },
      })),
    }

    try {
      await updateLayout(payload)
      message.success('Расположение успешно синхронизировано')
    } catch (err) {
      console.error(err)
      message.error('Не удалось сохранить сетку на сервере')
      throw err
    }
  }

  const handleRemoveWidget = async (widgetId: string) => {
    try {
      await removeWidget(widgetId)
      message.success('Виджет успешно удален')
    } catch (err) {
      console.error(err)
      message.error('Не удалось удалить виджет')
    }
  }

  const activeWidgets = dashboard?.widgets?.filter(w => w.isEnabled) || []
  const initialLayout = activeWidgets.map(w => w.layout)

  const handleAddWidget = async (
    chosenWidget: AvailableWidgetInfo,
    customSettings: any,
  ) => {
    try {
      const currentMaxY = activeWidgets.reduce((max, w) => {
        const widgetY = w.layout?.y ?? 0
        const widgetH = w.layout?.h ?? 0
        return Math.max(max, widgetY + widgetH)
      }, 0)

      const tempId = `temp_${Date.now()}`
      if (!dashboard) return

      await addWidget({
        dashboardId: dashboard.id,
        key: chosenWidget.type,
        type: chosenWidget.type,
        title: chosenWidget.title, // Название, переопределенное пользователем в форме
        isEnabled: true,
        order: dashboard.widgets.length + 1,
        settings: customSettings, // Передаем сформированные настройки в базу
        layout: {
          x: 0,
          y: currentMaxY,
          w: Number(chosenWidget.defaultSize.w),
          h: Number(chosenWidget.defaultSize.h),
          i: tempId,
        },
      })

      message.success(`Виджет "${chosenWidget.title}" добавлен`)
      setIsDrawerOpen(false)
    } catch (err) {
      console.error(err)
      message.error('Ошибка добавления виджета')
    }
  }

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Spin size="large" tip="Синхронизация конфигурации..." />
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Ошибка загрузки"
          description={error?.message || 'Не удалось получить конфигурацию'}
          type="error"
          showIcon
        />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.backgroundGlow} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Title level={2} className={styles.title}>
              {dashboard.title}
            </Title>
            {dashboard.description && (
              <p className={styles.description}>{dashboard.description}</p>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsDrawerOpen(true)}
              className={styles.addButton}
            >
              Конструктор доски
            </Button>
          </div>
        </div>
      </header>

      <WidgetGrid
        widgets={activeWidgets}
        initialLayout={initialLayout}
        onSaveLayout={handleSaveLayout}
        onRemoveWidget={handleRemoveWidget}
        isEditingExternal={isEditing}
        setIsEditingExternal={setIsEditing}
      />

      <WidgetConfigDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  )
}
