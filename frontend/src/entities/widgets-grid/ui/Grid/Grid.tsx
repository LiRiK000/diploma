// FIXME Почему-то е работает выключение перетаскивания и изменения размера в fullscreen режиме
// TODO Понять почему не работает и исправить в идеале, текущий подход работает, но он не идеальный
import {
  CSSProperties,
  FC,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  Layout,
  Layouts,
  Responsive as ResponsiveGridLayout,
} from 'react-grid-layout'
import classes from './Grid.module.scss'
import {
  BREAKPOINTS,
  COLS,
  CONTAINER_PADDING,
  GRID_ID,
  ROWS,
  WIDGET_MARGINS,
} from '../../constants'
import { GridProps } from '../../types'
import { useShallow } from 'zustand/react/shallow'
import { useFullscreenStore, useLayoutStore } from '../../model/store'
import { GridItem } from '../GridItem/GridItem'
import { hasLayoutInLocalStorage } from '../../model/utils'
import { createInitialLayouts } from '../../lib/utils'

export const Grid: FC<GridProps> = props => {
  const {
    items,
    layouts: propLayouts,
    isDraggable,
    isResizable,
    useCSSTransforms = true,
    compactType = 'vertical',
    config = {},
    hideOverflowX,
    hideOverflowY,
  } = props

  const [isFullscreen, fullScreenItemId] = useFullscreenStore(
    useShallow(store => [
      store.gridFullScreenStates[GRID_ID]?.isFullscreen,
      store.gridFullScreenStates[GRID_ID]?.fullScreenItemId,
    ]),
  )

  const {
    layout,
    saveLayouts,
    setLayoutsChanged,
    loadLayouts,
    loadHasLayoutsChanged,
  } = useLayoutStore(
    useShallow(store => ({
      layout: store.gridLayoutsStates[GRID_ID],
      saveLayouts: store.saveLayouts,
      loadLayouts: store.loadLayouts,
      setLayoutsChanged: store.setLayoutsChanged,
      loadHasLayoutsChanged: store.loadHasLayoutsChanged,
    })),
  )

  useLayoutEffect(() => {
    if (layout) return

    if (hasLayoutInLocalStorage()) {
      loadLayouts()
      loadHasLayoutsChanged()
    } else if (propLayouts) {
      saveLayouts(propLayouts)
    } else {
      const newLayout = createInitialLayouts(items.map(item => item.id))
      saveLayouts(newLayout)
    }
  }, [
    layout,
    loadLayouts,
    loadHasLayoutsChanged,
    saveLayouts,
    propLayouts,
    items,
  ])

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [rowHeight, setRowHeight] = useState(0)
  const [gridWidth, setGridWidth] = useState(0)

  useLayoutEffect(() => {
    const gridContainer = gridContainerRef.current
    if (!gridContainer) return

    const updateGridSizes = () => {
      setRowHeight(Math.floor(gridContainer.clientHeight / ROWS) - 1)
      setGridWidth(gridContainer.clientWidth)
    }

    updateGridSizes()

    const resizeObserver = new ResizeObserver(updateGridSizes)
    resizeObserver.observe(gridContainer)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const handleLayoutChange = useCallback(
    (_: Layout[], allLayouts: Layouts) => {
      if (!isFullscreen) {
        saveLayouts(allLayouts)
      }
    },
    [isFullscreen, saveLayouts],
  )

  const handleDragStart = useCallback(() => setIsDragging(true), [])
  const handleDragStop = useCallback(() => {
    setIsDragging(false)
    setLayoutsChanged(true)
  }, [setLayoutsChanged])

  const handleResizeStart = useCallback(() => setIsResizing(true), [])
  const handleResizeStop = useCallback(() => {
    setIsResizing(false)
    setLayoutsChanged(true)
  }, [setLayoutsChanged])

  const gridContainerRef = useRef<HTMLDivElement>(null)

  const filteredItems = isFullscreen
    ? items.filter(item => item.id === fullScreenItemId)
    : items

  const gridIsDraggable = !isFullscreen && isDraggable
  const gridIsResizable = !isFullscreen && isResizable

  return (
    <div
      ref={gridContainerRef}
      className={classes.grid}
      style={
        {
          overflowX: hideOverflowX ? 'hidden' : 'auto',
          overflowY: hideOverflowY ? 'hidden' : 'auto',
        } as CSSProperties
      }
    >
      {layout && (
        <>
          {isFullscreen ? (
            <div className={classes.grid__fullscreen}>
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={classes.grid__item}
                  data-fullscreen="true"
                >
                  <GridItem isDragging={false} isResizing={false}>
                    {item.content}
                  </GridItem>
                </div>
              ))}
            </div>
          ) : (
            <ResponsiveGridLayout
              width={gridWidth}
              className={`layout ${gridIsResizable ? 'resizable-grid' : 'resizable-grid_hidden'}`}
              layouts={layout}
              breakpoints={BREAKPOINTS}
              cols={COLS}
              rowHeight={rowHeight - WIDGET_MARGINS[1] + 1.5}
              margin={WIDGET_MARGINS as [number, number]}
              containerPadding={CONTAINER_PADDING as [number, number]}
              onLayoutChange={handleLayoutChange}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
              onResizeStart={handleResizeStart}
              onResizeStop={handleResizeStop}
              isDraggable={gridIsDraggable}
              isResizable={gridIsResizable}
              isBounded={true}
              compactType={compactType}
              useCSSTransforms={useCSSTransforms}
              innerRef={gridContainerRef}
              {...config}
            >
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={classes.grid__item}
                  data-fullscreen="false"
                >
                  <GridItem isDragging={isDragging} isResizing={isResizing}>
                    {item.content}
                  </GridItem>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </>
      )}
    </div>
  )
}
