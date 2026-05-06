import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Button,
  Row,
  Col,
  Spin,
  Result,
  Breadcrumb,
  Typography,
  Space,
} from 'antd'
import { ArrowLeft, Printer, MoreHorizontal } from 'lucide-react'
import classes from './OrderDetails.module.scss'
import { OrderInfo } from './components/OrderInfo/OrderInfo'
import { UserSidebar } from './components/UserSidebar/UserSidebar'
import { useOrderDetails } from './hooks/use-order-details'

const { Title } = Typography

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading, error } = useOrderDetails(id!)

  if (isLoading)
    return (
      <div className={classes.loader}>
        <Spin size="large" />
        <span>Загружаем детали заказа...</span>
      </div>
    )

  if (error || !order)
    return (
      <Result
        status="404"
        title="Заказ не найден"
        subTitle="К сожалению, такой заказ не существует или был удален."
      />
    )

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.header}>
        <Space direction="vertical" size={4}>
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/librarian/orders')}
                  >
                    Заказы
                  </span>
                ),
              },
              { title: `Детали заказа` },
            ]}
          />
          <Title level={4} style={{ margin: 0 }}>
            Заказ #{order.id.slice(0, 8).toUpperCase()}
          </Title>
        </Space>

        <Space>
          <Button icon={<Printer size={16} />}>Печать</Button>
          <Button
            type="primary"
            ghost
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
          <Button icon={<MoreHorizontal size={16} />} />
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className={classes.mainContent}>
            <OrderInfo order={order} />
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className={classes.sidebarContainer}>
            <UserSidebar order={order} />
          </div>
        </Col>
      </Row>
    </div>
  )
}
