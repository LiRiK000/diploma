import { useState, useEffect, useMemo, FC } from 'react'
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

  return (
    <div className={styles.fadeContainer}>
      <Grid items={items} isDraggable={isEditing} isResizable={isEditing} />
    </div>
  )
}
