import { Card, Tag, Space, Button, Popconfirm, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons'
import styles from './CollectionCard.module.scss'

export const CollectionCard = ({ collection, onEdit, onDelete }) => {
  const books = collection.books || []
  const count = collection._count?.books ?? 0

  return (
    <Card className={styles.card} bordered={false}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h3>{collection.title}</h3>
          <code>/{collection.slug}</code>
        </div>
        <div className={styles.status}>
          <div
            className={`${styles.dot} ${collection.isActive ? styles.active : ''}`}
          />
        </div>
      </div>
      <img src="book.png" alt="" />
      <div className={styles.previewContainer}></div>

      <div className={styles.footer}>
        <div className={styles.countInfo}>
          <BookOutlined />
          <span>{count} книг</span>
        </div>

        <Space size="middle">
          <Tooltip title="Редактировать">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEdit(collection)}
              className={styles.actionBtn}
            />
          </Tooltip>

          <Popconfirm
            title="Удалить подборку?"
            description="Это действие нельзя будет отменить."
            onConfirm={() => onDelete(collection.id)}
            okText="Да"
            cancelText="Нет"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Удалить">
              <Button
                type="text"
                shape="circle"
                icon={<DeleteOutlined />}
                danger
                className={styles.actionBtn}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      </div>
    </Card>
  )
}
