import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Card,
  Space,
  FormInstance,
} from 'antd'
import { ImagePlus } from 'lucide-react'
import { BookFormValues } from '../model/types'
import classes from './BookForm.module.scss'

interface BookFormProps {
  form: FormInstance<BookFormValues>
  authors: any[]
  genres: any[]
}

export const BookForm = ({ form, authors, genres }: BookFormProps) => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Form
      form={form}
      layout="vertical"
      name="bookForm"
      className={classes.innerForm}
      initialValues={{ editions: [{ availableQuantity: 1 }] }}
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

      <Form.Item name="description" label="Аннотация / Описание книги">
        <Input.TextArea
          rows={3}
          placeholder="Краткое содержание произведения для читателей..."
          className={classes.customTextArea}
        />
      </Form.Item>

      <div className={classes.editionsSection}>
        <Form.List name="editions">
          {fields => (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  title="Спецификация издания и фонда"
                  className={classes.editionCard}
                >
                  <div className={classes.formGrid}>
                    <Form.Item
                      {...restField}
                      name={[name, 'publisher']}
                      label="Издательство"
                      rules={[
                        { required: true, message: 'Укажите издательство' },
                      ]}
                    >
                      <Input
                        placeholder="Например: АСТ, Эксмо"
                        className={classes.customInput}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'publishedDate']}
                      label="Год / Дата издания"
                      rules={[
                        { required: true, message: 'Укажите дату или год' },
                      ]}
                    >
                      <Input
                        placeholder="Например: 1986-01-01"
                        className={classes.customInput}
                      />
                    </Form.Item>
                  </div>

                  <div
                    className={classes.formSecondaryGrid}
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '16px',
                      marginBottom: '8px',
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'language']}
                      label="Язык (код)"
                      rules={[{ required: true, message: 'Укажите язык' }]}
                    >
                      <Input placeholder="ru" className={classes.customInput} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'pageCount']}
                      label="Кол-во страниц"
                      rules={[{ required: true, message: 'Укажите страницы' }]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        className={classes.customInputNumber}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'availableQuantity']}
                      label="Копий на складе"
                      rules={[
                        { required: true, message: 'Укажите количество' },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        className={classes.customInputNumber}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'coverImage']}
                    label="Обложка издания (3:4)"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    style={{ marginBottom: 0, marginTop: '12px' }}
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={() => false}
                      className={classes.customUpload}
                    >
                      {(!form.getFieldValue(['editions', name, 'coverImage']) ||
                        form.getFieldValue(['editions', name, 'coverImage'])
                          .length === 0) && (
                        <div className={classes.uploadPlaceholder}>
                          <ImagePlus size={20} />
                          <span>Загрузить</span>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Card>
              ))}
            </Space>
          )}
        </Form.List>
      </div>
    </Form>
  )
}
