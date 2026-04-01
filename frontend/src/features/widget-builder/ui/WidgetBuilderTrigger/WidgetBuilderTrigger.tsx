import { PlusOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { WidgetBuilderTriggerProps } from '../../types'

export const WidgetBuilderTrigger = ({
  onClick,
}: WidgetBuilderTriggerProps) => {
  return (
    <Tooltip title="Создать новый виджет" placement="bottom">
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(24, 144, 255, 0.05)',
          borderColor: 'var(--ant-primary-color)',
          color: 'var(--ant-primary-color)',
        }}
      />
    </Tooltip>
  )
}
