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

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Пожалуйста, введите email' },
                { type: 'email', message: 'Введите корректный email' },
              ]}
            >
              <Input placeholder="example@mail.com" autoComplete="email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                {
                  required: true,
                  min: 8,
                  message: 'Пароль должен быть не менее 8 символов',
                },
              ]}
            >
              <Input.Password
                placeholder="Минимум 8 символов"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="passwordConfirm"
              label="Подтвердите пароль"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Пожалуйста, подтвердите пароль' },
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
              <Input.Password
                placeholder="Введите пароль еще раз"
                autoComplete="new-password"
              />
            </Form.Item>
          </>
        )
      case 1:
        return (
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
        )
      case 2:
        return (
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
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                className={styles.genderGroup}
              >
                <Radio value="MALE">Мужчина</Radio>
                <Radio value="FEMALE">Женщина</Radio>
                <Radio value="OTHER">Другой</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="birthDate" label="Дата рождения">
              <DatePicker
                className={styles.datePicker}
                placeholder="Выберите дату"
                format="DD.MM.YYYY"
              />
            </Form.Item>
          </>
        )
      default:
        return null
    }
  }

  const stepFields = [
    ['email', 'password', 'passwordConfirm'],
    ['name', 'surname', 'displayName'],
    ['phone', 'gender', 'birthDate'],
  ]

  const stepTitles = [
    { title: 'Аккаунт' },
    { title: 'Профиль' },
    { title: 'Дополнительно' },
  ]

  const next = async () => {
    try {
      const fields = stepFields[currentStep]
      await form.validateFields(fields)
      setCurrentStep(prev => prev + 1)
    } catch (err) {}
  }

  const prev = () => setCurrentStep(prev => prev - 1)

  const handleFinish = async () => {
    if (currentStep !== stepFields.length - 1) return

    try {
      await form.validateFields(stepFields[currentStep])
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
      } else {
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <header className={styles.header}>
          <Title level={3} className={styles.title}>
            Регистрация
          </Title>
          <Steps
            size="small"
            current={currentStep}
            items={stepTitles}
            className={styles.steps}
          />
        </header>

        <Form
          form={form}
          layout="vertical"
          preserve={true}
          requiredMark={false}
          onKeyDown={e => {
            if (e.key === 'Enter' && currentStep < stepFields.length - 1) {
              e.preventDefault()
              next()
            }
          }}
        >
          <div className={styles.stepContent}>
            {renderStepContent(currentStep)}
          </div>

          <div className={styles.actions}>
            {currentStep > 0 && (
              <Button
                onClick={prev}
                htmlType="button"
                className={styles.backButton}
              >
                Назад
              </Button>
            )}

            {currentStep < stepFields.length - 1 ? (
              <Button
                type="primary"
                onClick={next}
                htmlType="button"
                className={styles.submitButton}
              >
                Далее
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={handleFinish}
                loading={isLoading}
                htmlType="button"
                className={styles.submitButton}
              >
                Завершить
              </Button>
            )}
          </div>
        </Form>

        <footer className={styles.footer}>
          <Text className={styles.footerText}>
            Уже есть аккаунт?{' '}
            <Link to="/login" className={styles.loginLink}>
              Войти
            </Link>
          </Text>
        </footer>
      </div>
    </div>
  )
}
