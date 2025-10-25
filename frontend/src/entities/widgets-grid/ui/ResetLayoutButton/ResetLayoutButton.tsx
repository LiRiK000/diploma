import { useShallow } from 'zustand/react/shallow'
import { UndoOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useLayoutEffect } from 'react'
import { ResetLayoutButtonProps } from './types'
import { useLayoutStore } from '../../model/store'
import { GRID_ID } from '../../constants'

export const ResetLayoutButton = ({ fontSize }: ResetLayoutButtonProps) => {
  const [removeLayouts, hasLayoutsChanged, loadHasLayoutsChanged] =
    useLayoutStore(
      useShallow(store => [
        store.removeLayouts,
        store.hasLayoutsChanged[GRID_ID],
        store.loadHasLayoutsChanged,
      ]),
    )
  const handleResetLayout = (
    e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent,
  ) => {
    e.stopPropagation()
    removeLayouts()
  }

  useLayoutEffect(() => {
    loadHasLayoutsChanged()
    // Загружаем hasLayoutsChanged только при монтировании компонента
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Button
      size="large"
      type="link"
      title="Вернуть исходное расположение"
      disabled={!hasLayoutsChanged}
      icon={
        <UndoOutlined
          style={{
            fontSize: fontSize ?? 18,
            color: hasLayoutsChanged ? '#fff' : '#777',
            transition: 'color 0.3s ease',
          }}
        />
      }
      onClick={(e: React.MouseEvent) => handleResetLayout(e)}
      onTouchStart={(e: React.TouchEvent) => handleResetLayout(e)}
    />
  )
}
