import { FC, memo, ReactNode } from 'react'
import classes from './GridItem.module.scss'

interface GridItemProps {
  children: ReactNode
  isEditing: boolean
}

export const GridItem: FC<GridItemProps> = memo(({ children, isEditing }) => {
  const className = [classes.widget, isEditing && classes.editing]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <div className={classes.inner}>{children}</div>
    </div>
  )
})

GridItem.displayName = 'GridItem'
