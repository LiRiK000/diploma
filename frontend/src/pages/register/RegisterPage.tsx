import { useState } from 'react'
import { Button, Form, Input, Typography, Steps, DatePicker, Radio } from 'antd'
import { Link } from 'react-router-dom'
import { registerSchema } from './model/schema'
import { useRegister } from './hooks/useRegister'
import styles from './RegisterPage.module.scss'
import z from 'zod'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export const RegisterPage = () => {
  const { register, isLoading } = useRegister()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()

  const steps = [
    {
      title: 'Аккаунт',
      fields: ['email', 'password', 'passwordConfirm'],
      content: (
        <>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Введите корректный email',
              },
            ]}
          >
            <Input placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, min: 8, message: 'Минимум 8 символов' }]}
          >
            <Input.Password placeholder="минимум 8 символов" />
          </Form.Item>

          <Form.Item
            name="passwordConfirm"
            label="Подтвердите пароль"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
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
      fields: ['name', 'surname', 'displayName'],
      content: (
        <>
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Иван" />
          </Form.Item>

          <Form.Item
            name="surname"
            label="Фамилия"
            rules={[{ required: true, message: 'Введите фамилию' }]}
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
      fields: ['phone', 'gender', 'birthDate'],
      content: (
        <>
          <Form.Item
            name="phone"
            label="Телефон"
            rules={[
              {
                pattern: /^7\d{10}$/,
                message: 'Формат: 79991234567',
              },
            ]}
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

  const next = async () => {
    try {
      const fields = steps[currentStep].fields
      await form.validateFields(fields)
      setCurrentStep(prev => prev + 1)
    } catch (err) {
      console.log('Step validation failed:', err)
    }
  }

  const prev = () => setCurrentStep(prev => prev - 1)

  const handleFinish = async () => {
    if (currentStep !== steps.length - 1) return

    try {
      await form.validateFields(steps[currentStep].fields)

      const allValues = form.getFieldsValue(true)

      const transformedValues = {
        ...allValues,
        birthDate: dayjs.isDayjs(allValues.birthDate)
          ? allValues.birthDate.toISOString()
          : allValues.birthDate,
      }

      const cleanValues = Object.fromEntries(
        Object.entries(transformedValues).map(([key, value]) => [
          key,
          value === '' ? undefined : value,
        ]),
      )

      const validated = registerSchema.parse(cleanValues)

      const { passwordConfirm: _, ...dataToSend } = validated

      register(dataToSend)
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log('Validation error:', err.flatten().fieldErrors)
      } else {
        console.log('Error:', err)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Title level={3}>Регистрация</Title>
          <Steps
            size="small"
            current={currentStep}
            items={steps.map(s => ({ title: s.title }))}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          preserve={true}
          requiredMark={false}
          onKeyDown={e => {
            if (e.key === 'Enter' && currentStep < steps.length - 1) {
              e.preventDefault()
              next()
            }
          }}
        >
          <div className={styles.stepContent}>{steps[currentStep].content}</div>

          <div className={styles.actions}>
            {currentStep > 0 && (
              <Button onClick={prev} htmlType="button">
                Назад
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={next} htmlType="button" block>
                Далее
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleFinish}
                loading={isLoading}
                block
                htmlType="button"
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
