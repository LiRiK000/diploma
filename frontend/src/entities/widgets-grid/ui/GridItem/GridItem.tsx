import { FC, memo } from 'react'
import classes from './GridItem.module.scss'
import { Props } from './types'

export const GridItem: FC<Props> = memo(
  ({ children, isDragging, isResizing, isEditing }) => {
    const containerClassName = [
      classes.widget,
      isDragging && classes.dragging,
      isResizing && classes.resizing,
      isEditing && classes.editing,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={containerClassName}>
        <div className={classes.inner}>{children}</div>
      </div>
    )
  },
)
