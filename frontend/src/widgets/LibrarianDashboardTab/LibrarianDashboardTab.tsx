import type { FC } from 'react'
import clsx from 'clsx'
import { Grid } from '@entities/widgets-grid'
import { useLibrarianDashboard } from './hooks/useLibrarianDashboard'
import styles from './LibrarianDashboardTab.module.scss'

export const LibrarianDashboardTab: FC = () => {
  const { items, isEditing, isGridReady } = useLibrarianDashboard()

  if (!isGridReady) {
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
