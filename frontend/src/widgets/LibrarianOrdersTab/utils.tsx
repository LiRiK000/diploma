import { Button, TableProps, Tooltip, Tag, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

// 1. Приводим интерфейс в соответствие с ответом бэкенда
export interface OrderItem {
  id: string
  quantity: number
  book: {
    title: string
  }
}

export interface Order {
  id: string
  status: string
  orderDate: string
  user: {
    name: string
    surname: string
  }
  items: OrderItem[]
}

export const getTableColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): TableProps<Order>['columns'] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: string) => (
        <span style={{ fontSize: '12px', color: '#999' }}>
          {id.slice(0, 8)}
        </span>
      ),
    },
    {
      title: 'ФИО',
      key: 'user',
      width: 250,
      // Достаем имя и фамилию из вложенного объекта user
      render: (_, record) =>
        `${record.user?.name || ''} ${record.user?.surname || ''}`,
    },
    {
      title: 'Книги в заказе',
      dataIndex: 'items', // Используем ключ items вместо books
      width: 400,
      render: (items: OrderItem[]) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          {items?.map(item => (
            <Tag
              key={item.id}
              color="blue"
              style={{ whiteSpace: 'normal', height: 'auto' }}
            >
              {item.book?.title} <b>x{item.quantity}</b>
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Дата',
      dataIndex: 'orderDate',
      width: 150,
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = {
          PENDING: 'orange',
          APPROVED: 'cyan',
          ON_HAND: 'green',
          CANCELLED: 'red',
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Одобрить">
                <Button
                  type="primary"
                  onClick={() => onApprove(record.id)}
                  icon={<CheckOutlined />}
                />
              </Tooltip>
              <Tooltip title="Отклонить">
                <Button
                  danger
                  onClick={() => onReject(record.id)}
                  icon={<CloseOutlined />}
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ]
}

export const getPagination = (
  data: Order[],
): TableProps<Order>['pagination'] => {
  return data?.length > 10 ? { pageSize: 10, position: ['bottomLeft'] } : false
}
