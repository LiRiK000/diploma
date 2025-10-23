import { Button, Table } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

export const LibrarianOrdersTab = () => {
  const onApprove = (id: string) => {
    console.log(id)
  }

  const onReject = (id: string) => {
    console.log(id)
  }

  return (
    <Table
      dataSource={[
        {
          id: '1',
          name: 'John Doe',
          books: ['Book 1', 'Book 2'],
          date: '2021-01-01',
        },
      ]}
      columns={[
        { title: 'ID', dataIndex: 'id' },
        { title: 'ФИО', dataIndex: 'name', width: 300 },
        {
          title: 'Книги в заказе',
          dataIndex: 'books',
          width: 600,
          render: (_, record) => (
            <div>
              {record.books.map((book: string) => (
                <div key={book}>{book}</div>
              ))}
            </div>
          ),
        },
        { title: 'Дата', dataIndex: 'date', width: 400 },
        {
          title: 'Действия',
          dataIndex: 'actions',
          width: 100,
          render: (_, record) => (
            <div style={{ display: 'flex', gap: 10 }}>
              <Button
                type="primary"
                onClick={() => onApprove(record.id)}
                icon={<CheckOutlined />}
              />
              <Button
                type="primary"
                danger
                onClick={() => onReject(record.id)}
                icon={<CloseOutlined />}
              />
            </div>
          ),
        },
      ]}
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 10,
        position: ['bottomLeft'],
      }}
    />
  )
}
