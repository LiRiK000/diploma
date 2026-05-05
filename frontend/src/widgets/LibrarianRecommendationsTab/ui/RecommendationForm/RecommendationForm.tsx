import { Form, Space, Input, Switch, Divider, Select, Spin } from 'antd'
import { useState } from 'react'

export const RecommendationForm = ({
  form,
  genres,
  isSearching,
  selectOptions,
  onSearch,
  onBulkAdd,
}) => {
  const [bulkLoading, setBulkLoading] = useState(false)

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

  const handleBulk = async (genreId: string) => {
    setBulkLoading(true)
    await onBulkAdd(genreId)
    setBulkLoading(false)
  }

  return (
    <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
      <Space style={{ width: '100%' }} size="large">
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true }]}
          style={{ flex: 2 }}
        >
          <Input
            placeholder="Напр: Лучшее за месяц"
            onChange={e => {
              const slug = slugify(e.target.value)
              form.setFieldsValue({ slug })
            }}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true }]}
          style={{ flex: 1 }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Form.Item name="isActive" label="Видимость" valuePropName="checked">
        <Switch checkedChildren="Показывать" unCheckedChildren="Скрыть" />
      </Form.Item>

      <Divider>Массовое добавление</Divider>

      <Select
        placeholder="Добавить все книги по жанру"
        options={genres?.map(g => ({ label: g.label, value: g.id }))}
        onChange={handleBulk}
        loading={bulkLoading}
      />

      <Divider>Выбор книг</Divider>

      <Form.Item name="bookIds">
        <Select
          mode="multiple"
          showSearch
          filterOption={false}
          onSearch={onSearch}
          loading={isSearching}
          options={selectOptions}
          style={{ width: '100%' }}
          notFoundContent={isSearching ? <Spin size="small" /> : 'Нет книг'}
          optionRender={option => (
            <div style={{ display: 'flex', gap: 8 }}>
              <img
                src={option.data.cover}
                style={{ width: 30, height: 45, objectFit: 'cover' }}
              />
              <span>{option.label}</span>
            </div>
          )}
        />
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => {
          const selected = form.getFieldValue('bookIds') || []

          return (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectOptions
                .filter(o => selected.includes(o.value))
                .map(book => (
                  <img
                    key={book.value}
                    src={book.cover}
                    style={{ width: 40, height: 60 }}
                  />
                ))}
            </div>
          )
        }}
      </Form.Item>

      <Form.Item shouldUpdate>
        {() => {
          const count = form.getFieldValue('bookIds')?.length || 0
          return <div>Выбрано книг: {count}</div>
        }}
      </Form.Item>
    </Form>
  )
}
