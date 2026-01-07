import classes from './FullScreenButton.module.scss'
import { useShallow } from 'zustand/react/shallow'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import { GRID_ID } from '../../constants'
import { useFullscreenStore } from '@entities/widgets-grid/model/store'
import { FullScreenButtonProps } from './types'

export const FullScreenButton = ({
  widgetId,
  params,
}: FullScreenButtonProps) => {
  const [isFullScreen, fullScreenItemId, toggleFullscreen] = useFullscreenStore(
    useShallow(store => [
      store.gridFullScreenStates[GRID_ID]?.isFullscreen,
      store.gridFullScreenStates[GRID_ID]?.fullScreenItemId,
      store.toggleFullscreen,
      store.gridFullScreenStates,
    ]),
  )

  const isCurrentWidgetFullScreen =
    isFullScreen && fullScreenItemId === widgetId
  const ariaTitle = isCurrentWidgetFullScreen ? 'Свернуть' : 'Развернуть'
  const handleToggleFullScreen = (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
  ) => {
    e.stopPropagation()
    toggleFullscreen(widgetId)
  }

  return (
    <button
      className={classes.fullscreen_button}
      aria-label={ariaTitle}
      onMouseDown={(e: React.MouseEvent) => handleToggleFullScreen(e)}
      onTouchStart={(e: React.TouchEvent) => handleToggleFullScreen(e)}
    >
      <Typography.Link>
        <Space>
          {isCurrentWidgetFullScreen ? (
            <FullscreenExitOutlined
              style={{ fontSize: params?.fontSize || 18, color: '#fff' }}
            />
          ) : (
            <FullscreenOutlined
              style={{ fontSize: params?.fontSize || 18, color: '#fff' }}
            />
          )}
        </Space>
      </Typography.Link>
    </button>
  )
}
