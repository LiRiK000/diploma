import { useState, useMemo } from 'react'
import {
  Button,
  Form,
  Modal,
  Space,
  Table,
  Typography,
  Popconfirm,
  Avatar,
  Input,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'
import { Plus, Edit2, Trash2, User, Search } from 'lucide-react'
import { Author } from '@shared/services/AuthorService'
import { useLibrarianAuthors } from '@features/manage-authors'
import { AuthorForm } from '@entities/author/ui/AuthorForm/AuthorForm'
import classes from './LibrarianAuthorsTab.module.scss'

export const LibrarianAuthorsTab = () => {
  const { authors, isLoading, isUpserting, deleteAuthor, upsertAuthor } =
    useLibrarianAuthors()

  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [searchQuery, setSearchQuery] = useState('')

  const filteredAuthors = useMemo(() => {
    if (!authors) return []
    if (!searchQuery.trim()) return authors

    const query = searchQuery.toLowerCase().trim()

    return authors.filter(author => {
      const firstNameMatch = author.firstName?.toLowerCase().includes(query)
      const lastNameMatch = author.lastName?.toLowerCase().includes(query)

      return firstNameMatch || lastNameMatch
    })
  }, [authors, searchQuery])

  const handleOpenModal = (author?: Author) => {
    setEditingAuthor(author || null)

    if (author) {
      const formValues = {
        ...author,
        dateOfBirth: author.dateOfBirth ? dayjs(author.dateOfBirth) : undefined,
        dateOfDeath: author.dateOfDeath ? dayjs(author.dateOfDeath) : undefined,
      }

      form.setFieldsValue(formValues)

      setFileList(
        author.photoUrl
          ? [
              {
                uid: '-1',
                name: 'photo',
                status: 'done',
                url: author.photoUrl,
              },
            ]
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

      await upsertAuthor({
        id: editingAuthor?.id,
        payload: {
          ...values,
          dateOfBirth: values.dateOfBirth?.isValid()
            ? values.dateOfBirth.toISOString()
            : undefined,
          dateOfDeath: values.dateOfDeath?.isValid()
            ? values.dateOfDeath.toISOString()
            : null,
        },
        file,
      })

      setIsModalOpen(false)
      form.resetFields()
      setFileList([])
    } catch (e) {
      console.error('Ошибка при сохранении автора:', e)
    }
  }

  const columns: ColumnsType<Author> = useMemo(
    () => [
      {
        title: 'Фото',
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        width: 80,
        render: (url: string) => (
          <div className={classes.authorAvatarWrapper}>
            <Avatar
              src={url}
              icon={<User size={20} />}
              shape="square"
              size={48}
              className={classes.authorAvatar}
            />
          </div>
        ),
      },
      {
        title: 'Имя',
        dataIndex: 'firstName',
        key: 'firstName',
        render: text => <span className={classes.authorNameText}>{text}</span>,
      },
      {
        title: 'Фамилия',
        dataIndex: 'lastName',
        key: 'lastName',
        render: text => <span className={classes.authorNameText}>{text}</span>,
      },
      {
        title: 'Действия',
        key: 'actions',
        fixed: 'right',
        width: 140,
        align: 'right',
        render: (_, record: Author) => (
          <Space size={8}>
            <Button
              type="text"
              size="small"
              icon={<Edit2 size={14} />}
              onClick={() => handleOpenModal(record)}
              className={classes.actionEditBtn}
            />
            <Popconfirm
              title="Удалить этого автора?"
              description="Это действие нельзя будет отменить."
              onConfirm={() => deleteAuthor(record.id)}
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
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
    [deleteAuthor],
  )

  return (
    <div className={classes.tabContainer}>
      <div className={classes.tabHeader}>
        <Space direction="vertical" size={2}>
          <Typography.Title level={4} className={classes.tabTitle}>
            Управление авторами
          </Typography.Title>
          <span className={classes.tabSubtitle}>
            Редактирование, добавление и удаление авторов из каталога
          </span>
        </Space>

        <div className={classes.searchWrapper}>
          <Input
            placeholder="Поиск по имени или фамилии..."
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
            className={classes.addAuthorBtn}
          >
            Добавить автора
          </Button>
        </div>
      </div>

      <div className={classes.tableCard}>
        <Table
          dataSource={filteredAuthors}
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
        confirmLoading={isUpserting}
        onOk={handleFinish}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        width={500}
        centered
        className={classes.customModal}
        okText="Сохранить"
        cancelText="Отмена"
        title={
          <Space size={8} className={classes.modalTitleWrapper}>
            <User size={18} className={classes.modalHeaderIcon} />
            <span>
              {editingAuthor
                ? 'Редактировать автора'
                : 'Добавить нового автора'}
            </span>
          </Space>
        }
      >
        <div className={classes.modalContentWrapper}>
          <AuthorForm
            form={form}
            fileList={fileList}
            setFileList={setFileList}
          />
        </div>
      </Modal>
    </div>
  )
}
