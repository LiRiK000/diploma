import { Modal, Input, Typography, message } from 'antd'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@shared/services/Order'
import { ApiError } from '@shared/api/types'

interface Props {
  open: boolean
  onClose: () => void
}

export const VerifyCodeModal = ({ open, onClose }: Props) => {
  const [code, setCode] = useState('')
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (c: string) => orderService.verifyPickupCode(c),
    onSuccess: () => {
      message.success('Код подтвержден! Книги можно выдавать.')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setCode('')
      onClose()
    },
    onError: (err: ApiError) => {
      message.error(err.message || 'Неверный код')
    },
  })

  return (
    <Modal
      title="Выдача книг"
      open={open}
      onOk={() => mutate(code)}
      onCancel={onClose}
      confirmLoading={isPending}
      okText="Проверить код"
      cancelText="Отмена"
      centered
    >
      <Typography.Paragraph>
        Введите **8-значный код**, который видит читатель в своем личном
        кабинете.
      </Typography.Paragraph>
      <Input
        placeholder="Например: 10CF1FFF"
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        style={{
          textAlign: 'center',
          fontSize: '24px',
          letterSpacing: '4px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
        maxLength={8}
      />
    </Modal>
  )
}
