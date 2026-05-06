import { Button, Tag, Space, Popover, Tooltip, TableProps } from 'antd'
import { Check, X, Book, Eye, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'
import { STATUS_CONFIG } from '@entities/order/consts/statusConfig'
import classes from './OrderTable.module.scss'
import { OrderItem, OrderResponse } from './types'

export const getTableColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
  onDetails: (id: string) => void,
): TableProps<OrderResponse>['columns'] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      render: (id: string) => (
        <span className={classes.idBadge}>#{id.slice(0, 6).toUpperCase()}</span>
      ),
    },
    {
      title: 'Пользователь',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div className={classes.userInfo}>
          <div className={classes.userName}>
            {record.user ? `${record.user.name} ${record.user.surname}` : '—'}
          </div>
          <div className={classes.userSub}>{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Состав заказа',
      dataIndex: 'items',
      render: (items: OrderItem[]) => (
        <Space wrap size={[4, 4]}>
          {items?.slice(0, 3).map(item => (
            <Popover
              key={item.id}
              content={
                <div className={classes.popoverCard}>
                  <div className={classes.popoverHeader}>
                    <span className={classes.popoverBookTitle}>
                      {item.book?.title}
                    </span>
                  </div>
                  <div className={classes.popoverMetaRow}>
                    <span>Автор:</span>
                    <span>
                      {item.book?.author?.firstName}{' '}
                      {item.book?.author?.lastName || '—'}
                    </span>
                  </div>
                  <div className={classes.popoverFooter}>
                    Количество:{' '}
                    <span style={{ color: '#1890ff' }}>
                      {item.quantity} шт.
                    </span>
                  </div>
                </div>
              }
              trigger="hover"
            >
              <div className={classes.bookCardMini}>
                <Book size={14} className={classes.miniIcon} />
                <span className={classes.miniTitle}>{item.book?.title}</span>
                <span className={classes.miniQty}>x{item.quantity}</span>
              </div>
            </Popover>
          ))}
          {items?.length > 3 && (
            <Tag color="default" style={{ cursor: 'default' }}>
              +{items.length - 3} еще
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Дата',
      dataIndex: 'orderDate',
      width: 130,
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
        const config = STATUS_CONFIG[status as any] || {
          label: status,
          color: 'default',
        }
        return (
          <Tag color={config.color} className={classes.statusTag}>
            {config.label}
          </Tag>
        )
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div className={classes.actionButtons}>
          <Space size={4}>
            <Tooltip title="Открыть детали">
              <Button
                type="text"
                shape="circle"
                icon={<Eye size={18} color="#1890ff" />}
                onClick={() => onDetails(record.id)}
              />
            </Tooltip>

            {record.status === 'PENDING' && (
              <>
                <Tooltip title="Одобрить">
                  <Button
                    type="text"
                    shape="circle"
                    onClick={() => onApprove(record.id)}
                    icon={<Check size={18} color="#52c41a" />}
                  />
                </Tooltip>
                <Tooltip title="Отклонить">
                  <Button
                    type="text"
                    danger
                    shape="circle"
                    onClick={() => onReject(record.id)}
                    icon={<X size={18} />}
                  />
                </Tooltip>
              </>
            )}
          </Space>
        </div>
      ),
    },
  ]
}

export const getPagination = (data: OrderResponse[]) => {
  if (!data || data.length <= 10) return false
  return {
    pageSize: 10,
    position: ['bottomRight'] as const,
    size: 'small' as const,
  }
}
