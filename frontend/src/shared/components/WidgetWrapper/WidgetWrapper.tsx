import { FC, memo, useState, useEffect, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Button, Tooltip } from 'antd'
import { Maximize2, Minimize2, GripVertical, Trash2 } from 'lucide-react'
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

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const toggleFullscreen = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFullscreen(!isFullscreen)
  }

  const isShowHeader = afterTitle || beforeTitle || title

  const containerClasses = [
    classes.container,
    className,
    !isFullscreen && isEditing && classes.isEditing,
    !isFullscreen && isDragging && classes.isDragging,
    !isFullscreen && isResizing && classes.isResizing,
  ]
    .filter(Boolean)
    .join(' ')

  const cardClasses = [classes.cardInner, isFullscreen && classes.isFullscreen]
    .filter(Boolean)
    .join(' ')

  const renderCardContent = () => (
    <div className={cardClasses}>
      {isEditing && !isDragging && !isFullscreen && (
        <div className={classes.editOverlay} />
      )}

      {isShowHeader && (
        <div
          className={`${classes.header} ${
            isEditing && !isFullscreen ? 'widget-header-drag-handle' : ''
          }`}
        >
          <div className={classes.left}>
            {isEditing && !isFullscreen && (
              <div className={classes.dragHandle}>
                <GripVertical size={14} strokeWidth={2.5} />
              </div>
            )}

            {beforeTitle}
            <div className={classes.titleBlock}>
              {title && <h4 className={classes.title}>{title}</h4>}
              {subtitle && <span className={classes.subtitle}>{subtitle}</span>}
            </div>
            {afterTitle}
          </div>

          <div
            className={classes.headerActions}
            onClick={e => e.stopPropagation()}
          >
            {headerContent}

            <Tooltip
              title={isFullscreen ? 'Свернуть в окно (Esc)' : 'На весь экран'}
              placement="bottom"
            >
              <Button
                type="text"
                size="small"
                className={classes.actionBtn}
                icon={
                  isFullscreen ? (
                    <Minimize2 size={15} strokeWidth={2.2} />
                  ) : (
                    <Maximize2 size={15} strokeWidth={2.2} />
                  )
                }
                onClick={toggleFullscreen}
              />
            </Tooltip>

            {isEditing && onRemove && !isFullscreen && (
              <Tooltip title="Удалить виджет" placement="bottom">
                <Button
                  type="text"
                  danger
                  size="small"
                  className={`${classes.actionBtn} ${classes.dangerBtn}`}
                  icon={<Trash2 size={15} strokeWidth={2.2} />}
                  onClick={onRemove}
                />
              </Tooltip>
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

  return (
    <div className={containerClasses}>
      {isFullscreen
        ? createPortal(renderCardContent(), document.body)
        : renderCardContent()}
    </div>
  )
})

WidgetWrapper.displayName = 'WidgetWrapper'
