import { Form, Input, Typography, Button } from 'antd'
import { Link } from 'react-router-dom'
import { loginSchema } from './model/schema'
import { useLogin } from './hooks/useLogin'
import { LoginFormValues } from '@shared/services/Auth/types'
import styles from './LoginPage.module.scss'

const { Title, Text } = Typography

export const LoginPage = () => {
  const { login } = useLogin()
  const [form] = Form.useForm()

  const handleSubmit = (values: LoginFormValues) => {
    const validatedValues = loginSchema.parse(values)
    login(validatedValues)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Вход в систему
          </Title>
          <Text className={styles.subtitle}>
            Введите свои данные для входа в систему
          </Text>
        </div>

        <Form<LoginFormValues>
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              size="large"
            >
              Войти
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <Text>
            Нет аккаунта?{' '}
            <Link to="/register" className={styles.loginLink}>
              Зарегистрироваться
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
