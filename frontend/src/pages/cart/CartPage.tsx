// TODO => убрать inline стили,Result
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Divider,
  Empty,
  Result,
} from 'antd'
import styles from './CartPage.module.scss'
import { CartItem } from './components/CartItem/CartItem'
import { Link } from 'react-router-dom'
import { CartItemResponse } from '@shared/services/Cart/types'
import { Loader } from '@shared/components/Loader'
import { useCart } from '@features/get-cart'
import { calculateTotalItems, pluralizeItems } from '@shared/utils'

const { Title, Text } = Typography

export const CartPage = () => {
  const { data: cart, isLoading, isError } = useCart()
  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <Result />
  }
  const isCartEmpty = !cart || cart.items.length === 0
  const totalItems = isCartEmpty ? 0 : calculateTotalItems(cart.items)
  const itemsLabel = pluralizeItems(totalItems)
  if (isCartEmpty) {
    return (
      <div
        className={styles.container}
        style={{ textAlign: 'center', padding: '60px 0' }}
      >
        <Empty description="Корзина пуста" />
        <Link to={'/'}>
          <Button type="primary" size="large" style={{ marginTop: 16 }}>
            Перейти в каталог
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Row gutter={24}>
        <Col xs={24} lg={16} className={styles.cartCol}>
          <div className={styles.cartSection}>
            <Title level={2} className={styles.sectionTitle}>
              Корзина
            </Title>
            <Text className={styles.itemsCount}>
              {totalItems} {itemsLabel}
            </Text>

            <div className={styles.itemsList}>
              {cart.items.map((item: CartItemResponse) => (
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
                  {totalItems} {itemsLabel}
                </div>
                <Divider />
                <div className={styles.summaryRow}></div>
              </div>
              <Button
                type="primary"
                block
                size="large"
                className={styles.orderButton}
              >
                К оформлению
              </Button>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}
