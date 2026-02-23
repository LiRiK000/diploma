import { useState, useMemo } from 'react'
import { Button, Form, Modal, Space, Table, Typography, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import type { BookDto } from '@shared/services/Book/types'
import { useLibrarianBooks } from '@features/manage-books/hooks/useLibrarianBooks'
import { BookFormValues } from '@features/manage-books/model/types'
import { BookForm } from '@features/manage-books/ui/BookForm'
export const LibrarianBooksTab = () => {
  const {
    books,
    authors,
    genres,
    isLoading,
    isUpserting,
    deleteBook,
    upsertBook,
  } = useLibrarianBooks()

  const [form] = Form.useForm<BookFormValues>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<BookDto | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleOpenModal = (book?: BookDto) => {
    setEditingBook(book || null)
    if (book) {
      form.setFieldsValue({
        title: book.title,
        authorId: book.authorId,
        genreId: book.genreId,
        availableQuantity: book.availableQuantity,
        description: book.description,
      })
      setFileList(
        book.coverUrl
          ? [{ uid: '-1', name: 'cover', status: 'done', url: book.coverUrl }]
          : [],
      )
    } else {
      form.resetFields()
      setFileList([])
    }
    setIsModalOpen(true)
  }

  const handleFinish = async () => {
    try {
      const values = await form.validateFields()
      const file = fileList[0]?.originFileObj as File

      await upsertBook({
        id: editingBook?.id,
        payload: values,
        file,
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const columns: ColumnsType<BookDto> = useMemo(
    () => [
      {
        title: 'Название',
        dataIndex: 'title',
        key: 'title',
        width: '25%',
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
        align: 'center',
      },
      {
        title: 'Действия',
        key: 'actions',
        fixed: 'right',
        width: 200,
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => handleOpenModal(record)}>
              Редактировать
            </Button>
            <Popconfirm
              title="Удалить книгу?"
              onConfirm={() => deleteBook(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button size="small" danger>
                Удалить
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteBook],
  )

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Управление фондом
        </Typography.Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Добавить книгу
        </Button>
      </div>

      <Table
        dataSource={books}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        title={editingBook ? 'Редактировать книгу' : 'Новая книга'}
        onOk={handleFinish}
        confirmLoading={isUpserting}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        width={600}
      >
        <BookForm
          form={form}
          authors={authors}
          genres={genres}
          fileList={fileList}
          setFileList={setFileList}
        />
      </Modal>
    </>
  )
}
