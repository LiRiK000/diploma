import { useState } from 'react'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  authorService,
  type Author,
  type UpsertAuthorPayload,
} from '@shared/services/AuthorService'

type AuthorFormValues = {
  firstName: string
  lastName: string
  dateOfBirth: Dayjs
  dateOfDeath?: Dayjs
}

type Mode = 'create' | 'edit'

const AUTHORS_QUERY_KEY = ['librarian-authors']

export const LibrarianAuthorsTab = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('create')
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [form] = Form.useForm<AuthorFormValues>()

  const { data, isLoading } = useQuery({
    queryKey: AUTHORS_QUERY_KEY,
    queryFn: () => authorService.getAll(),
  })

  const openCreateModal = () => {
    setMode('create')
    setEditingAuthor(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const openEditModal = (author: Author) => {
    setMode('edit')
    setEditingAuthor(author)
    form.setFieldsValue({
      firstName: author.firstName,
      lastName: author.lastName,
      dateOfBirth: dayjs(author.dateOfBirth),
      dateOfDeath: author.dateOfDeath ? dayjs(author.dateOfDeath) : undefined,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const createMutation = useMutation({
    mutationFn: (payload: UpsertAuthorPayload) => authorService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORS_QUERY_KEY })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; payload: UpsertAuthorPayload }) =>
      authorService.update(params.id, params.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORS_QUERY_KEY })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTHORS_QUERY_KEY })
    },
  })

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload: UpsertAuthorPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth.toISOString(),
        dateOfDeath: values.dateOfDeath
          ? values.dateOfDeath.toISOString()
          : undefined,
      }

      if (mode === 'create') {
        createMutation.mutate(payload)
      } else if (mode === 'edit' && editingAuthor) {
        updateMutation.mutate({ id: editingAuthor.id, payload })
      }
    } catch {
      // validation errors are handled by antd Form
    }
  }

  const handleDelete = (authorId: string) => {
    deleteMutation.mutate(authorId)
  }

  const columns: ColumnsType<Author> = [
    {
      title: 'Имя',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: value => dayjs(value).format('DD.MM.YYYY'),
    },
    {
      title: 'Дата смерти',
      dataIndex: 'dateOfDeath',
      key: 'dateOfDeath',
      render: value => (value ? dayjs(value).format('DD.MM.YYYY') : '—'),
    },
    {
      title: 'Книг',
      dataIndex: 'booksCount',
      key: 'booksCount',
      render: value => value ?? 0,
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
          Авторы
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          Добавить автора
        </Button>
      </Space>
      <Table
        loading={isLoading}
        dataSource={data ?? []}
        columns={columns}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />

      <Modal
        open={isModalOpen}
        title={mode === 'create' ? 'Добавить автора' : 'Редактировать автора'}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя автора' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Фамилия"
            rules={[{ required: true, message: 'Введите фамилию автора' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Дата рождения"
            rules={[
              {
                required: true,
                message: 'Укажите дату рождения',
              },
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="dateOfDeath" label="Дата смерти">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
