import { Form, Input, InputNumber, Select, Upload, FormInstance } from 'antd'
import { UploadFile } from 'antd/es/upload/interface'
import { BookFormValues } from '../model/types'

interface BookFormProps {
  form: FormInstance<BookFormValues>
  authors: any[]
  genres: any[]
  fileList: UploadFile[]
  setFileList: (files: UploadFile[]) => void
}

export const BookForm = ({
  form,
  authors,
  genres,
  fileList,
  setFileList,
}: BookFormProps) => (
  <Form form={form} layout="vertical" name="bookForm">
    <Form.Item
      name="title"
      label="Название"
      rules={[{ required: true, message: 'Введите название' }]}
    >
      <Input placeholder="Например: Мастер и Маргарита" />
    </Form.Item>

    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
    >
      <Form.Item
        name="authorId"
        label="Автор"
        rules={[{ required: true, message: 'Выберите автора' }]}
      >
        <Select
          showSearch
          placeholder="Поиск автора"
          optionFilterProp="label"
          options={authors.map(a => ({
            value: a.id,
            label: `${a.firstName} ${a.lastName}`,
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
          placeholder="Поиск жанра"
          optionFilterProp="label"
          options={genres.map(g => ({ value: g.id, label: g.label }))}
        />
      </Form.Item>
    </div>

    <Form.Item name="availableQuantity" label="Количество в библиотеке">
      <InputNumber min={0} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item name="description" label="Описание книги">
      <Input.TextArea rows={4} placeholder="Краткое содержание..." />
    </Form.Item>

    <Form.Item label="Обложка (рекомендуется 3:4)">
      <Upload
        listType="picture-card"
        maxCount={1}
        fileList={fileList}
        beforeUpload={() => false}
        onChange={({ fileList }) => setFileList(fileList)}
      >
        {fileList.length === 0 && 'Загрузить'}
      </Upload>
    </Form.Item>
  </Form>
)
