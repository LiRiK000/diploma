import { Button, Tooltip, Tag, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { IOrder } from '../model/types'
import dayjs from 'dayjs'

export const getOrderColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): ColumnsType<IOrder> => [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    render: (id: string) => (
      <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
        {id.slice(0, 8)}
      </span>
    ),
  },
  {
    title: 'Читатель',
    key: 'user',
    render: (_, record) => `${record.user.name} ${record.user.surname}`,
  },
  {
    title: 'Книги',
    dataIndex: 'items',
    render: (items: IOrder['items']) => (
      <Space direction="vertical" size="small">
        {items.map(item => (
          <Tag key={item.id} color="blue">
            {item.book.title} (x{item.quantity})
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Дата заказа',
    dataIndex: 'orderDate',
    render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 120,
    render: (_, record) => (
      <Space>
        {record.status === 'PENDING' && (
          <>
            <Tooltip title="Одобрить">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => onApprove(record.id)}
              />
            </Tooltip>
            <Tooltip title="Отклонить">
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => onReject(record.id)}
              />
            </Tooltip>
          </>
        )}
      </Space>
    ),
  },
]
