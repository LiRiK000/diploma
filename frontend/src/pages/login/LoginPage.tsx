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
    try {
      const validatedValues = loginSchema.parse(values)
      login(validatedValues)
    } catch (error) {
      console.error('Ошибка валидации схемы Zod:', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <header className={styles.header}>
          <Title level={2} className={styles.title}>
            Вход в систему
          </Title>
          <Text className={styles.subtitle}>
            Введите свои данные для входа в систему
          </Text>
        </header>

        <Form<LoginFormValues>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email' },
              { type: 'email', message: 'Неверный формат email' },
            ]}
          >
            <Input placeholder="name@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль' },
              { min: 8, message: 'Пароль должен быть не менее 8 символов' },
            ]}
          >
            <Input.Password
              placeholder="Введите пароль"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              size="large"
            >
              Войти
            </Button>
          </Form.Item>
        </Form>

        <footer className={styles.footer}>
          <Text className={styles.footerText}>
            Нет аккаунта?{' '}
            <Link to="/register" className={styles.registerLink}>
              Зарегистрироваться
            </Link>
          </Text>
        </footer>
      </div>
    </div>
  )
}
