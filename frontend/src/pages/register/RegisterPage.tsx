import { useState } from 'react'
import { Button, Form, Input, Typography, Steps, DatePicker, Radio } from 'antd'
import { Link } from 'react-router-dom'
import { registerSchema } from './model/schema'
import { useRegister } from './hooks/useRegister'
import styles from './RegisterPage.module.scss'
import z from 'zod'

const { Title, Text } = Typography

export const RegisterPage = () => {
  const { register, isLoading } = useRegister()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()

  const next = async () => {
    try {
      const fields =
        currentStep === 0
          ? ['email', 'password', 'passwordConfirm']
          : ['name', 'surname']

      await form.validateFields(fields)
      setCurrentStep(currentStep + 1)
    } catch (err) {
      console.log('Validate Failed:', err)
    }
  }

  const onFinish = () => {
    try {
      const allValues = form.getFieldsValue(true)
      const cleanValues = Object.fromEntries(
        Object.entries(allValues).map(([key, value]) => [
          key,
          value === '' ? undefined : value,
        ]),
      )
      const validated = registerSchema.parse(cleanValues)
      const { passwordConfirm: _, ...dataToSend } = validated
      if (dataToSend.birthDate && dataToSend.birthDate.$d) {
        dataToSend.birthDate = dataToSend.birthDate.toISOString()
      }
      console.log('Отправка на бэк:', dataToSend)
      register(dataToSend)
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error('Детальные ошибки Zod:', err.flatten().fieldErrors)
      }
    }
  }
  const steps = [
    {
      title: 'Аккаунт',
      content: (
        <>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password placeholder="минимум 8 символов" />
          </Form.Item>
          <Form.Item
            name="passwordConfirm"
            label="Подтвердите пароль"
            dependencies={['password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value)
                    return Promise.resolve()
                  return Promise.reject(new Error('Пароли не совпадают'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="еще раз" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Профиль',
      content: (
        <>
          <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
            <Input placeholder="Иван" />
          </Form.Item>
          <Form.Item
            name="surname"
            label="Фамилия"
            rules={[{ required: true }]}
          >
            <Input placeholder="Иванов" />
          </Form.Item>
          <Form.Item name="displayName" label="Никнейм (необязательно)">
            <Input placeholder="IvanCool2005" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Дополнительно',
      content: (
        <>
          <Form.Item
            name="phone"
            label="Телефон"
            rules={[{ pattern: /^7\d{10}$/, message: '7XXXXXXXXXX' }]}
          >
            <Input placeholder="79998887766" />
          </Form.Item>
          <Form.Item name="gender" label="Пол" initialValue="OTHER">
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio value="MALE">Мужчина</Radio>
              <Radio value="FEMALE">Женщина</Radio>
              <Radio value="OTHER">Другой</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="birthDate" label="Дата рождения">
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Выберите дату"
              format="DD.MM.YYYY"
            />
          </Form.Item>
        </>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Title level={3}>Регистрация</Title>
          <Steps
            size="small"
            current={currentStep}
            className={styles.steps}
            items={steps.map(s => ({ title: s.title }))}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          preserve={true}
        >
          <div className={styles.stepContent}>{steps[currentStep].content}</div>

          <div className={styles.actions}>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Назад
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={next} style={{ flex: 1 }}>
                Далее
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{ flex: 1 }}
              >
                Завершить
              </Button>
            )}
          </div>
        </Form>

        <div className={styles.footer} style={{ marginTop: 20 }}>
          <Text type="secondary">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
