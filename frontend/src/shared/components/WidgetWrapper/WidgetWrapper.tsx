import { FC, memo } from 'react'
import { DeleteOutlined, DragOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { EmptyContent } from './ui/EmptyContent/EmptyContent'
import { Loader } from '../Loader'
import { IWidgetWrapper } from './types'
import classes from './WidgetWrapper.module.scss'

interface IProfessionalWidget extends IWidgetWrapper {
  isEditing?: boolean
  isDragging?: boolean
  isResizing?: boolean
}

export const WidgetWrapper: FC<IProfessionalWidget> = memo(props => {
  const {
    id,
    title,
    subtitle,
    onRemove,
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
      {/* cardInner нужен для изоляции анимации покачивания (wiggle) */}
      <div className={classes.cardInner}>
        {isEditing && !isDragging && <div className={classes.editOverlay} />}

        {isShowHeader && (
          <div className={`${classes.header} widget-header-drag-handle`}>
            <div className={classes.left}>
              <div className={classes.dragHandle}>
                <DragOutlined />
              </div>

              {beforeTitle}
              <div className={classes.titleBlock}>
                {title && <h4 className={classes.title}>{title}</h4>}
                {subtitle && (
                  <span className={classes.subtitle}>{subtitle}</span>
                )}
              </div>
              {afterTitle}
            </div>

            <div className={classes.headerActions}>
              {headerContent}
              {isEditing && onRemove && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={onRemove}
                  aria-label="Удалить виджет"
                />
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
    </div>
  )
})

WidgetWrapper.displayName = 'WidgetWrapper'
