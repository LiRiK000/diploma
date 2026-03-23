import React from 'react'
import { Typography, Alert } from 'antd'
import styles from './OrderTicket.module.scss'
import { OrderTicketProps } from './types'
const { Text } = Typography

export const OrderTicket: React.FC<OrderTicketProps> = ({
  code,
  label,
  message,
  type,
  variant = 'primary',
}) => (
  <div className={styles.pickupSection}>
    <Text type="secondary">{label}</Text>
    <div
      className={`${styles.pickupCode} ${variant === 'return' ? styles.returnVariant : ''}`}
    >
      {code}
    </div>
    <Alert
      message={message}
      type={type}
      showIcon
      style={{ borderRadius: '12px', width: '100%' }}
    />
  </div>
)
