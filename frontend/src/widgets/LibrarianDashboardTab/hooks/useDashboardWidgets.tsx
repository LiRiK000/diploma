import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Layouts } from 'react-grid-layout'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import {
  useWidgetBuilderStore,
  WidgetConfig,
} from '@features/widget-builder/model/useWidgetBuilderStore'
import { getSizePreset } from '@features/widget-builder/config/widgetOptions'
import { GridItemConfig, WidgetGridProps } from '@entities/widgets-grid/types'
import { loadLayoutsFromStorage, saveLayoutsToStorage } from '@entities/widgets-grid/lib/layoutStorage'
import { insertWidgetIntoLayouts } from '@entities/widgets-grid/lib/placement'
import { useLayoutStore } from '@entities/widgets-grid/model/store'
import { GRID_ID } from '@entities/widgets-grid/constants'
import { LibrarianKpiWidget } from '@widgets/LibrarianKpiWidget'
import { OverdueTrendWidget } from '@widgets/OverdueTrendWidget'
import { LibraryWorkloadWidget } from '@widgets/LibraryWorkloadWidget'
import { TopGenresWidget } from '@widgets/TopGenresWidget'
import { DynamicWidget } from '../components/DynamicWidget'
import {
  loadCustomWidgets,
  saveCustomWidgets,
  StoredCustomWidget,
} from '../config/customWidgetsStorage'

const createCustomWidget = (config: WidgetConfig): StoredCustomWidget => {
  const size = getSizePreset(config.sizePreset)
  return {
    id: `custom-${Date.now()}`,
    config,
    gridParams: {
      w: size.w,
      h: size.h,
      minW: 3,
      minH: 4,
      x: 0,
    },
  }
}

const persistNewWidgetLayout = (
  widgetId: string,
  config: WidgetConfig,
  fallbackLayouts: Layouts,
) => {
  const size = getSizePreset(config.sizePreset)
  const stored = loadLayoutsFromStorage() ?? fallbackLayouts
  const updated = insertWidgetIntoLayouts(stored, widgetId, {
    w: size.w,
    h: size.h,
    minW: 3,
    minH: 4,
    zone: config.placement,
  })
  saveLayoutsToStorage(updated)
  const { saveLayouts, setLayoutsChanged } = useLayoutStore.getState()
  saveLayouts(updated)
  setLayoutsChanged(true)
}

export const useDashboardWidgets = (fallbackLayouts: Layouts) => {
  const isEditing = useLibrarianSettingsStore(state => state.isEditing)
  const setOnSave = useWidgetBuilderStore(state => state.setOnSave)

  const [customWidgets, setCustomWidgets] = useState<StoredCustomWidget[]>(
    () => loadCustomWidgets(),
  )

  useEffect(() => {
    saveCustomWidgets(customWidgets)
  }, [customWidgets])

  useEffect(() => {
    setOnSave((config: WidgetConfig) => {
      const widget = createCustomWidget(config)
      persistNewWidgetLayout(widget.id, config, fallbackLayouts)
      setCustomWidgets(prev => [...prev, widget])
    })
  }, [setOnSave, fallbackLayouts])

  const removeCustomWidget = useCallback(
    (id: string) => {
      setCustomWidgets(prev => prev.filter(w => w.id !== id))

      const store = useLayoutStore.getState()
      const current =
        store.gridLayoutsStates[GRID_ID] ??
        loadLayoutsFromStorage() ??
        fallbackLayouts

      const updated = Object.fromEntries(
        Object.entries(current).map(([bp, layout]) => [
          bp,
          (layout ?? []).filter(item => item.i !== id),
        ]),
      ) as Layouts

      saveLayoutsToStorage(updated)
      store.saveLayouts(updated)
    },
    [fallbackLayouts],
  )

  const renderWidget = useCallback(
    (
      render: (props: WidgetGridProps) => ReactNode,
    ): GridItemConfig['content'] =>
      (props: WidgetGridProps) =>
        render(props),
    [],
  )

  const items = useMemo<GridItemConfig[]>(() => {
    const staticItems: GridItemConfig[] = [
      {
        id: '1',
        content: renderWidget(props => (
          <LibrarianKpiWidget {...props} isEditing={isEditing} />
        )),
      },
      {
        id: '2',
        content: renderWidget(props => (
          <OverdueTrendWidget {...props} isEditing={isEditing} />
        )),
      },
      {
        id: '3',
        content: renderWidget(props => (
          <LibraryWorkloadWidget {...props} isEditing={isEditing} />
        )),
      },
      {
        id: '4',
        content: renderWidget(props => (
          <TopGenresWidget {...props} isEditing={isEditing} />
        )),
      },
    ]

    const dynamicItems: GridItemConfig[] = customWidgets.map(w => ({
      id: w.id,
      gridParams: w.gridParams,
      onRemove: isEditing ? removeCustomWidget : undefined,
      content: renderWidget(props => (
        <DynamicWidget
          {...props}
          config={w.config}
          isEditing={isEditing}
          onRemove={
            isEditing ? () => removeCustomWidget(w.id) : undefined
          }
        />
      )),
    }))

    return [...staticItems, ...dynamicItems]
  }, [customWidgets, isEditing, removeCustomWidget, renderWidget])

  return { items, isEditing }
}
