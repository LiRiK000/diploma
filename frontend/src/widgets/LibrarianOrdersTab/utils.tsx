import { Button, TableProps, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

// TODO Вынести в service когда будет API
interface Order {
  id: string
  name: string
  books: string[]
  date: string
}

export const mockData: Order[] = [
  {
    id: '1',
    name: 'John Doe',
    books: ['Book 1', 'Book 2'],
    date: '2021-01-01',
  },
  {
    id: '2',
    name: 'Jane Doe',
    books: ['Book 3', 'Book 4'],
    date: '2021-01-02',
  },
]

export const getTableColumns = (
  onApprove: (id: string) => void,
  onReject: (id: string) => void,
): TableProps<Order>['columns'] => {
  return [
    { title: 'ID', dataIndex: 'id' },
    { title: 'ФИО', dataIndex: 'name', width: 300 },
    {
      title: 'Книги в заказе',
      dataIndex: 'books',
      width: 600,
      render: (books: string[]) => (
        <div>
          {books.map((book, index) => (
            <span key={index}>{book}</span>
          ))}
        </div>
      ),
    },
    { title: 'Дата', dataIndex: 'date', width: 400 },
    {
      title: 'Действия',
      dataIndex: 'actions',
      width: 100,
      render: (_, record: { id: string }) => (
        <div style={{ display: 'flex', gap: 10 }}>
          <Tooltip title="Одобрить">
            <Button
              type="primary"
              onClick={() => onApprove(record.id)}
              icon={<CheckOutlined />}
            />
          </Tooltip>
          <Tooltip title="Отклонить">
            <Button
              type="primary"
              danger
              onClick={() => onReject(record.id)}
              icon={<CloseOutlined />}
            />
          </Tooltip>
        </div>
      ),
    },
  ]
}
export const getPagination = (
  data: Order[],
): TableProps<Order>['pagination'] => {
  return data.length > 10 ? { pageSize: 10, position: ['bottomLeft'] } : false
}
