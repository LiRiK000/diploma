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
import { useCreateOrder } from '@features/create-order/hooks/useCreateOrder'

const { Title, Text } = Typography

export const CartPage = () => {
  const { data: cart, isLoading, isError } = useCart()
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="Ошибка загрузки"
        subTitle="Не удалось загрузить корзину. Попробуйте обновить страницу."
        className={styles.errorResult}
      />
    )
  }

  const isCartEmpty = !cart || cart.items.length === 0
  const totalItems = isCartEmpty ? 0 : calculateTotalItems(cart.items)
  const itemsLabel = pluralizeItems(totalItems)

  if (isCartEmpty) {
    return (
      <div className={styles.emptyContainer}>
        <Empty description="Ваша корзина пока пуста" />
        <Link to="/">
          <Button type="primary" size="large" className={styles.emptyButton}>
            Перейти в каталог
          </Button>
        </Link>
      </div>
    )
  }

  const handleCheckout = () => {
    createOrder()
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
              <Divider className={styles.summaryDivider} />

              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <Text>
                    {totalItems} {itemsLabel}
                  </Text>
                </div>
                {/* Если на бэке появится логика стоимости, можно вывести здесь */}
                <Divider />
              </div>

              <Button
                type="primary"
                block
                size="large"
                className={styles.orderButton}
                onClick={handleCheckout}
                loading={isCreatingOrder}
                disabled={isCartEmpty}
              >
                К оформлению
              </Button>

              <Text
                type="secondary"
                style={{
                  display: 'block',
                  marginTop: 12,
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                После оформления заказа вы получите код для получения книг в
                библиотеке.
              </Text>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}
