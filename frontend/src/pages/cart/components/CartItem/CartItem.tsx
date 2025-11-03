import { Button, Card, InputNumber, Typography } from 'antd'
import { DeleteOutlined, HeartOutlined } from '@ant-design/icons'
import styles from './CartItem.module.scss'
import { CART_ITEMS } from '../../constants'

const { Title, Text } = Typography

export const CartItem = ({ item }: { item: (typeof CART_ITEMS)[number] }) => {
  return (
    <Card key={item.id} className={styles.cartItem}>
      <div className={styles.itemContent}>
        <div className={styles.itemImage}>
          <img src={item.coverUrl} alt={item.title} />
        </div>
        <div className={styles.itemInfo}>
          <div className={styles.itemMainRow}>
            <div className={styles.itemTitleBlock}>
              <Title level={4} className={styles.itemTitle}>
                {item.title}
              </Title>
              <Text className={styles.itemAuthor}>{item.author}</Text>
            </div>
            <div className={styles.itemActions}>
              <Button
                type="text"
                className={styles.quantityButton}
                onClick={() => {
                  // TODO: decrease quantity
                }}
              >
                -
              </Button>
              <InputNumber
                min={1}
                max={item.availableQuantity}
                value={item.quantity}
                className={styles.quantityInput}
                controls={false}
              />
              <Button
                type="text"
                className={styles.quantityButton}
                onClick={() => {
                  // TODO: increase quantity
                }}
                disabled={item.quantity >= item.availableQuantity}
              >
                +
              </Button>
            </div>
            <div className={styles.availableQuantity}>
              <Text className={styles.availableText}>
                Доступно: {item.availableQuantity} шт.
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
              type="text"
              danger
              icon={<HeartOutlined />}
              className={styles.deleteButton}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className={styles.deleteButton}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
