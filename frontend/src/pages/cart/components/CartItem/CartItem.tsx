import { Button, Card, Typography, Tooltip } from 'antd'
import { DeleteOutlined, HeartOutlined } from '@ant-design/icons'
import styles from './CartItem.module.scss'
import { useRemoveFromCart } from '@features/remove-from-cart/model'
import { CartItemProps } from '@shared/services/Cart/types'

const { Title, Text } = Typography

export const CartItem = ({ item }: CartItemProps) => {
  const { mutate, isPending } = useRemoveFromCart()

  return (
    <Card className={styles.cartItem} bordered={false}>
      <div className={styles.itemContent}>
        {/* Обложка с эффектом масштабирования */}
        <div className={styles.itemImage}>
          <img
            src={item.coverUrl || '/book.png'}
            alt={item.title}
            loading="lazy"
          />
        </div>

        <div className={styles.itemInfo}>
          <div className={styles.itemMainRow}>
            <div className={styles.itemTitleBlock}>
              <Title level={4} className={styles.itemTitle}>
                {item.title}
              </Title>
              <Text className={styles.itemAuthor}>{item.author}</Text>
            </div>
          </div>

          <div className={styles.itemActionsBottom}>
            <Tooltip title="В избранное">
              <Button
                type="text"
                icon={<HeartOutlined />}
                className={`${styles.actionButton} ${styles.favorite}`}
              />
            </Tooltip>

            <Tooltip title="Удалить из корзины">
              <Button
                disabled={isPending}
                type="text"
                danger
                onClick={() => mutate(item.id)}
                icon={<DeleteOutlined />}
                className={styles.actionButton}
                loading={isPending}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  )
}
