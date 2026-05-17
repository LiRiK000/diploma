import { useEffect, useMemo, FC } from 'react'
import clsx from 'clsx'
import { useShallow } from 'zustand/react/shallow'

import { Grid, useLayoutStore } from '@entities/widgets-grid'
import { GRID_ID } from '@entities/widgets-grid/constants'
import {
  DEFAULT_DASHBOARD_LAYOUTS,
  expandResponsiveLayouts,
  mergeLayoutsWithItems,
} from '@entities/widgets-grid/lib/layoutUtils'
import { loadLayoutsFromStorage } from '@entities/widgets-grid/lib/layoutStorage'

import { useDashboardWidgets } from './hooks/useDashboardWidgets'
import styles from './LibrarianDashboardTab.module.scss'

export const LibrarianDashboardTab: FC = () => {
  const fallbackLayouts = useMemo(
    () => expandResponsiveLayouts(DEFAULT_DASHBOARD_LAYOUTS.lg),
    [],
  )

  const { items, isEditing } = useDashboardWidgets(fallbackLayouts)

  const { initializeDefaultLayouts, isGridInitialized, loadHasLayoutsChanged } =
    useLayoutStore(
      useShallow(state => ({
        initializeDefaultLayouts: state.initializeDefaultLayouts,
        isGridInitialized: !!state.gridLayoutsStates[GRID_ID],
        loadHasLayoutsChanged: state.loadHasLayoutsChanged,
      })),
    )

  useEffect(() => {
    const saved = loadLayoutsFromStorage()
    const merged = mergeLayoutsWithItems(saved, items, fallbackLayouts)
    initializeDefaultLayouts(merged)
    loadHasLayoutsChanged()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- однократная инициализация сетки
  }, [initializeDefaultLayouts, loadHasLayoutsChanged])

  if (!isGridInitialized) {
    return (
      <div className={styles.skeletonDashboard}>
        <div
          className={styles.skeletonItem}
          style={{ gridArea: '1 / 1 / 3 / 7' }}
        />
        <div
          className={styles.skeletonItem}
          style={{ gridArea: '1 / 7 / 3 / 13' }}
        />
        <div
          className={styles.skeletonItem}
          style={{ gridArea: '3 / 1 / 6 / 13' }}
        />
      </div>
    )
  }

  return (
    <div className={clsx(styles.fadeContainer, styles.visible)}>
      <Grid items={items} isDraggable={isEditing} isResizable={isEditing} />
    </div>
  )
}
