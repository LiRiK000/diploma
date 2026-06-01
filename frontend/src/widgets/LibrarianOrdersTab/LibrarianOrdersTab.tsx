import { useState, useMemo } from 'react'
import { Table, Input, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { getTableColumns, getPagination } from './utils'
import { useLibrarianOrders } from '@features/manage-orders/hooks/use-librarian-orders'
import { useOrderActions } from '@features/manage-orders/hooks/use-orders-management'
import { OrderResponse } from './types'
import classes from './OrderTable.module.scss'

export const LibrarianOrdersTab = () => {
  const navigate = useNavigate()
  const { data: orders = [], isLoading, isFetching } = useLibrarianOrders()
  const { approve, reject } = useOrderActions()

  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    if (!searchQuery.trim()) return orders

    const query = searchQuery.toLowerCase().trim()

    return orders.filter(order => {
      const idMatch = String(order.id).toLowerCase().includes(query)

      const userFirstName =
        order.user?.firstName || order.reader?.firstName || ''
      const userLastName = order.user?.lastName || order.reader?.lastName || ''
      const userMatch =
        userFirstName.toLowerCase().includes(query) ||
        userLastName.toLowerCase().includes(query)

      const booksMatch =
        order.items?.some((item: any) =>
          item.book?.title?.toLowerCase().includes(query),
        ) || order.book?.title?.toLowerCase().includes(query)

      return idMatch || userMatch || booksMatch
    })
  }, [orders, searchQuery])

  const columns = useMemo(
    () =>
      getTableColumns(
        id => approve(id),
        id => reject(id),
        id => void navigate(`/librarian/orders/${id}`),
      ),
    [approve, reject, navigate],
  )

  const pagination = useMemo(
    () => getPagination(filteredOrders),
    [filteredOrders],
  )

  return (
    <>
      <div className={classes.tableHeader}>
        <Space direction="vertical" size={2}>
          <Typography.Title level={4} className={classes.tabTitle}>
            Журнал заказов
          </Typography.Title>
          <span className={classes.tabSubtitle}>
            Рассмотрение заявок на выдачу и возврат литературы
          </span>
        </Space>

        <div className={classes.searchWrapper}>
          <Input
            placeholder="Поиск по № заказа, имени читателя или книге..."
            allowClear
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            prefix={
              <Search
                size={16}
                style={{ color: 'var(--text-secondary)', marginRight: 4 }}
              />
            }
            className={classes.customSearchInput}
          />
        </div>
      </div>

      <div className={`${classes.tableWrapper} tour-step-orders-table`}>
        <Table<OrderResponse>
          loading={isLoading || isFetching}
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={pagination}
          className={classes.customTable}
        />
      </div>
    </>
  )
}
