import { Table } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom' // Предполагаем использование роутинга
import { getTableColumns, getPagination } from './utils'
import { useLibrarianOrders } from '@features/manage-orders/hooks/use-librarian-orders'
import { useOrderActions } from '@features/manage-orders/hooks/use-orders-management'
import { OrderResponse } from './types'
import classes from './OrderTable.module.scss'

export const LibrarianOrdersTab = () => {
  const navigate = useNavigate()
  const { data: orders = [], isLoading, isFetching } = useLibrarianOrders()
  const { approve, reject } = useOrderActions()

  const columns = useMemo(
    () =>
      getTableColumns(
        id => approve(id),
        id => reject(id),
        id => void navigate(`/librarian/orders/${id}`),
      ),
    [approve, reject, navigate],
  )

  const pagination = useMemo(() => getPagination(orders), [orders])

  return (
    <div className={classes.tableWrapper}>
      <Table<OrderResponse>
        loading={isLoading || isFetching}
        dataSource={orders}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={pagination}
      />
    </div>
  )
}
