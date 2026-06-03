import React, { memo } from 'react'
import styles from './BookCard.module.scss'
import { Typography, Space, Tooltip } from 'antd'
import { StarFilled, LockOutlined } from '@ant-design/icons'
import { BookCardProps } from './types'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AddToCartButton } from '@features/add-to-cart/components'
import { AddToWishlistButton } from '@features/add-to-wishlist/components'
import { routes } from '@shared/constants'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'

const { Title, Text } = Typography

export const BookCard = memo(({ book }: BookCardProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: userData } = useGetMe()
  const isAuthorized = userData?.status === 'success'

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    void navigate(`/author/${book.authorId}`)
  }

  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleRedirectToLogin = () => {
    void navigate(routes.login, { state: { from: location.pathname } })
  }

  return (
    <Link to={`/book/${book.id}`}>
      <div className={styles.card}>
        <div className={styles.cover}>
          <div className={styles.genreBadge}>
            {typeof book.genre === 'object' ? book.genre.label : book.genre}
          </div>
          <div className={styles.bookWrapper}>
            <img
              src={book.coverUrl || '/book.png'}
              fetchPriority="high"
              loading="eager"
              className={styles.coverImage}
              alt={book.title}
            />
            {/* Сохраняем визуальные элементы */}
            <div className={styles.pages} />
            <div className={styles.bookmark} />
          </div>
        </div>

        <div className={styles.info}>
          <Title level={4} className={styles.title}>
            {book.title}
          </Title>
          <div className={styles.author} onClick={handleAuthorClick}>
            {book.author}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.reviews}>
            <StarFilled className={styles.starIcon} />
            <Text className={styles.count}>{book.ratingsCount || 0}</Text>
          </div>

          <div className={styles.actions} onClick={handleActionsClick}>
            <Space size={8}>
              {isAuthorized ? (
                <>
                  <AddToWishlistButton
                    title={book.title}
                    variant="icon"
                    id={book.id}
                  />
                  <AddToCartButton bookId={book.id} variant="icon" />
                </>
              ) : (
                <Tooltip title="Войдите, чтобы добавить в избранное или корзину">
                  <LockOutlined
                    onClick={handleRedirectToLogin}
                    style={{
                      fontSize: '18px',
                      color: '#bfbfbf',
                      cursor: 'pointer',
                    }}
                  />
                </Tooltip>
              )}
            </Space>
          </div>
        </div>
      </div>
    </Link>
  )
})

BookCard.displayName = 'BookCard'
