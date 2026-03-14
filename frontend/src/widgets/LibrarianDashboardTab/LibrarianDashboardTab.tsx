import { Grid } from '@entities/widgets-grid'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import { getWidgetsLayouts } from './utils'
import { useMemo } from 'react'

import { LibraryWorkloadWidget } from '@widgets/LibraryWorkloadWidget'
import { LibrarianKpiWidget } from '@widgets/LibrarianKpiWidget'
import { OverdueTrendWidget } from '@widgets/OverdueTrendWidget'
import { TopGenresWidget } from '@widgets/TopGenresWidget'

export const LibrarianDashboardTab = () => {
  const isEditing = useLibrarianSettingsStore(state => state.isEditing)

  const layouts = useMemo(() => getWidgetsLayouts(), [])

  const items = useMemo(
    () => [
      {
        id: '1',
        content: <LibrarianKpiWidget />,
      },
      {
        id: '2',
        content: <OverdueTrendWidget />,
      },
      {
        id: '3',
        content: <LibraryWorkloadWidget />,
      },
      {
        id: '4',
        content: <TopGenresWidget />,
      },
    ],
    [],
  )

  return (
    <Grid
      layouts={layouts}
      items={items}
      compactType="vertical"
      isDraggable={isEditing}
      isResizable={isEditing}
      hideOverflowX
    />
  )
}
