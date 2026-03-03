import { Button, Form, Input } from 'antd'
import { ReviewFormData } from './types'

const { TextArea } = Input

interface ReviewFormProps {
  onSubmit: (text: string) => void
  isLoading?: boolean
}

export const ReviewForm = ({ onSubmit, isLoading }: ReviewFormProps) => {
  const [form] = Form.useForm()

  const handleFinish = (values: { content: string }) => {
    onSubmit(values.content)

    form.resetFields()
  }

  return (
    <Form<ReviewFormData>
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ marginBottom: '1.5rem' }}
    >
      <Form.Item
        label="Ваша рецензия"
        name="content"
        rules={[
          { required: true, message: 'Пожалуйста, напишите текст рецензии' },
          { min: 10, message: 'Рецензия должна быть не менее 10 символов' },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Поделитесь впечатлениями о книге..."
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Отправить рецензию
        </Button>
      </Form.Item>
    </Form>
  )
}
