import { Button, Tag, Space, Popover, Tooltip, TableProps, Avatar } from 'antd'
import { Check, X, Book, Eye, Calendar, Clock, User } from 'lucide-react'
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
      width: 95,
      render: (id: string) => (
        <span className={classes.idBadge}>#{id.slice(0, 6).toUpperCase()}</span>
      ),
    },
    {
      title: 'Пользователь',
      key: 'user',
      width: 220,
      render: (_, record) => (
        <Space size={10}>
          <Avatar
            src={record.user?.avatar}
            icon={<User size={13} />}
            className={classes.userAvatar}
          />
          <div className={classes.userInfo}>
            <span className={classes.userName}>
              {record.user ? `${record.user.name} ${record.user.surname}` : '—'}
            </span>
            <span className={classes.userSub}>{record.user?.email || '—'}</span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Состав заказа',
      dataIndex: 'items',
      render: (items: OrderItem[]) => (
        <Space wrap size={[6, 6]}>
          {items?.slice(0, 2).map(item => (
            <Popover
              key={item.id}
              overlayClassName={classes.popoverOverlay}
              content={
                <div className={classes.popoverCard}>
                  <div className={classes.popoverHeader}>
                    <span className={classes.popoverBookTitle}>
                      {item.book?.title}
                    </span>
                  </div>
                  <div className={classes.popoverMetaRow}>
                    <span>Автор:</span>
                    <span className={classes.popoverMetaValue}>
                      {item.book?.author?.firstName || ''}{' '}
                      {item.book?.author?.lastName || '—'}
                    </span>
                  </div>
                  <div className={classes.popoverFooter}>
                    Количество:{' '}
                    <span className={classes.popoverQtyHighlight}>
                      {item.quantity} шт.
                    </span>
                  </div>
                </div>
              }
              trigger="hover"
              mouseEnterDelay={0.15}
            >
              <div className={classes.bookCardMini}>
                <Book size={13} className={classes.miniIcon} />
                <span className={classes.miniTitle}>{item.book?.title}</span>
                <span className={classes.miniQty}>×{item.quantity}</span>
              </div>
            </Popover>
          ))}
          {items?.length > 2 && (
            <span className={classes.moreItemsBadge}>
              +{items.length - 2} ещё
            </span>
          )}
        </Space>
      ),
    },
    {
      title: 'Дата создания',
      dataIndex: 'orderDate',
      width: 140,
      render: (date: string) => (
        <div className={classes.dateContainer}>
          <div className={classes.dateRow}>
            <Calendar size={12} className={classes.dateIcon} />
            <span>{dayjs(date).format('DD.MM.YYYY')}</span>
          </div>
          <div className={classes.timeRow}>
            <Clock size={12} className={classes.dateIcon} />
            <span>{dayjs(date).format('HH:mm')}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 130,
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
      width: 130,
      align: 'right',
      render: (_, record) => (
        <div className={classes.actionButtons}>
          <Tooltip title="Открыть детали" placement="top">
            <Button
              type="text"
              icon={<Eye size={15} />}
              onClick={() => onDetails(record.id)}
              className={classes.viewBtn}
            />
          </Tooltip>

          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Одобрить заявку" placement="top">
                <Button
                  type="text"
                  onClick={() => onApprove(record.id)}
                  className={classes.approveBtn}
                  icon={<Check size={15} />}
                />
              </Tooltip>
              <Tooltip title="Отклонить" placement="top">
                <Button
                  type="text"
                  onClick={() => onReject(record.id)}
                  className={classes.rejectBtn}
                  icon={<X size={15} />}
                />
              </Tooltip>
            </>
          )}
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
    hideOnSinglePage: true,
  }
}
