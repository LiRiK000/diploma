import React, { useState } from 'react'
import { Modal, Input, Button, message, Space, Typography, Alert } from 'antd'
import { useReturnOrder } from '../hooks/useReturnOrder'

const { Paragraph } = Typography

export const ReturnBookModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [orderId, setOrderId] = useState('')
  const { mutate: returnOrder, isPending } = useReturnOrder()

  const handleReturn = () => {
    if (orderId.trim().length < 4) {
      return message.warning('Введите корректный ID заказа')
    }

    returnOrder(orderId, {
      onSuccess: () => {
        setOrderId('')
        onClose()
      },
    })
  }

  return (
    <Modal
      title="Прием возврата книг"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          loading={isPending}
          onClick={handleReturn}
        >
          Принять книги
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Alert
          message="Убедитесь, что все книги из заказа на месте и в хорошем состоянии."
          type="warning"
          showIcon
        />
        <div>
          <Paragraph strong>Введите ID заказа или отсканируйте код:</Paragraph>
          <Input
            size="large"
            placeholder="Например: 8271-AS92"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            onPressEnter={handleReturn}
          />
        </div>
      </Space>
    </Modal>
  )
}
