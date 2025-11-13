// TODO: Улучшить дизайн корзины и адаптивность
import { Row, Col, Typography, Button, Card, Divider } from 'antd'
import styles from './CartPage.module.scss'
import { CART_ITEMS } from './constants'
import { CartItem } from './components/CartItem/CartItem'

const { Title, Text } = Typography

export const CartPage = () => {
  const totalItems = CART_ITEMS.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = CART_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col xs={24} lg={16} className={styles.cartCol}>
          <div className={styles.cartSection}>
            <Title level={2} className={styles.sectionTitle}>
              Корзина
            </Title>
            <Text className={styles.itemsCount}>
              {totalItems} {totalItems === 1 ? 'товар' : 'товаров'}
            </Text>

            <div className={styles.itemsList}>
              {CART_ITEMS.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8} className={styles.orderCol}>
          <div className={styles.orderSection}>
            <Card className={styles.orderCard}>
              <Title level={4} className={styles.orderTitle}>
                Итого
              </Title>
              <Divider style={{ margin: '4px 0' }} />
              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <Text>Товары ({totalItems} шт.)</Text>
                  <Text>{totalPrice} ₽</Text>
                </div>
                <Divider />
                <div className={styles.summaryRow}>
                  <Text strong>Итого</Text>
                  <Text strong className={styles.totalPrice}>
                    {totalPrice} ₽
                  </Text>
                </div>
              </div>
              <Button
                type="primary"
                block
                size="large"
                className={styles.orderButton}
              >
                Заказать
              </Button>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}
