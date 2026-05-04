import { useState, useEffect, useCallback } from 'react'
import { Button, Table, Modal, Tag, Space, Popconfirm, Form, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useCollections } from './hooks/useCollections'
import { bookService } from '@shared/services/BookService'
import { CollectionRecord, BookOption, CollectionFormValues } from './types'
import styles from './LibrarianRecommendationsTab.module.scss'
import { RecommendationForm } from './ui/RecommendationForm/RecommendationForm'

export const LibrarianRecommendationsTab = () => {
  const [form] = Form.useForm<CollectionFormValues>()
  const { message } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectOptions, setSelectOptions] = useState<BookOption[]>([])

  const {
    contextHolder: collectionMessageHolder,
    collections,
    foundBooks,
    isSearching,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    isProcessing,
    genres,
  } = useCollections(searchQuery)

  useEffect(() => {
    if (foundBooks && foundBooks.length > 0) {
      setSelectOptions(prev => {
        const combined = [...prev, ...foundBooks]
        const uniqueMap = new Map<string, BookOption>()
        combined.forEach(item => uniqueMap.set(item.value, item))
        return Array.from(uniqueMap.values())
      })
    }
  }, [foundBooks])

  const handleEdit = useCallback(
    (record: CollectionRecord) => {
      setEditingId(record.id)
      const options: BookOption[] =
        record.books?.map(b => ({
          label: `${b.title} — ${b.author?.firstName ?? ''} ${b.author?.lastName ?? ''}`,
          value: b.id,
        })) || []

      setSelectOptions(options)
      form.setFieldsValue({
        title: record.title,
        slug: record.slug,
        isActive: record.isActive,
        bookIds: record.books?.map(b => b.id) || [],
      })
      setIsModalOpen(true)
    },
    [form],
  )

  const handleBulkAdd = async (genreId: string) => {
    try {
      const books = await bookService.getBooksForAdmin({ genreId })

      if (!Array.isArray(books)) {
        console.error('Books is not an array:', books)
        return
      }

      setSelectOptions(prev => {
        const newOptions = [...prev, ...books]
        return Array.from(new Map(newOptions.map(o => [o.value, o])).values())
      })

      const currentIds = form.getFieldValue('bookIds') || []
      const newIds = books.map(b => b.value)

      form.setFieldsValue({
        bookIds: Array.from(new Set([...currentIds, ...newIds])),
      })

      message.success(`Добавлено книг: ${books.length}`)
    } catch (error) {
      console.error('Bulk add error:', error)
      message.error('Не удалось загрузить книги по жанру')
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setSelectOptions([])
    form.resetFields()
  }

  const onFinish = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        await updateCollection({ id: editingId, payload: values })
      } else {
        await createCollection(values)
      }
      handleClose()
    } catch (e) {}
  }

  const columns: ColumnsType<CollectionRecord> = [
    { title: 'Название', dataIndex: 'title', key: 'title' },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: s => <Tag color="blue">{s}</Tag>,
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      render: a => (
        <Tag color={a ? 'green' : 'default'}>{a ? 'Активна' : 'Скрыта'}</Tag>
      ),
    },
    {
      title: 'Книг',
      key: 'count',
      align: 'center',
      render: (_, r) => r._count?.books ?? r.books?.length ?? 0,
    },
    {
      title: 'Действия',
      align: 'right',
      render: (_, r) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => handleEdit(r)}
          />
          <Popconfirm
            title="Удалить?"
            onConfirm={() => {
              void deleteCollection(r.id)
            }}
          >
            <Button icon={<DeleteOutlined />} type="text" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {/* Удалили несуществующие {contextHolder} */}
      {collectionMessageHolder}

      <header className={styles.header}>
        <h2>Витрина рекомендаций</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Создать коллекцию
        </Button>
      </header>

      <Table
        dataSource={collections}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title={editingId ? 'Редактирование' : 'Новая коллекция'}
        open={isModalOpen}
        onCancel={handleClose}
        onOk={() => {
          void onFinish()
        }}
        confirmLoading={isProcessing}
        destroyOnHidden
      >
        <RecommendationForm
          form={form}
          isSearching={isSearching}
          selectOptions={selectOptions}
          onSearch={setSearchQuery}
          onBulkAdd={handleBulkAdd}
          genres={genres}
        />
      </Modal>
    </div>
  )
}
