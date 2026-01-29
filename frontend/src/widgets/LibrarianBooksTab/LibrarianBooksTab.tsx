import { useState } from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookService } from '@shared/services/BookService'
import type { BookDto } from '@shared/services/Book/types'
import { authorService, type Author } from '@shared/services/AuthorService'
import { genreService, type Genre } from '@shared/services/GenreService'
import type { UpsertBookPayload } from '@shared/services/BookService/BookService'

type Mode = 'create' | 'edit'

type BookFormValues = {
  title: string
  authorId: string
  genreId: string
  availableQuantity?: number
  description?: string
  coverImage?: string
}
const BOOKS_QUERY_KEY = ['librarian-books']
const AUTHORS_QUERY_KEY = ['librarian-authors']
const GENRES_QUERY_KEY = ['librarian-genres']

export const LibrarianBooksTab = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('create')
  const [editingBook, setEditingBook] = useState<BookDto | null>(null)
  const [form] = Form.useForm<BookFormValues>()

  const { data: books, isLoading } = useQuery({
    queryKey: BOOKS_QUERY_KEY,
    queryFn: async (): Promise<BookDto[]> => {
      const paginated = await bookService.getPaginated(null, 50)
      return paginated.items as BookDto[]
    },
  })

  const { data: authors } = useQuery<Author[]>({
    queryKey: AUTHORS_QUERY_KEY,
    queryFn: () => authorService.getAll(),
  })

  const { data: genres } = useQuery<Genre[]>({
    queryKey: GENRES_QUERY_KEY,
    queryFn: () => genreService.getAll(),
  })

  console.log(authors)
  console.log(genres)

  const openCreateModal = () => {
    setMode('create')
    setEditingBook(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const openEditModal = (book: BookDto) => {
    setMode('edit')
    setEditingBook(book)
    form.setFieldsValue({
      title: book.title,
      authorId: book.authorId,
      genreId: '', // genre id is not available in BookDto, user will need to re-select
      availableQuantity: book.availableQuantity,
      description: book.description,
      coverImage: book.coverUrl,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const createMutation = useMutation({
    mutationFn: (payload: UpsertBookPayload) => bookService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; payload: UpsertBookPayload }) =>
      bookService.update(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEY })
    },
  })

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload: UpsertBookPayload = {
        title: values.title,
        authorId: values.authorId,
        genreId: values.genreId,
        availableQuantity: values.availableQuantity,
        description: values.description,
        coverImage: values.coverImage,
      }

      if (mode === 'create') {
        createMutation.mutate(payload)
      } else if (mode === 'edit' && editingBook) {
        updateMutation.mutate({ id: editingBook.id, payload })
      }
    } catch {
      // validation errors are handled by antd Form
    }
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const columns: ColumnsType<BookDto> = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Автор',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Жанр',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'В наличии',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>
            Редактировать
          </Button>
          <Button
            size="small"
            danger
            loading={deleteMutation.isPending}
            onClick={() => handleDelete(record.id)}
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Книги
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          Добавить книгу
        </Button>
      </Space>

      <Table
        loading={isLoading}
        dataSource={books ?? []}
        columns={columns}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={isModalOpen}
        title={mode === 'create' ? 'Добавить книгу' : 'Редактировать книгу'}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название книги' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="authorId"
            label="Автор"
            rules={[{ required: true, message: 'Выберите автора' }]}
          >
            <Select
              showSearch
              placeholder="Выберите автора"
              optionFilterProp="children"
              options={(authors ?? []).map(author => ({
                value: author.id,
                label: `${author.firstName} ${author.lastName}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="genreId"
            label="Жанр"
            rules={[{ required: true, message: 'Выберите жанр' }]}
          >
            <Select
              showSearch
              placeholder="Выберите жанр"
              optionFilterProp="children"
              options={(genres ?? []).map(genre => ({
                value: genre.id,
                label: genre.label,
              }))}
            />
          </Form.Item>
          <Form.Item name="availableQuantity" label="Количество в наличии">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="coverImage" label="URL обложки">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
