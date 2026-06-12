import { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  message,
} from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { ManagedUser } from '@shared/services/UsersAdmin'
import { useUserModerationActions } from '../hooks/use-managed-users'

type BlockType = 'permanent' | 'temporary'

interface BlockUserModalProps {
  user: ManagedUser | null
  open: boolean
  onClose: () => void
}

interface BlockFormValues {
  blockType: BlockType
  banReason: string
  suspendedUntil?: Dayjs
}

export const BlockUserModal = ({ user, open, onClose }: BlockUserModalProps) => {
  const [form] = Form.useForm<BlockFormValues>()
  const { blacklist, suspend } = useUserModerationActions()
  const [blockType, setBlockType] = useState<BlockType>('permanent')

  const isPending = blacklist.isPending || suspend.isPending

  const handleClose = () => {
    form.resetFields()
    setBlockType('permanent')
    onClose()
  }

  const handleSubmit = async (values: BlockFormValues) => {
    if (!user) return

    try {
      if (values.blockType === 'permanent') {
        await blacklist.mutateAsync({
          userId: user.id,
          banReason: values.banReason.trim(),
        })
        message.success('Пользователь добавлен в чёрный список')
      } else {
        if (!values.suspendedUntil) {
          message.error('Укажите дату окончания заморозки')
          return
        }

        await suspend.mutateAsync({
          userId: user.id,
          banReason: values.banReason.trim(),
          suspendedUntil: values.suspendedUntil.endOf('day').toISOString(),
        })
        message.success('Пользователь временно заморожен')
      }

      handleClose()
    } catch {
      message.error('Не удалось применить блокировку')
    }
  }

  return (
    <Modal
      title={`Блокировка: ${user ? `${user.surname} ${user.name}` : ''}`}
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText="Применить"
      cancelText="Отмена"
      confirmLoading={isPending}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ blockType: 'permanent' as BlockType }}
        onFinish={handleSubmit}
      >
        <Form.Item name="blockType" label="Тип блокировки">
          <Radio.Group
            onChange={e => setBlockType(e.target.value as BlockType)}
          >
            <Radio value="permanent">Навсегда (чёрный список)</Radio>
            <Radio value="temporary">Временно</Radio>
          </Radio.Group>
        </Form.Item>

        {blockType === 'temporary' && (
          <Form.Item
            name="suspendedUntil"
            label="Заморозить до"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD.MM.YYYY"
              disabledDate={current =>
                current ? current <= dayjs().endOf('day') : false
              }
            />
          </Form.Item>
        )}

        <Form.Item
          name="banReason"
          label="Причина"
          rules={[
            { required: true, message: 'Укажите причину' },
            { max: 500, message: 'Не более 500 символов' },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Причина блокировки..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
