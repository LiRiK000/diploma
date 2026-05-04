import {
  Form,
  Space,
  Input,
  Switch,
  Divider,
  Select,
  Spin,
  FormInstance,
} from 'antd'
import { RocketOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { BookOption } from '@widgets/LibrarianRecommendationsTab/types'

interface Props {
  form: FormInstance
  genres?: { label: string; id: string }[]
  isSearching: boolean
  selectOptions: BookOption[]
  onSearch: (val: string) => void
  onBulkAdd: (genreId: string) => void
}

export const RecommendationForm = ({
  form,
  genres,
  isSearching,
  selectOptions,
  onSearch,
  onBulkAdd,
}: Props) => (
  <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
    <Space style={{ width: '100%' }} size="large">
      <Form.Item
        name="title"
        label="Публичное название"
        rules={[{ required: true }]}
        style={{ flex: 2 }}
      >
        <Input placeholder="Напр: Лучшее за месяц" />
      </Form.Item>
      <Form.Item
        name="slug"
        label="Slug (URL)"
        rules={[{ required: true }]}
        style={{ flex: 1 }}
      >
        <Input placeholder="best-of-month" />
      </Form.Item>
    </Space>

    <Form.Item name="isActive" label="Видимость" valuePropName="checked">
      <Switch checkedChildren="Показывать" unCheckedChildren="Скрыть" />
    </Form.Item>

    <Divider orientation="left" style={{ margin: '12px 0' }}>
      <span style={{ fontSize: '13px', color: '#888' }}>
        <RocketOutlined /> Наполнение книгами
      </span>
    </Divider>

    <div
      style={{
        marginBottom: 20,
        padding: '16px',
        background: '#f5f5f7',
        borderRadius: '12px',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <span style={{ fontSize: '12px', fontWeight: 500 }}>
          Массовое добавление:
        </span>
        <Select
          placeholder="Выберите жанр для импорта всех книг"
          style={{ width: '100%' }}
          options={genres?.map(g => ({ label: g.label, value: g.id }))}
          onChange={onBulkAdd}
          suffixIcon={<PlusOutlined />}
        />
      </Space>
    </div>

    <Form.Item name="bookIds" label="Список выбранных книг">
      <Select
        mode="multiple"
        placeholder="Введите название для поиска..."
        filterOption={false}
        onSearch={onSearch}
        loading={isSearching}
        options={selectOptions}
        suffixIcon={<SearchOutlined />}
        style={{ width: '100%' }}
        notFoundContent={
          isSearching ? <Spin size="small" /> : 'Книги не найдены'
        }
      />
    </Form.Item>
  </Form>
)
