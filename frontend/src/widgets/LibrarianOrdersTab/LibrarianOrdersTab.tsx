import { Table } from 'antd'
import { getTableColumns, getPagination, mockData } from './utils'
import { useMemo } from 'react'

export const LibrarianOrdersTab = () => {
  const pagination = useMemo(() => getPagination(mockData), [mockData])
  const onApprove = (id: string) => {
    console.log(id)
  }

  const onReject = (id: string) => {
    console.log(id)
  }
  const columns = getTableColumns(onApprove, onReject)
  return (
    <Table
      dataSource={mockData}
      columns={columns}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      pagination={pagination}
    />
  )
}
