import React, { useState } from 'react'
import {
  Modal,
  Input,
  Button,
  message,
  Space,
  Typography,
  Alert,
  Radio,
} from 'antd'
import { useReturnOrder } from '../hooks/useReturnOrder'

const { Paragraph } = Typography

export const ReturnBookModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [mode, setMode] = useState<'all' | 'single'>('all')
  const [orderCode, setOrderCode] = useState('')
  const [bookId, setBookId] = useState('')

  const { returnOrder, returnItemByCode, isPending, isItemPending } =
    useReturnOrder()

  const handleReturn = () => {
    if (orderCode.trim().length < 4) {
      return message.warning('Введите корректный код или ID заказа')
    }

    if (mode === 'all') {
      returnOrder(orderCode, {
        onSuccess: () => {
          setOrderCode('')
          onClose()
        },
      })
    } else {
      if (!bookId.trim()) {
        return message.warning('Введите ID возвращаемой книги')
      }
      returnItemByCode(
        { code: orderCode, bookId: bookId.trim() },
        {
          onSuccess: () => {
            setBookId('')
            onClose()
          },
        },
      )
    }
  }

  return (
    <Modal
      title="Прием возврата литературы"
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
          loading={isPending || isItemPending}
          onClick={handleReturn}
        >
          {mode === 'all' ? 'Принять все книги' : 'Принять одну книгу'}
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Alert
          message={
            mode === 'all'
              ? 'Убедитесь, что ВСЕ оставшиеся книги из заказа на месте.'
              : 'Вы принимаете одну конкретную книгу из заказа читателя.'
          }
          type="info"
          showIcon
        />

        <Radio.Group
          value={mode}
          onChange={e => setMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="all">Весь заказ целиком</Radio.Button>
          <Radio.Button value="single">Одну конкретную книгу</Radio.Button>
        </Radio.Group>

        <div>
          <Paragraph strong>Код заказа (или первые символы ID):</Paragraph>
          <Input
            size="large"
            placeholder="Например: fda4"
            value={orderCode}
            onChange={e => setOrderCode(e.target.value)}
          />
        </div>

        {mode === 'single' && (
          <div>
            <Paragraph strong>ID возвращаемой книги:</Paragraph>
            <Input
              size="large"
              placeholder="Введите UUID книги или отсканируйте штрих-код"
              value={bookId}
              onChange={e => setBookId(e.target.value)}
              onPressEnter={handleReturn}
            />
          </div>
        )}
      </Space>
    </Modal>
  )
}
