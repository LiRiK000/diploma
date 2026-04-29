import { useState, useEffect, useMemo, FC } from 'react'
import { Layouts } from 'react-grid-layout'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import { LibrarianKpiWidget } from '@widgets/LibrarianKpiWidget'
import { OverdueTrendWidget } from '@widgets/OverdueTrendWidget'
import { LibraryWorkloadWidget } from '@widgets/LibraryWorkloadWidget'
import { TopGenresWidget } from '@widgets/TopGenresWidget'
import { DynamicWidget } from './components/DynamicWidget'
import styles from './LibrarianDashboardTab.module.scss'
import { GridItemConfig, WidgetGridProps } from '@entities/widgets-grid/types'
import { NEW_WIDGET_DEFAULT_PARAMS } from './constans'
import {
  useWidgetBuilderStore,
  WidgetConfig,
} from '@features/widget-builder/model/useWidgetBuilderStore'
import { Grid } from '@entities/widgets-grid'

interface UserWidget {
  id: string
  config: WidgetConfig
  gridParams: GridItemConfig['gridParams']
}

const generateDefaultLayouts = (items: GridItemConfig[]): Layouts => {
  const lg = items.map(item => ({
    i: item.id,
    x: item.gridParams?.x ?? 0,
    y: item.gridParams?.y ?? Infinity,
    w: item.gridParams?.w ?? 6,
    h: item.gridParams?.h ?? 6,
    minW: item.gridParams?.minW,
    minH: item.gridParams?.minH,
  }))

  return { lg, md: lg, sm: lg, xs: lg }
}

export const LibrarianDashboardTab: FC = () => {
  const isEditing = useLibrarianSettingsStore(state => state.isEditing)
  const setOnSave = useWidgetBuilderStore(state => state.setOnSave)

  const [userWidgets, setUserWidgets] = useState<UserWidget[]>([])

  useEffect(() => {
    setOnSave((config: WidgetConfig) => {
      const newWidget: UserWidget = {
        id: `custom-${Date.now()}`,
        config,
        gridParams: { ...NEW_WIDGET_DEFAULT_PARAMS },
      }
      setUserWidgets(prev => [...prev, newWidget])
    })
  }, [setOnSave])

  const items = useMemo<GridItemConfig[]>(() => {
    const staticItems: GridItemConfig[] = [
      {
        id: '1',
        content: (props: WidgetGridProps) => (
          <LibrarianKpiWidget isEditing={isEditing} {...props} />
        ),
      },
      {
        id: '2',
        content: (props: WidgetGridProps) => (
          <OverdueTrendWidget isEditing={isEditing} {...props} />
        ),
      },
      {
        id: '3',
        content: (props: WidgetGridProps) => (
          <LibraryWorkloadWidget isEditing={isEditing} {...props} />
        ),
      },
      {
        id: '4',
        content: (props: WidgetGridProps) => (
          <TopGenresWidget isEditing={isEditing} {...props} />
        ),
      },
    ]

    const dynamicItems: GridItemConfig[] = userWidgets.map(w => ({
      id: w.id,
      gridParams: w.gridParams,
      content: (props: WidgetGridProps) => (
        <DynamicWidget config={w.config} isEditing={isEditing} {...props} />
      ),
    }))

    return [...staticItems, ...dynamicItems]
  }, [userWidgets, isEditing])

  const defaultLayouts = useMemo(() => generateDefaultLayouts(items), [items])

  const layouts = useMemo((): Layouts => {
    const raw = localStorage.getItem('dashboard_layout')
    if (!raw) return defaultLayouts

    try {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed) &&
        Array.isArray((parsed as Record<string, unknown>).lg)
      ) {
        return parsed as Layouts
      }
    } catch {
      // ignore
    }
    return defaultLayouts
  }, [defaultLayouts])

  return (
    <div className={styles.fadeContainer}>
      <Grid
        items={items}
        layouts={layouts}
        isDraggable={isEditing}
        isResizable={isEditing}
      />
    </div>
  )
}
