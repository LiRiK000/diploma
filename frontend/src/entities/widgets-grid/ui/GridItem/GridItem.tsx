import { FC, memo } from 'react'
import classes from './GridItem.module.scss'
import { GridItemProps } from './types'

export const GridItem: FC<GridItemProps> = memo(
  ({ children, isDragging, isResizing }) => {
    return (
      <div
        className={`${classes.widget}
                ${isDragging ? classes.widget_dragging : ''}
                ${isResizing ? classes.widget_resizing : ''}`}
      >
        <div className={classes.widget__content}>{children}</div>
      </div>
    )
  },
)
