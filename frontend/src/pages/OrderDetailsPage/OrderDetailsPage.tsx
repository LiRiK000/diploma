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

  if (isLoading) {
    return (
      <div className={classes.loader}>
        <Spin size="large" />
        <span>Загружаем детали заказа...</span>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className={classes.errorContainer}>
        <Result
          status="404"
          title="Заказ не найден"
          subTitle="К сожалению, такой заказ не существует или был удален."
          extra={
            <Button
              type="primary"
              onClick={() => navigate('/librarian/orders')}
            >
              Вернуться к заказам
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.header}>
        <Space direction="vertical" size={4}>
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    className={classes.breadcrumbLink}
                    onClick={() => navigate('/librarian/orders')}
                  >
                    Заказы
                  </span>
                ),
              },
              { title: 'Детали заказа' },
            ]}
          />
          <Title level={4} className={classes.pageTitle}>
            Заказ #{order.id.slice(0, 8).toUpperCase()}
          </Title>
        </Space>

        <Space className={classes.headerActions}>
          <Button icon={<Printer size={15} />} className={classes.secondaryBtn}>
            Печать
          </Button>
          <Button
            type="text"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate(-1)}
            className={classes.backBtn}
          >
            Назад
          </Button>
          <Button
            icon={<MoreHorizontal size={15} />}
            className={classes.secondaryBtn}
          />
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <div className={`${classes.mainContent} tour-step-order-info`}>
            <OrderInfo order={order} />
          </div>
        </Col>

        <Col xs={24} xl={8}>
          <div className={classes.sidebarContainer}>
            <UserSidebar order={order} />
          </div>
        </Col>
      </Row>
    </div>
  )
}
