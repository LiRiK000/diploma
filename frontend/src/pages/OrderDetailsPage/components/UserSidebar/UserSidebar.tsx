import React, { useState, useMemo } from 'react'
import {
  Avatar,
  Typography,
  Badge,
  Button,
  Input,
  Space,
  Divider,
  Alert,
  Tag,
  message,
} from 'antd'
import { User, Phone, Mail, ShieldAlert, Key, CheckCircle } from 'lucide-react'
import classes from '../../OrderDetails.module.scss'
import { OrderResponse } from '../../types'
import { useOrderManagement } from '../../hooks/use-order-management'
import { STATUS_CONFIG, OrderStatus } from '@entities/order/consts/statusConfig'

const { Text } = Typography

export const UserSidebar: React.FC<{ order: OrderResponse }> = ({ order }) => {
  const { user } = order
  const [pickupCode, setPickupCode] = useState('')

  const { verifyCode, returnOrder, isVerifying, isReturning } =
    useOrderManagement(order.id)

  const currentStatus = useMemo(
    () => STATUS_CONFIG[order.status as OrderStatus],
    [order.status],
  )

  const handleVerify = () => {
    if (pickupCode.length !== 8) {
      return message.warning('Код должен содержать ровно 8 символов')
    }
    verifyCode(pickupCode)
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div className={classes.userCard}>
        <div className={classes.userHeader}>
          <Badge
            count={`Lvl ${user?.level || 1}`}
            offset={[-8, 68]}
            className={classes.levelBadge}
          >
            <Avatar
              size={80}
              src={user?.avatarUrl}
              icon={<User size={32} />}
              className={classes.avatar}
            />
          </Badge>
          <span className={classes.userName}>
            {user?.name} {user?.surname}
          </span>
          <Tag className={classes.xpTag}>{user?.experience || 0} XP</Tag>
        </div>

        <Divider className={classes.customDivider} />

        <div className={classes.userContactList}>
          <div className={classes.infoItem}>
            <Mail size={14} className={classes.infoIcon} />
            <Text className={classes.infoText}>{user?.email}</Text>
          </div>
          <div className={classes.infoItem}>
            <Phone size={14} className={classes.infoIcon} />
            <Text className={classes.infoText}>
              {user?.phone || 'Телефон не указан'}
            </Text>
          </div>
        </div>

        {user?.isInBlacklist && (
          <Alert
            message="Читатель в черном списке"
            type="error"
            showIcon
            icon={<ShieldAlert size={15} />}
            className={classes.blacklistAlert}
          />
        )}
      </div>

      <div className={classes.card}>
        <div className={classes.cardHeader}>
          <span className={classes.cardTitle}>Управление заказом</span>
        </div>

        <div className={classes.cardBody}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div className={classes.statusRow}>
              <Text className={classes.statusLabel}>Текущий статус</Text>
              <Tag
                color={currentStatus?.color || 'default'}
                className={classes.mainStatusTag}
                icon={currentStatus?.icon}
              >
                {currentStatus?.label?.toUpperCase() || order.status}
              </Tag>
            </div>

            {order.status === 'APPROVED' && (
              <div className={classes.actionSection}>
                <Text className={classes.inputFieldLabel}>
                  Код выдачи (8 знаков)
                </Text>
                <Input
                  prefix={<Key size={16} className={classes.inputKeyIcon} />}
                  placeholder="FDAC4B9F"
                  size="large"
                  maxLength={8}
                  value={pickupCode}
                  onChange={e => setPickupCode(e.target.value.toUpperCase())}
                  className={classes.pickupCodeInput}
                />
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleVerify}
                  loading={isVerifying}
                  icon={<CheckCircle size={16} />}
                  className={classes.primarySubmitBtn}
                >
                  Выдать книги
                </Button>
              </div>
            )}

            {(order.status === 'ON_HAND' || order.status === 'OVERDUE') && (
              <Button
                type="primary"
                danger
                block
                size="large"
                onClick={() => returnOrder(order.id)}
                loading={isReturning}
                className={classes.returnSubmitBtn}
              >
                Принять возврат книг
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Space>
  )
}
