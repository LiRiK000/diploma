import { useShallow } from 'zustand/react/shallow'
import { UndoOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useLayoutEffect } from 'react'
import { ResetLayoutButtonProps } from './types'
import { useLayoutStore } from '../../model/store'

export const ResetLayoutButton = ({ fontSize }: ResetLayoutButtonProps) => {
  const [removeLayouts, loadHasLayoutsChanged] = useLayoutStore(
    useShallow(store => [store.removeLayouts, store.loadHasLayoutsChanged]),
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
      type="primary"
      danger
      style={{ transition: 'none', width: '32px', height: '32px' }}
      title="Вернуть исходное расположение"
      icon={
        <UndoOutlined
          style={{
            fontSize: fontSize ?? 18,
            color: '#fff',
          }}
        />
      }
      onClick={(e: React.MouseEvent) => handleResetLayout(e)}
      onTouchStart={(e: React.TouchEvent) => handleResetLayout(e)}
    />
  )
}
