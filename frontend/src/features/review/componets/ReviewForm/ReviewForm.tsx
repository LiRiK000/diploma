import { Button, Form, Input } from 'antd'
import { ReviewFormData } from './types'

const { TextArea } = Input

export const ReviewForm = () => {
  const [form] = Form.useForm()

  const handleFinish = (values: { content: string }) => {
    form.resetFields()
    console.log(values)
  }

  return (
    <Form<ReviewFormData>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ marginBottom: '1.5rem' }}
    >
      <Form.Item
        label="Рецензию"
        name="content"
        rules={[{ required: true, message: 'Напишите рецензию' }]}
      >
        <TextArea rows={4} placeholder="Напишите вашу рецензию..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Отправить рецензию
        </Button>
      </Form.Item>
    </Form>
  )
}
