import React, { useState } from 'react'
import {
  Card,
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
import { User, Phone, Mail, ShieldAlert, Key } from 'lucide-react'
import classes from './UserSideBar.module.scss'
import { OrderResponse } from '@widgets/LibrarianOrdersTab/types'
import { useOrderManagement } from '../../hooks/use-order-management'

const { Title, Text } = Typography

export const UserSidebar: React.FC<{ order: OrderResponse }> = ({ order }) => {
  const { user } = order
  const [pickupCode, setPickupCode] = useState('')

  const { verifyCode, returnOrder, isVerifying, isReturning } =
    useOrderManagement(order.id)

  const handleVerify = () => {
    if (pickupCode.length !== 8) {
      return message.warning('Код должен содержать 8 символов')
    }
    verifyCode(pickupCode)
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Card className={classes.userCard}>
        <div className={classes.userHeader}>
          <Badge count={`Lvl ${user.level}`} offset={[-10, 65]} color="#1890ff">
            <Avatar
              size={80}
              src={user.avatarUrl}
              icon={<User />}
              className={classes.avatar}
            />
          </Badge>
          <Title level={4} className={classes.userName}>
            {user.name} {user.surname}
          </Title>
          <Tag color="blue" className={classes.xpTag}>
            {user.experience} XP
          </Tag>
        </div>

        <Divider />

        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div className={classes.infoItem}>
            <Mail size={16} color="#8c8c8c" />
            <Text>{user.email}</Text>
          </div>
          <div className={classes.infoItem}>
            <Phone size={16} color="#8c8c8c" />
            <Text>{user.phone || 'Телефон не указан'}</Text>
          </div>
        </Space>

        {user.isInBlacklist && (
          <Alert
            message="Читатель в черном списке"
            type="error"
            showIcon
            icon={<ShieldAlert size={16} />}
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      <Card title="Управление заказом" className={classes.card}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div className={classes.statusRow}>
            <Text className={classes.statusLabel}>Текущий статус</Text>
            <div className={classes.statusBadge}>
              <span className={classes.statusDot} />
              {order.status}
            </div>
          </div>

          {order.status === 'APPROVED' && (
            <div className={classes.actionSection}>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>
                Код выдачи (8 знаков):
              </Text>
              <Input
                prefix={<Key size={16} color="#bfbfbf" />}
                placeholder="Напр: FDAC4B9F"
                size="large"
                maxLength={8}
                value={pickupCode}
                onChange={e => setPickupCode(e.target.value.toUpperCase())}
                style={{
                  marginBottom: 12,
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                }}
              />
              <Button
                type="primary"
                block
                size="large"
                onClick={handleVerify}
                loading={isVerifying}
              >
                Выдать книги
              </Button>
            </div>
          )}

          {order.status === 'ON_HAND' && (
            <Button
              type="primary"
              danger
              block
              size="large"
              onClick={() => returnOrder(order.id)}
              loading={isReturning}
            >
              Принять возврат
            </Button>
          )}
        </Space>
      </Card>
    </Space>
  )
}
