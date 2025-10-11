import { Button, Form, Input, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { registerSchema } from './model/schema'
import { useRegister } from './hooks/useRegister'
import { RegisterFormValues } from '@shared/services/Auth/types'
import styles from './RegisterPage.module.scss'

const { Title, Text } = Typography

export const RegisterPage = () => {
  const { register } = useRegister()
  const [form] = Form.useForm()

  const handleSubmit = async (values: RegisterFormValues) => {
    const validatedValues = registerSchema.parse(values)
    const { passwordConfirm: _passwordConfirm, ...dataToSend } = validatedValues
    register(dataToSend)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Регистрация
          </Title>
          <Text className={styles.subtitle}>
            Создайте аккаунт для доступа к сервису
          </Text>
        </div>

        <Form<RegisterFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email' },
              { type: 'email', message: 'Неверный формат email' },
            ]}
          >
            <Input placeholder="Введите email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль' },
              { min: 8, message: 'Пароль должен быть не менее 8 символов' },
            ]}
          >
            <Input.Password placeholder="Введите пароль" />
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
            <Input.Password placeholder="Подтвердите пароль" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Имя"
            rules={[
              { required: true, message: 'Пожалуйста, введите имя' },
              { min: 1, message: 'Имя обязательно' },
            ]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            name="surname"
            label="Фамилия"
            rules={[
              { required: true, message: 'Пожалуйста, введите фамилию' },
              { min: 1, message: 'Фамилия обязательна' },
            ]}
          >
            <Input placeholder="Введите фамилию" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              size="large"
            >
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <Text>
            Уже есть аккаунт?{' '}
            <Link to="/login" className={styles.loginLink}>
              Войти
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
