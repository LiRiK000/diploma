import { Table } from 'antd'
import { useMemo } from 'react'
import { getTableColumns, getPagination } from './utils'
import { useLibrarianOrders } from '@features/manage-orders/hooks/use-librarian-orders'
import { useOrderActions } from '@features/manage-orders/hooks/use-orders-management'
import { OrderResponse } from './types'

export const LibrarianOrdersTab = () => {
  const { data: orders = [], isLoading, isFetching } = useLibrarianOrders()

  const { approve, reject } = useOrderActions()

  const columns = useMemo(
    () =>
      getTableColumns(
        id => approve(id),
        id => reject(id),
      ),
    [approve, reject],
  )

  const pagination = useMemo(() => getPagination(orders), [orders])

  return (
    <Table<OrderResponse>
      loading={isLoading || isFetching}
      dataSource={orders}
      columns={columns}
      rowKey="id"
      scroll={{ x: 1000 }}
      pagination={pagination}
    />
  )
}
