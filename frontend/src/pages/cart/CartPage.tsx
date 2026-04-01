import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Result,
  Row,
  Typography,
} from 'antd'
import { Link } from 'react-router-dom'
import { CartItem } from './components/CartItem/CartItem'
import { CartItemResponse } from '@shared/services/Cart/types'
import { Loader } from '@shared/components/Loader'
import { useCart } from '@features/get-cart'
import {
  calculateTotalItems,
  pluralizeBooks,
  pluralizePieces,
} from '@shared/utils/pluralize'
import { useCreateOrder } from '@features/create-order/hooks/useCreateOrder'
import styles from './CartPage.module.scss'
const { Title, Text } = Typography

export const CartPage = () => {
  const { data: cart, isLoading, isError } = useCart()
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()

  if (isLoading) return <Loader />

  if (isError) {
    return (
      <div className={styles.container}>
        <Result
          status="error"
          title={
            <span style={{ color: 'var(--text-primary)' }}>
              Ошибка загрузки
            </span>
          }
          subTitle={
            <span style={{ color: 'var(--text-secondary)' }}>
              Не удалось загрузить корзину. Попробуйте обновить страницу.
            </span>
          }
          extra={[
            <Button
              type="primary"
              key="retry"
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </Button>,
          ]}
        />
      </div>
    )
  }

  const isCartEmpty = !cart || cart.items.length === 0
  const totalItems = isCartEmpty ? 0 : calculateTotalItems(cart.items)

  if (isCartEmpty) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <Empty
            description={
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Ваша корзина пока пуста
              </Text>
            }
          />
          <Link to="/">
            <Button type="primary" size="large" className={styles.emptyButton}>
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={16} className={styles.cartCol}>
          <section className={styles.cartSection}>
            <Title level={2} className={styles.sectionTitle}>
              Корзина
            </Title>
            <Text className={styles.itemsCount}>
              {totalItems} {pluralizeBooks(totalItems)}
            </Text>

            <div className={styles.itemsList}>
              {cart.items.map((item: CartItemResponse) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        </Col>

        <Col xs={24} lg={8} className={styles.orderCol}>
          <div className={styles.orderSection}>
            <Card className={styles.orderCard} bordered={false}>
              <Title level={4} className={styles.orderTitle}>
                Детали заказа
              </Title>

              <Divider
                style={{ margin: '16px 0', borderColor: 'var(--glass-border)' }}
              />

              <div className={styles.summaryRow}>
                <Text type="secondary">Выбрано книг:</Text>
                <Text strong style={{ color: 'var(--text-primary)' }}>
                  {totalItems} {pluralizePieces(totalItems)}
                </Text>
              </div>

              <div className={styles.summaryRow}>
                <Text type="secondary">Стоимость:</Text>
                <Text strong style={{ color: '#52c41a' }}>
                  Бесплатно
                </Text>
              </div>

              <Divider
                style={{ margin: '16px 0', borderColor: 'var(--glass-border)' }}
              />

              <Button
                type="primary"
                block
                size="large"
                className={styles.orderButton}
                onClick={() => createOrder()}
                loading={isCreatingOrder}
                disabled={isCartEmpty}
              >
                ОФОРМИТЬ ВЫДАЧУ
              </Button>

              <Text className={styles.footerNote}>
                Нажимая кнопку, вы бронируете книги. Код для получения придет в
                личный кабинет.
              </Text>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  )
}
