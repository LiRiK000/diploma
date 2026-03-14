import { FC, memo } from 'react'
import classes from './WidgetWrapper.module.scss'
import { EmptyContent } from './ui/EmptyContent/EmptyContent'
import { Loader } from '../Loader'
import { IWidgetWrapper } from './types'
import { DragOutlined } from '@ant-design/icons'

interface IProfessionalWidget extends IWidgetWrapper {
  isEditing?: boolean
  isDragging?: boolean
  isResizing?: boolean
}

export const WidgetWrapper: FC<IProfessionalWidget> = memo(props => {
  const {
    title,
    beforeTitle,
    afterTitle,
    headerContent,
    children,
    className,
    isEditing,
    isDragging,
    isResizing,
    isLoading,
    isEmpty,
    emptyMessage,
  } = props

  const isShowHeader = afterTitle || beforeTitle || title

  const containerClasses = [
    classes.container,
    className,
    isEditing && classes.isEditing,
    isDragging && classes.isDragging,
    isResizing && classes.isResizing,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClasses}>
      {isEditing && !isDragging && <div className={classes.editOverlay} />}

      {isShowHeader && (
        <div className={`${classes.header} widget-header-drag-handle`}>
          <div className={classes.left}>
            <div className={classes.dragHandle}>
              <DragOutlined />
            </div>

            {beforeTitle}
            {title && <h4 className={classes.title}>{title}</h4>}
            {afterTitle}
          </div>

          <div className={classes.headerActions}>
            {headerContent}
            {isEditing && (
              <span className={classes.editBadge}>ID: {props.id || '...'}</span>
            )}
          </div>
        </div>
      )}

      <div className={classes.content}>
        {isLoading ? (
          <div className={classes.stateWrapper}>
            <Loader fullscreen={false} />
          </div>
        ) : isEmpty ? (
          <div className={classes.stateWrapper}>
            <EmptyContent message={emptyMessage || 'Нет данных'} />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
})
