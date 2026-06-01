import { useState, useMemo } from 'react'
import {
  Button,
  Form,
  Modal,
  Space,
  Table,
  Typography,
  Popconfirm,
  Image,
  Tag,
  Input,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import type { BookDto } from '@shared/services/Book/types'
import { Plus, Edit2, Trash2, BookOpen, Search } from 'lucide-react'
import { useLibrarianBooks } from '@features/manage-books/hooks/useLibrarianBooks'
import { BookFormValues } from '@features/manage-books/model/types'
import { BookForm } from '@features/manage-books/ui/BookForm'
import classes from './LibrarianBooksTab.module.scss'

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

  const [searchQuery, setSearchQuery] = useState('')

  const filteredBooks = useMemo(() => {
    if (!books) return []
    if (!searchQuery.trim()) return books

    const query = searchQuery.toLowerCase().trim()

    return books.filter(book => {
      const titleMatch = book.title?.toLowerCase().includes(query)
      const authorMatch = book.author?.toLowerCase().includes(query)

      return titleMatch || authorMatch
    })
  }, [books, searchQuery])

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
        title: 'Обложка',
        key: 'cover',
        width: 80,
        render: (_, record) => (
          <div className={classes.tableCoverWrapper}>
            <Image
              src={record.coverUrl}
              width={44}
              height={60}
              className={classes.tableCover}
              fallback="https://placehold.co/44x60?text=No+Cover"
              preview={{
                mask: <span className={classes.previewMask}>См.</span>,
              }}
            />
          </div>
        ),
      },
      {
        title: 'Название книги',
        dataIndex: 'title',
        key: 'title',
        width: '30%',
        render: title => <span className={classes.bookTitle}>{title}</span>,
      },
      {
        title: 'Автор',
        dataIndex: 'author',
        key: 'author',
        render: (author, record) => (
          <span className={classes.metaText}>
            {author ? `${author}` : `ID: ${record.authorId}`}
          </span>
        ),
      },
      {
        title: 'Жанр',
        dataIndex: 'genre',
        key: 'genre',
        render: genre => <Tag className={classes.genreTag}>{genre || '—'}</Tag>,
      },
      {
        title: 'Доступно',
        dataIndex: 'availableQuantity',
        key: 'availableQuantity',
        align: 'center',
        width: 120,
        render: qty => (
          <span
            className={`${classes.qtyBadge} ${qty === 0 ? classes.empty : ''}`}
          >
            {qty} шт.
          </span>
        ),
      },
      {
        title: 'Действия',
        key: 'actions',
        fixed: 'right',
        width: 140,
        align: 'right',
        render: (_, record) => (
          <Space size={8}>
            <Button
              type="text"
              size="small"
              icon={<Edit2 size={14} />}
              onClick={() => handleOpenModal(record)}
              className={classes.actionEditBtn}
            />
            <Popconfirm
              title="Удалить книгу из фонда?"
              description="Это действие нельзя будет отменить."
              onConfirm={() => deleteBook(record.id)}
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
              className={classes.customPopconfirm}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={14} />}
                className={classes.actionDeleteBtn}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteBook],
  )

  return (
    <div className={classes.tabContainer}>
      <div className={classes.tabHeader}>
        <Space direction="vertical" size={2}>
          <Typography.Title level={4} className={classes.tabTitle}>
            Управление фондом
          </Typography.Title>
          <span className={classes.tabSubtitle}>
            Редактирование, добавление и списание книг
          </span>
        </Space>

        <div className={classes.searchWrapper}>
          <Input
            placeholder="Поиск по названию или автору..."
            allowClear
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            prefix={
              <Search
                size={16}
                style={{ color: 'var(--text-secondary)', marginRight: 4 }}
              />
            }
            className={classes.customSearchInput}
          />
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => handleOpenModal()}
            className={`${classes.addBookBtn} tour-step-add-book-btn`}
          >
            Добавить книгу
          </Button>
        </div>
      </div>

      <div className={classes.tableCard}>
        <Table
          dataSource={filteredBooks}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          className={classes.customTable}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            className: classes.customPagination,
          }}
        />
      </div>

      <Modal
        open={isModalOpen}
        title={
          <Space size={8} className={classes.modalTitleWrapper}>
            <BookOpen size={18} className={classes.modalHeaderIcon} />
            <span>
              {editingBook ? 'Редактирование книги' : 'Внесение новой книги'}
            </span>
          </Space>
        }
        onOk={handleFinish}
        confirmLoading={isUpserting}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        width={580}
        centered
        className={classes.customModal}
        okText={editingBook ? 'Сохранить изменения' : 'Создать запись'}
        cancelText="Отмена"
      >
        <div className={classes.modalContentWrapper}>
          <BookForm
            form={form}
            authors={authors}
            genres={genres}
            fileList={fileList}
            setFileList={setFileList}
          />
        </div>
      </Modal>
    </div>
  )
}
