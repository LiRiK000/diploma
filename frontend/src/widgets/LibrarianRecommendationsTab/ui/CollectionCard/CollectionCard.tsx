import { Card, Tag, Space, Button, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './CollectionCard.module.scss'

export const CollectionCard = ({ collection, onEdit, onDelete }) => {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>{collection.title}</h3>
          <Tag color="blue">{collection.slug}</Tag>
        </div>

        <Tag color={collection.isActive ? 'green' : 'default'}>
          {collection.isActive ? 'Активна' : 'Скрыта'}
        </Tag>
      </div>

      <div className={styles.preview}>
        {collection.books?.slice(0, 4).map(book => (
          <img key={book.id} src={'book.png'} alt="" />
        ))}
      </div>

      <div className={styles.footer}>
        <span>{collection._count?.books ?? 0} книг</span>

        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(collection)} />
          <Popconfirm
            title="Удалить коллекцию?"
            onConfirm={() => onDelete(collection.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  )
}
