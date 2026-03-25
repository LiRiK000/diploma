import { Form, Input, DatePicker, Upload, FormInstance } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/es/upload/interface'
import { AuthorFormValues } from './types'

interface AuthorFormProps {
  form: FormInstance<AuthorFormValues>
  fileList: UploadFile[]
  setFileList: (files: UploadFile[]) => void
}

export const AuthorForm = ({
  form,
  fileList,
  setFileList,
}: AuthorFormProps) => (
  <Form form={form} layout="vertical" name="authorForm">
    <Form.Item label="Фото автора">
      <Upload
        listType="picture-card"
        fileList={fileList}
        maxCount={1}
        beforeUpload={() => false}
        onChange={({ fileList }) => setFileList(fileList)}
      >
        {fileList.length < 1 && (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Загрузить</div>
          </div>
        )}
      </Upload>
    </Form.Item>

    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
    >
      <Form.Item
        name="firstName"
        label="Имя"
        rules={[{ required: true, message: 'Введите имя' }]}
      >
        <Input placeholder="Напр. Фёдор" />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Фамилия"
        rules={[{ required: true, message: 'Введите фамилию' }]}
      >
        <Input placeholder="Напр. Достоевский" />
      </Form.Item>
    </div>

    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
    >
      <Form.Item
        name="dateOfBirth"
        label="Дата рождения"
        rules={[{ required: true, message: 'Укажите дату' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
      </Form.Item>

      <Form.Item name="dateOfDeath" label="Дата смерти">
        <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
      </Form.Item>
    </div>
  </Form>
)
