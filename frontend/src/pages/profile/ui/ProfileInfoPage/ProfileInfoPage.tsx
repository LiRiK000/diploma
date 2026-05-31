import { useRef, useEffect } from 'react'
import styles from './ProfileInfoPage.module.scss'
import { User, Camera, ShieldAlert, Globe } from 'lucide-react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Spin,
} from 'antd'
import dayjs from 'dayjs'
import { useUpdateMe } from '@widgets/ProfileSettings/hooks/useUpdateMe'
import { useUpdateAvatar } from './hooks/useUpdateAvatar'
import { useGetProfile } from './hooks/useGetProfile'
import { Loader } from '@shared/components/Loader'

const { Text } = Typography

export const ProfileInfoPage = () => {
  const [form] = Form.useForm()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: user, isLoading } = useGetProfile()
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe()
  const { mutate: uploadAvatar, isPending: isAvatarUpdating } =
    useUpdateAvatar()

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        surname: user.surname,
        displayName: user.displayName || '',
        phone: user.phone || '',
        gender: user.gender || undefined,
        birthDate: user.birthDate ? dayjs(user.birthDate) : null,
      })
    }
  }, [user, form])

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <Text type="danger">Не удалось загрузить профиль</Text>
      </div>
    )
  }

  const handleFinish = (values: any) => {
    updateMe({
      ...values,
      name: values.name.trim(),
      surname: values.surname.trim(),
      birthDate: values.birthDate ? values.birthDate.toISOString() : null,
    })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadAvatar(file)
    }
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.avatarWrapper}>
        <div className={styles.avatarContainer} onClick={handleAvatarClick}>
          {isAvatarUpdating && (
            <div className={styles.loaderOverlay}>
              <Spin size="default" />
            </div>
          )}

          <div className={styles.avatar}>
            {user.avatarUrl ? (
              <img
                src={`${user.avatarUrl}?t=${new Date().getTime()}`}
                alt="Avatar"
              />
            ) : (
              <User className={styles.avatarIcon} size={40} strokeWidth={1.5} />
            )}
          </div>

          {!isAvatarUpdating && (
            <div className={styles.overlay}>
              <Camera size={20} strokeWidth={2} />
              <span>Изменить</span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <Text className={styles.hintText}>Нажмите, чтобы обновить фото</Text>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <ShieldAlert size={22} className={styles.iconAccent} />
            Учётные данные
          </h2>
          <p>Личные данные для безопасности вашего аккаунта.</p>
        </div>

        <div className={styles.card}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
          >
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label="Email" name="email">
                  <Input disabled className={styles.disabledInput} />
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
                    popupClassName={styles.selectPopup}
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
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder="Выберите дату"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className={styles.submitContainer}>
              <Button
                htmlType="submit"
                type="primary"
                loading={isUpdating}
                className={styles.submitBtn}
              >
                Сохранить изменения
              </Button>
            </div>
          </Form>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>
            <Globe size={22} className={styles.iconAccent} />
            Публичные данные
          </h2>
          <p>Эта информация видна другим читателям.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.row}>
            <span>Отображаемое имя</span>
            <span className={styles.value}>
              {user.displayName || `${user.name} ${user.surname?.[0] || ''}.`}
            </span>
          </div>
          <div className={styles.row}>
            <span>Статистика</span>
            <span className={styles.value}>
              Прочитано:{' '}
              <strong className={styles.brandText}>
                {user._count?.readBooks || 0}
              </strong>
              <span className={styles.divider}>|</span>
              Избранное:{' '}
              <strong className={styles.brandText}>
                {user._count?.favoriteBooks || 0}
              </strong>
            </span>
          </div>
          <div className={styles.row}>
            <span>Роль</span>
            <span className={styles.valueRole}>{user.role}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
