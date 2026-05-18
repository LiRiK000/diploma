import { CSSProperties, FC } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useFullscreenStore, useLayoutStore } from '../../model/store'
import { GRID_ID } from '../../constants'
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
import classes from './Grid.module.scss'
import { GridProps } from './types'

export const Grid: FC<GridProps> = ({
  items,
  isDraggable = false,
  isResizable = false,
  hideOverflowX,
  hideOverflowY,
}) => {
  const { containerRef, width } = useGridWidth()
  const isGridReady = width > 0

  // Получаем стейт слоя под конкретный GRID_ID
  const currentLayouts = useLayoutStore(
    state => state.gridLayoutsStates[GRID_ID] || {},
  )
  const updateLayoutsTemporarily = useLayoutStore(
    state => state.updateLayoutsTemporarily,
  )

  const fullScreenItemId = useFullscreenStore(
    state => state.gridFullScreenStates[GRID_ID]?.fullScreenItemId,
  )

  const isFullScreenActive = useFullscreenStore(
    state => state.gridFullScreenStates[GRID_ID]?.isFullscreen,
  )

  return (
    <div
      ref={containerRef}
      className={`
        ${classes.grid}
        ${isFullScreenActive ? classes.fullscreenActive : ''}
      `}
      style={
        {
          overflowX: hideOverflowX ? 'hidden' : 'auto',
          overflowY: hideOverflowY ? 'hidden' : 'auto',
        } as CSSProperties
      }
    >
      {isGridReady && (
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
          onLayoutChange={(_, allLayouts) => {
            updateLayoutsTemporarily(allLayouts)
          }}
        >
          {items.map(item => {
            const isThisWidgetFull =
              isFullScreenActive && fullScreenItemId === item.id

            return (
              <div
                key={item.id}
                className={isThisWidgetFull ? classes.widgetFullscreen : ''}
              >
                <GridItem isEditing={isDraggable}>
                  {item.content({
                    id: item.id,
                    isEditing: isDraggable,
                    rangeConfig: item.rangeConfig,
                    onRangeChange: item.onRangeChange,
                  })}
                </GridItem>
              </div>
            )
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}
