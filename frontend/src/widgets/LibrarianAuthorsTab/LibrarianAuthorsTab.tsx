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
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import dayjs from 'dayjs'
import { Author } from '@shared/services/AuthorService'
import { useLibrarianAuthors } from '@features/manage-authors'
import { AuthorForm } from '@entities/author/ui/AuthorForm/AuthorForm'

export const LibrarianAuthorsTab = () => {
  const { authors, isLoading, isUpserting, deleteAuthor, upsertAuthor } =
    useLibrarianAuthors()

  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])

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

  const columns = useMemo(
    () => [
      {
        title: 'Фото',
        dataIndex: 'photoUrl',
        width: 80,
        render: (url: string) => (
          <Avatar src={url} icon={<UserOutlined />} shape="square" size={48} />
        ),
      },
      { title: 'Имя', dataIndex: 'firstName' },
      { title: 'Фамилия', dataIndex: 'lastName' },
      {
        title: 'Действия',
        width: 200,
        render: (_: any, record: Author) => (
          <Space>
            <Button size="small" onClick={() => handleOpenModal(record)}>
              Редактировать
            </Button>
            <Popconfirm
              title="Удалить этого автора?"
              description="Это действие нельзя будет отменить."
              onConfirm={() => deleteAuthor(record.id)}
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
    [deleteAuthor],
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
          Управление авторами
        </Typography.Title>
        <Button type="primary" onClick={() => handleOpenModal()}>
          Добавить автора
        </Button>
      </div>

      <Table
        dataSource={authors}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={isModalOpen}
        confirmLoading={isUpserting}
        onOk={handleFinish}
        onCancel={() => setIsModalOpen(false)}
        title={
          editingAuthor ? 'Редактировать автора' : 'Добавить нового автора'
        }
        okText="Сохранить"
        cancelText="Отмена"
        destroyOnClose
      >
        <AuthorForm form={form} fileList={fileList} setFileList={setFileList} />
      </Modal>
    </>
  )
}
