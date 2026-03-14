import { Layout, Layouts } from 'react-grid-layout'
import { useCallback, useRef } from 'react'
import { saveLayoutsToStorage } from '@widgets/LibrarianDashboardTab/utils'

export const useLayoutPersistence = () => {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleLayoutChange = useCallback((_: Layout[], allLayouts: Layouts) => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = setTimeout(() => {
      saveLayoutsToStorage(allLayouts)
    }, 400)
  }, [])

  return handleLayoutChange
}
