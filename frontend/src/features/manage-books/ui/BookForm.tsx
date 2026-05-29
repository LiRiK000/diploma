import { Form, Input, InputNumber, Select, Upload, FormInstance } from 'antd'
import { UploadFile } from 'antd/es/upload/interface'
import { ImagePlus } from 'lucide-react'
import { BookFormValues } from '../model/types'
import classes from './BookForm.module.scss'

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
  <Form
    form={form}
    layout="vertical"
    name="bookForm"
    className={classes.innerForm}
  >
    <Form.Item
      name="title"
      label="Название книги"
      rules={[
        { required: true, message: 'Пожалуйста, укажите название книги' },
      ]}
    >
      <Input
        placeholder="Например: Мастер и Маргарита"
        className={classes.customInput}
      />
    </Form.Item>

    <div className={classes.formGrid}>
      <Form.Item
        name="authorId"
        label="Автор"
        rules={[{ required: true, message: 'Выберите автора книги' }]}
      >
        <Select
          showSearch
          placeholder="Поиск по базе авторов"
          optionFilterProp="label"
          className={classes.customSelect}
          popupClassName={classes.customDropdown}
          options={authors.map(a => ({
            value: a.id,
            label: `${a.firstName} ${a.lastName}`,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="genreId"
        label="Жанр"
        rules={[{ required: true, message: 'Укажите жанровую категорию' }]}
      >
        <Select
          showSearch
          placeholder="Поиск жанра"
          optionFilterProp="label"
          className={classes.customSelect}
          popupClassName={classes.customDropdown}
          options={genres.map(g => ({ value: g.id, label: g.label }))}
        />
      </Form.Item>
    </div>

    <div className={classes.formSecondaryGrid}>
      <Form.Item name="availableQuantity" label="Количество копий">
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          className={classes.customInputNumber}
        />
      </Form.Item>

      <Form.Item label="Обложка издания (3:4)">
        <Upload
          listType="picture-card"
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList }) => setFileList(fileList)}
          className={classes.customUpload}
        >
          {fileList.length === 0 && (
            <div className={classes.uploadPlaceholder}>
              <ImagePlus size={20} />
              <span>Загрузить</span>
            </div>
          )}
        </Upload>
      </Form.Item>
    </div>

    <Form.Item
      name="description"
      label="Аннотация / Описание книги"
      style={{ marginBottom: 0 }}
    >
      <Input.TextArea
        rows={4}
        placeholder="Краткое содержание произведения для читателей..."
        className={classes.customTextArea}
      />
    </Form.Item>
  </Form>
)
