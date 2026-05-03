import { useState } from 'react'
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  Space,
  Tag,
  Switch,
  Form,
  Popconfirm,
  Spin,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useCollections } from './hooks/useCollections'
import styles from './LibrarianRecommendationsTab.module.scss'

export const LibrarianRecommendationsTab = () => {
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    isProcessing,
  } = useCollections()

  const handleEdit = (record: any) => {
    setEditingId(record.id)
    form.setFieldsValue({
      title: record.title,
      slug: record.slug,
      isActive: record.isActive,
      bookIds: record.books?.map((b: any) => b.id) || [],
    })
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingId(null)
    form.resetFields()
  }

  const onFinish = async (values: any) => {
    const payload = {
      title: values.title,
      slug: values.slug,
      isActive: !!values.isActive,
      bookIds: values.bookIds || [],
    }

    try {
      if (editingId) {
        await updateCollection({ id: editingId, payload })
      } else {
        await createCollection(payload)
      }
      handleClose()
    } catch (e) {
      console.error('Ошибка API:', e)
    }
  }
  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      render: (active: boolean) => (
        <Tag
          color={active ? 'processing' : 'default'}
          style={{ borderRadius: '10px' }}
        >
          {active ? 'Активна' : 'Скрыта'}
        </Tag>
      ),
    },
    {
      title: 'Книг',
      dataIndex: ['_count', 'books'], // берем из Prisma count
      key: 'booksCount',
    },
    {
      title: 'Действия',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Удалить коллекцию?"
            onConfirm={() => void deleteCollection(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h2>Управление рекомендациями</h2>
          <p>Настройка витрины главной страницы</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.appleButton}
          onClick={() => setIsModalOpen(true)}
        >
          Создать подборку
        </Button>
      </header>

      <div className={styles.tableCard}>
        <Table
          dataSource={collections}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      </div>

      <Modal
        title={editingId ? 'Редактировать' : 'Новая коллекция'}
        open={isModalOpen}
        onCancel={handleClose}
        confirmLoading={isProcessing}
        onOk={() => form.submit()}
        className={styles.appleModal}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true }}
        >
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Например: Золотой фонд" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL)"
            rules={[{ required: true }]}
          >
            <Input placeholder="golden-fund" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Отображать на главной"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="bookIds" label="Книги в подборке">
            <Select
              mode="multiple"
              placeholder="Поиск книг..."
              filterOption={false}
              onSearch={value => setSearchQuery(value)}
              options={[]}
              notFoundContent={
                isLoading ? <Spin size="small" /> : 'Книги не найдены'
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
