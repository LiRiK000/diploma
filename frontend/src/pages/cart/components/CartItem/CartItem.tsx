import { Button, Card, Typography } from 'antd'
import { DeleteOutlined, HeartOutlined } from '@ant-design/icons'
import styles from './CartItem.module.scss'
import { useRemoveFromCart } from '@features/remove-from-cart/model'
import { CartItemProps } from '@shared/services/Cart/types'

const { Title, Text } = Typography

export const CartItem = ({ item }: CartItemProps) => {
  const { mutate, isPending } = useRemoveFromCart()
  return (
    <Card key={item.id} className={styles.cartItem}>
      <div className={styles.itemContent}>
        <div className={styles.itemImage}>
          <img src={'/book.png'} alt={item.title} loading="lazy" />
        </div>
        <div className={styles.itemInfo}>
          <div className={styles.itemMainRow}>
            <div className={styles.itemTitleBlock}>
              <Title level={4} className={styles.itemTitle}>
                {item.title}
              </Title>
              <Text className={styles.itemAuthor}>{item.author}</Text>
            </div>

            <div className={styles.availableQuantity}>
              <Text className={styles.availableText}>
                Доступно: {item.available} шт.
              </Text>
            </div>
          </div>
          <div className={styles.itemActionsBottom}>
            <Button
              type="text"
              danger
              icon={<HeartOutlined />}
              className={styles.deleteButton}
            />
            <Button
              disabled={isPending}
              type="text"
              danger
              onClick={() => mutate(item.id)}
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
