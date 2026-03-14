import { FC, memo } from 'react'
import classes from './GridItem.module.scss'
import { Props } from './types'

export const GridItem: FC<Props> = memo(
  ({ children, isDragging, isResizing, isEditing }) => {
    return (
      <div
        className={`${classes.widget}
        ${isDragging ? classes.dragging : ''}
        ${isResizing ? classes.resizing : ''}
        ${isEditing ? classes.editing : ''}
        `}
      >
        {children}
      </div>
    )
  },
)
