import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'
import styles from './ProfileInfoPage.module.scss'
import {
  LinkOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import type { Gender } from '@shared/services/Auth/types'
import { useUpdateMe } from '@widgets/ProfileSettings/hooks/useUpdateMe'

const { Text } = Typography

export const ProfileInfoPage = () => {
  const [form] = Form.useForm()
  const { data, isLoading } = useGetMe()
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe()

  const user = data?.data.user

  if (isLoading) return <div>Загрузка профиля...</div>

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <Text type="danger">Не удалось загрузить профиль</Text>
      </div>
    )
  }

  const initialBirthDate = user.birthDate ? dayjs(user.birthDate) : null

  const handleFinish = (values: {
    name: string
    surname: string
    displayName?: string
    phone?: string
    gender?: Gender
    birthDate?: dayjs.Dayjs | null
  }) => {
    updateMe({
      name: values.name.trim(),
      surname: values.surname.trim(),
      displayName: values.displayName?.trim() || '',
      phone: values.phone?.trim() || '',
      gender: values.gender,
      birthDate: values.birthDate ? values.birthDate.toISOString() : '',
    })
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" />
          ) : (
            <UserOutlined className={styles.avatarIcon} />
          )}
        </div>
        <button className={styles.avatarButton}>Изменить фото</button>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <SafetyCertificateOutlined />
            Учётные данные
          </h2>
          <p>
            Личные данные для подтверждения личности и безопасности вашего
            аккаунта.
          </p>
        </div>

        <div className={styles.card}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              email: user.email,
              name: user.name,
              surname: user.surname,
              displayName: user.displayName ?? '',
              phone: user.phone ?? '',
              gender: user.gender ?? undefined,
              birthDate: initialBirthDate,
            }}
            onFinish={handleFinish}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Телефон" name="phone">
                  <Input placeholder="+7..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Имя"
                  name="name"
                  rules={[{ required: true, message: 'Введите имя' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Фамилия"
                  name="surname"
                  rules={[{ required: true, message: 'Введите фамилию' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Отображаемое имя" name="displayName">
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Пол" name="gender">
                  <Select
                    allowClear
                    options={[
                      { value: 'MALE', label: 'Мужской' },
                      { value: 'FEMALE', label: 'Женский' },
                      { value: 'OTHER', label: 'Другое' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Дата рождения" name="birthDate">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}
            >
              <Button htmlType="submit" type="primary" loading={isUpdating}>
                Сохранить
              </Button>
            </div>
          </Form>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <LinkOutlined />
            Публичные данные
          </h2>
          <p>
            Эта информация видна другим читателям библиотеки рядом с вашими
            рецензиями.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Отображаемое имя</span>
            <span className={styles.value}>
              {user.displayName || `${user.name} ${user.surname?.[0]}.`}
            </span>
          </div>

          <div className={styles.row}>
            <span>Локация</span>
            <span className={styles.muted}>Россия, Москва</span>
          </div>

          <div className={styles.row}>
            <span>Роль</span>
            <span className={styles.value}>{user.role}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
