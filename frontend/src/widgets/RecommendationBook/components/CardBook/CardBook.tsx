import { Typography, Button } from 'antd'
import { CardBookProps } from '../../types'
import {
  BookOutlined,
  UserOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import styles from './CardBook.module.scss'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const { Title, Text } = Typography

export const CardBook = ({ book }: CardBookProps) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    void navigate(`/book/${book.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigate()
    }
  }

  return (
    <div
      className={styles.card}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Рекомендованная книга: ${book.title}`}
    >
      <div className={styles.iconSide}>
        <BookOutlined className={styles.bookIcon} />
      </div>

      <div className={styles.content}>
        <Title level={5} className={styles.title}>
          {book.title}
        </Title>

        <div className={styles.authorRow}>
          <Text className={styles.author}>
            <UserOutlined className={styles.authorIcon} />
            {book.author}
          </Text>

          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            className={styles.iconButton}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>
    </div>
  )
}
