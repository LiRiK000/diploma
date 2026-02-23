import { Table } from 'antd'
import { useMemo } from 'react'
import { getTableColumns, getPagination } from './utils'
import { useLibrarianOrders } from '@features/manage-orders/hooks/use-librarian-orders'
import { useOrderActions } from '@features/manage-orders/hooks/use-orders-management'

export const LibrarianOrdersTab = () => {
  // 1. Получаем данные через TanStack Query
  const { data: orders = [], isLoading, isFetching } = useLibrarianOrders()

  // 2. Получаем методы для кнопок (approve/reject)
  const { approve, reject } = useOrderActions()

  // 3. Мемоизируем колонки, передавая в них реальные функции
  const columns = useMemo(
    () =>
      getTableColumns(
        id => approve(id),
        id => reject(id),
      ),
    [approve, reject],
  )

  // 4. Пагинация на основе реальных данных
  const pagination = useMemo(() => getPagination(orders), [orders])

  return (
    <Table
      // Показываем спиннер при первичной загрузке или обновлении
      loading={isLoading || isFetching}
      dataSource={orders}
      columns={columns}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      pagination={pagination}
    />
  )
}
