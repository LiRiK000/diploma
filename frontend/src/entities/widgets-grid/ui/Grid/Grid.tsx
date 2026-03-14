import { CSSProperties, FC, useLayoutEffect, useState } from 'react'
import { Responsive as ResponsiveGridLayout, Layouts } from 'react-grid-layout'
import classes from './Grid.module.scss'
import { GridItem } from '../GridItem/GridItem'
import {
  GRID_BREAKPOINTS,
  GRID_COLS,
  GRID_CONTAINER_PADDING,
  GRID_MARGIN,
  GRID_ROW_HEIGHT,
  DRAGGABLE_HANDLE,
} from './model/constants'
import { loadLayoutsFromStorage } from '@widgets/LibrarianDashboardTab/utils'
import { useGridWidth } from './hooks/useGridWidth'
import { useLayoutPersistence } from './hooks/useLayoutPersistence'
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
  const [currentLayouts, setCurrentLayouts] = useState<Layouts>(layouts)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const handleLayoutChange = useLayoutPersistence()

  useLayoutEffect(() => {
    const stored = loadLayoutsFromStorage()

    if (stored) {
      setCurrentLayouts(stored)
    } else {
      setCurrentLayouts(layouts)
    }
  }, [layouts])

  return (
    <div
      ref={containerRef}
      className={classes.grid}
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
        draggableHandle={DRAGGABLE_HANDLE}
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
        {items.map(item => (
          <div key={item.id}>
            <GridItem
              isDragging={isDragging}
              isResizing={isResizing}
              isEditing={isDraggable}
            >
              {item.content}
            </GridItem>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
