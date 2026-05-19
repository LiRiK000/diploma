import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Card, Button, Tooltip, Space, Spin, Result } from 'antd'
import {
  SettingOutlined,
  DeleteOutlined,
  DragOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons'
import styles from './WidgetWrapper.module.scss'

interface WidgetWrapperProps {
  title: string
  isEditing?: boolean
  isLoading?: boolean
  error?: string | null
  isFullscreen: boolean
  onFullscreenChange: (isFullscreen: boolean) => void
  onSettingsClick?: () => void
  onDeleteClick?: () => void
  children: React.ReactNode
  extra?: React.ReactNode
}

export const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
  title,
  isEditing = false,
  isLoading = false,
  error = null,
  isFullscreen,
  onFullscreenChange,
  onSettingsClick,
  onDeleteClick,
  children,
  extra,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        onFullscreenChange(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, onFullscreenChange])

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFullscreenChange(!isFullscreen)
  }

  const renderExtraActions = () => {
    return (
      <Space
        size={6}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        <Tooltip
          title={isFullscreen ? 'Свернуть (Esc)' : 'Развернуть'}
          placement="bottom"
        >
          <Button
            type="text"
            className={styles.controlBtn}
            icon={
              isFullscreen ? (
                <FullscreenExitOutlined style={{ fontSize: 13 }} />
              ) : (
                <FullscreenOutlined style={{ fontSize: 13 }} />
              )
            }
            onClick={toggleFullscreen}
          />
        </Tooltip>

        {isEditing && !isFullscreen && (
          <>
            <Tooltip title="Перетащить виджет" placement="bottom">
              <Button
                type="text"
                className={`${styles.dragIcon} react-grid-dragHandle-wrapper`}
                icon={<DragOutlined style={{ fontSize: 13 }} />}
              />
            </Tooltip>

            {onSettingsClick && (
              <Tooltip title="Настройки" placement="bottom">
                <Button
                  type="text"
                  className={styles.controlBtn}
                  icon={<SettingOutlined style={{ fontSize: 13 }} />}
                  onClick={onSettingsClick}
                />
              </Tooltip>
            )}

            {onDeleteClick && (
              <Tooltip title="Убрать с доски" placement="bottom">
                <Button
                  type="text"
                  className={styles.deleteIcon}
                  icon={<DeleteOutlined style={{ fontSize: 13 }} />}
                  onClick={onDeleteClick}
                />
              </Tooltip>
            )}
          </>
        )}
      </Space>
    )
  }

  const cardElement = (
    <Card
      className={[
        styles.wrapper,
        isEditing && styles.isEditing,
        isFullscreen && styles.isFullscreen,
      ]
        .filter(Boolean)
        .join(' ')}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <span className={styles.title}>{title || 'Виджет'}</span>
          {extra && (
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              {extra}
            </div>
          )}
        </div>
      }
      extra={renderExtraActions()}
      bordered={false}
      bodyStyle={{
        padding: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div className={styles.body}>
        {isLoading ? (
          <div className={styles.centerContainer}>
            <Spin size="large" tip="Синхронизация..." />
          </div>
        ) : error ? (
          <div className={styles.centerContainer}>
            <Result
              status="warning"
              title="Модуль временно недоступен"
              subTitle={<span className={styles.errorText}>{error}</span>}
              style={{ padding: 16 }}
            />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </Card>
  )

  if (isFullscreen) {
    return createPortal(cardElement, document.body)
  }

  return cardElement
}
