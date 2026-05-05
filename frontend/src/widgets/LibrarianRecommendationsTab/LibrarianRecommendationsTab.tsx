import { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Form, Row, Col, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCollections } from './hooks/useCollections'
import { bookService } from '@shared/services/BookService'
import { CollectionCard } from './ui/CollectionCard/CollectionCard'
import { RecommendationForm } from './ui/RecommendationForm/RecommendationForm'

export const LibrarianRecommendationsTab = () => {
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectOptions, setSelectOptions] = useState([])

  const {
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
    if (foundBooks?.length) {
      setSelectOptions(prev => {
        const map = new Map()
        ;[...prev, ...foundBooks].forEach(item => map.set(item.value, item))
        return Array.from(map.values())
      })
    }
  }, [foundBooks])

  const handleEdit = useCallback(col => {
    setEditingId(col.id)

    const options =
      col.books?.map(b => ({
        label: `${b.title}`,
        value: b.id,
        cover: b.coverImage,
      })) || []

    setSelectOptions(options)

    form.setFieldsValue({
      title: col.title,
      slug: col.slug,
      isActive: col.isActive,
      bookIds: col.books?.map(b => b.id) || [],
    })

    setIsModalOpen(true)
  }, [])

  const handleBulkAdd = async genreId => {
    const books = await bookService.getBooksForAdmin({ genreId })

    setSelectOptions(prev => {
      const map = new Map()
      ;[...prev, ...books].forEach(item => map.set(item.value, item))
      return Array.from(map.values())
    })

    const current = form.getFieldValue('bookIds') || []

    form.setFieldsValue({
      bookIds: Array.from(new Set([...current, ...books.map(b => b.value)])),
    })

    message.success(`Добавлено ${books.length} книг`)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingId(null)
    form.resetFields()
    setSelectOptions([])
  }

  const onFinish = async () => {
    const values = await form.validateFields()

    if (editingId) {
      await updateCollection({ id: editingId, payload: values })
    } else {
      await createCollection(values)
    }

    handleClose()
  }

  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <h2>Подборки</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Создать
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {collections?.map(col => (
          <Col xs={24} sm={12} md={8} lg={6} key={col.id}>
            <CollectionCard
              collection={col}
              onEdit={handleEdit}
              onDelete={deleteCollection}
            />
          </Col>
        ))}
      </Row>

      <Modal
        title={editingId ? 'Редактирование' : 'Новая подборка'}
        open={isModalOpen}
        onCancel={handleClose}
        onOk={() => void onFinish()}
        confirmLoading={isProcessing}
        width={700}
      >
        <RecommendationForm
          form={form}
          genres={genres}
          isSearching={isSearching}
          selectOptions={selectOptions}
          onSearch={setSearchQuery}
          onBulkAdd={handleBulkAdd}
        />
      </Modal>
    </div>
  )
}
