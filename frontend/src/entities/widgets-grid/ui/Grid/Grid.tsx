import { CSSProperties, FC, useLayoutEffect, useState } from 'react'
import { Responsive as ResponsiveGridLayout, Layouts } from 'react-grid-layout'
import { useFullscreenStore } from '@entities/widgets-grid/model/store'
import { GRID_ID } from '@entities/widgets-grid/constants'
import { loadLayoutsFromStorage } from '@widgets/LibrarianDashboardTab/utils'
import { GridItem } from '../GridItem/GridItem'
import {
  GRID_BREAKPOINTS,
  GRID_COLS,
  GRID_CONTAINER_PADDING,
  GRID_MARGIN,
  GRID_ROW_HEIGHT,
  DRAGGABLE_HANDLE,
} from './model/constants'
import { useGridWidth } from './hooks/useGridWidth'
import { useLayoutPersistence } from './hooks/useLayoutPersistence'
import classes from './Grid.module.scss'
import { GridProps } from './types'

export const Grid: FC<GridProps> = ({
  items,
  layouts,
  isDraggable = false,
  isResizable = false,
  hideOverflowX,
  hideOverflowY,
}) => {
  const { containerRef, width } = useGridWidth()
  const [currentLayouts, setCurrentLayouts] = useState<Layouts>(layouts || {})
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const handleLayoutChange = useLayoutPersistence()

  const fullScreenItemId = useFullscreenStore(
    state => state.gridFullScreenStates[GRID_ID]?.fullScreenItemId,
  )
  const isFullScreenActive = useFullscreenStore(
    state => state.gridFullScreenStates[GRID_ID]?.isFullscreen,
  )

  useLayoutEffect(() => {
    const stored = loadLayoutsFromStorage()
    if (stored) {
      setCurrentLayouts(stored)
    } else if (layouts) {
      setCurrentLayouts(layouts)
    }
  }, [layouts])

  return (
    <div
      ref={containerRef}
      className={`${classes.grid} ${isFullScreenActive ? classes.fullscreenActive : ''}`}
      style={
        {
          overflowX: hideOverflowX ? 'hidden' : 'auto',
          overflowY: hideOverflowY ? 'hidden' : 'auto',
        } as CSSProperties
      }
    >
      <ResponsiveGridLayout
        width={width}
        layouts={currentLayouts}
        breakpoints={GRID_BREAKPOINTS}
        cols={GRID_COLS}
        rowHeight={GRID_ROW_HEIGHT}
        margin={GRID_MARGIN}
        containerPadding={GRID_CONTAINER_PADDING}
        preventCollision={false}
        compactType="vertical"
        draggableHandle={`${DRAGGABLE_HANDLE}`}
        isDraggable={isDraggable}
        isResizable={isResizable}
        resizeHandles={['se']}
        useCSSTransforms
        isBounded
        onLayoutChange={(layout, allLayouts) => {
          setCurrentLayouts(allLayouts)
          handleLayoutChange(layout, allLayouts)
        }}
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => setIsResizing(false)}
      >
        {items.map(item => {
          const isThisWidgetFull =
            isFullScreenActive && fullScreenItemId === item.id

          return (
            <div
              key={item.id}
              className={isThisWidgetFull ? classes.widgetFullscreen : ''}
              data-grid={item.gridParams}
            >
              <GridItem
                isDragging={isDragging}
                isResizing={isResizing}
                isEditing={isDraggable}
              >
                {item.content({
                  id: item.id,
                  isDragging,
                  isResizing,
                  isEditing: isDraggable,
                })}
              </GridItem>
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}
