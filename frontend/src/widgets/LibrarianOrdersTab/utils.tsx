import { Button, TableProps, Tag, Space, Popover } from 'antd'
import { CheckOutlined, CloseOutlined, BookOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { STATUS_CONFIG } from '@entities/order/consts/statusConfig'
import classes from './OrderTable.module.scss'
import { OrderItem, OrderResponse } from './types'

export const getTableColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): TableProps<OrderResponse>['columns'] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 90,
      render: (id: string) => (
        <span
          style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace' }}
        >
          #{id.slice(0, 6).toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Пользователь',
      key: 'user',
      width: 180,
      render: (_, record) => (
        <div style={{ fontWeight: 500, fontSize: '13px' }}>
          {record.user ? `${record.user.name} ${record.user.surname}` : '—'}
        </div>
      ),
    },
    {
      title: 'Состав заказа',
      dataIndex: 'items',
      width: 320,
      render: (items: OrderItem[]) => (
        <Space wrap size={[4, 4]}>
          {items?.map(item => {
            const popoverContent = (
              <div className={classes.popoverCard}>
                <div className={classes.popoverHeader}>
                  <span className={classes.popoverBookTitle}>
                    {item.book?.title}
                  </span>
                </div>
                <div className={classes.popoverMetaRow}>
                  <span>Инвентарный №:</span>
                  <span style={{ color: '#555' }}>{item.id}</span>
                </div>
                <div className={classes.popoverMetaRow}>
                  <span>Автор:</span>
                  <span style={{ color: '#555' }}>
                    {item.book?.author || 'Не указан'}
                  </span>
                </div>
                <div className={classes.popoverFooter}>
                  Количество в заказе:{' '}
                  <span style={{ color: '#1890ff' }}>{item.quantity} шт.</span>
                </div>
              </div>
            )

            return (
              <Popover
                key={item.id}
                content={popoverContent}
                title="Детали книги"
                trigger="hover"
                placement="top"
              >
                <div className={classes.bookCardMini}>
                  <BookOutlined className={classes.miniIcon} />
                  <span className={classes.miniTitle}>{item.book?.title}</span>
                  <span className={classes.miniQty}>x{item.quantity}</span>
                </div>
              </Popover>
            )
          })}
        </Space>
      ),
    },
    {
      title: 'Дата',
      dataIndex: 'orderDate',
      width: 140,
      render: (date: string) => (
        <div style={{ lineHeight: '1.2' }}>
          <div style={{ fontSize: '13px' }}>
            {dayjs(date).format('DD.MM.YYYY')}
          </div>
          <div style={{ color: '#bfbfbf', fontSize: '11px' }}>
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 140,
      render: (status: string) => {
        const config = STATUS_CONFIG[status] || {
          label: status,
          color: 'default',
        }
        return (
          <Tag color={config.color} style={{ borderRadius: '4px', margin: 0 }}>
            {config.label}
          </Tag>
        )
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                shape="circle"
                size="small"
                onClick={() => onApprove(record.id)}
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              />
              <Button
                danger
                shape="circle"
                size="small"
                onClick={() => onReject(record.id)}
                icon={<CloseOutlined />}
              />
            </>
          )}
        </Space>
      ),
    },
  ]
}

export const getPagination = (
  data: OrderResponse[],
): TableProps<OrderResponse>['pagination'] => {
  return data?.length > 10
    ? { pageSize: 10, position: ['bottomLeft'], showSizeChanger: false }
    : false
}
