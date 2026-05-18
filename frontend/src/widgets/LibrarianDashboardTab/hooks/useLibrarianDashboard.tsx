import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useLibrarianSettingsStore } from '@features/librarian-settings'
import { useWidgetBuilderStore } from '@features/widget-builder/model/useWidgetBuilderStore'
import type { GridItemConfig } from '@entities/widgets-grid/types'
import type { WidgetRangeConfig } from '@entities/statistic/lib/statsQuery'
import { GRID_ID } from '@entities/widgets-grid/constants'
import { useLayoutStore } from '@entities/widgets-grid/model/store'
import {
  buildBuiltinGridItems,
  type BuiltinWidgetId,
} from '../model/builtinWidgets'
import { LIBRARIAN_DEFAULT_LAYOUTS } from '../model/defaultLayouts'
import {
  addWidgetToLayouts,
  removeWidgetFromLayouts,
  resolveDashboardLayouts,
} from '../model/dashboardLayout'
import {
  createCustomWidget,
  loadCustomWidgets,
  saveCustomWidgets,
  type StoredCustomWidget,
} from '../model/customWidgetStorage'
import {
  loadBuiltinWidgetRanges,
  saveBuiltinWidgetRanges,
  resolveBuiltinRange,
} from '../model/builtinWidgetSettings'
import { DynamicWidget } from '../components/DynamicWidget'

export function useLibrarianDashboard() {
  const isEditing = useLibrarianSettingsStore(state => state.isEditing)
  const setOnSave = useWidgetBuilderStore(state => state.setOnSave)

  const [customWidgets, setCustomWidgets] = useState<StoredCustomWidget[]>(
    loadCustomWidgets,
  )

  const [builtinRanges, setBuiltinRanges] = useState(() =>
    loadBuiltinWidgetRanges(),
  )

  const { initializeDefaultLayouts, isGridReady, loadHasLayoutsChanged } =
    useLayoutStore(
      useShallow(state => ({
        initializeDefaultLayouts: state.initializeDefaultLayouts,
        isGridReady: !!state.gridLayoutsStates[GRID_ID],
        loadHasLayoutsChanged: state.loadHasLayoutsChanged,
      })),
    )

  useEffect(() => {
    saveCustomWidgets(customWidgets)
  }, [customWidgets])

  useEffect(() => {
    saveBuiltinWidgetRanges(builtinRanges)
  }, [builtinRanges])

  const getBuiltinRange = useCallback(
    (id: BuiltinWidgetId) => resolveBuiltinRange(id, builtinRanges),
    [builtinRanges],
  )

  const setBuiltinRange = useCallback(
    (id: BuiltinWidgetId, config: WidgetRangeConfig) => {
      setBuiltinRanges(prev => ({ ...prev, [id]: config }))
    },
    [],
  )

  const removeCustomWidget = useCallback((id: string) => {
    setCustomWidgets(prev => prev.filter(w => w.id !== id))
    removeWidgetFromLayouts(id, LIBRARIAN_DEFAULT_LAYOUTS)
  }, [])

  const items = useMemo<GridItemConfig[]>(() => {
    const builtins = buildBuiltinGridItems(
      isEditing,
      getBuiltinRange,
      setBuiltinRange,
    )

    const customs: GridItemConfig[] = customWidgets.map(w => ({
      id: w.id,
      gridParams: w.gridParams,
      rangeConfig: {
        preset: w.config.range,
        from: w.config.from,
        to: w.config.to,
      },
      onRangeChange: (range: WidgetRangeConfig) => {
        setCustomWidgets(prev =>
          prev.map(item =>
            item.id === w.id
              ? {
                  ...item,
                  config: {
                    ...item.config,
                    range: range.preset,
                    from: range.from,
                    to: range.to,
                  },
                }
              : item,
          ),
        )
      },
      content: props => (
        <DynamicWidget
          {...props}
          config={w.config}
          isEditing={isEditing}
          onRemove={isEditing ? () => removeCustomWidget(w.id) : undefined}
        />
      ),
    }))

    return [...builtins, ...customs]
  }, [
    customWidgets,
    isEditing,
    getBuiltinRange,
    setBuiltinRange,
    removeCustomWidget,
  ])

  useEffect(() => {
    setOnSave(config => {
      const widget = createCustomWidget(config)
      addWidgetToLayouts(widget.id, config, LIBRARIAN_DEFAULT_LAYOUTS)
      setCustomWidgets(prev => [...prev, widget])
    })
  }, [setOnSave])

  useEffect(() => {
    if (useLayoutStore.getState().gridLayoutsStates[GRID_ID]) return

    const merged = resolveDashboardLayouts(items, LIBRARIAN_DEFAULT_LAYOUTS)
    initializeDefaultLayouts(merged)
    loadHasLayoutsChanged()
  }, [items, initializeDefaultLayouts, loadHasLayoutsChanged])

  return { items, isEditing, isGridReady }
}
