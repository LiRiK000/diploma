import { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Switch,
  List,
  Typography,
  Modal,
  message,
} from 'antd'
import {
  Shield,
  KeyRound,
  Smartphone,
  Trash2,
  LogOut,
  Laptop,
} from 'lucide-react'
import styles from './SecurePage.module.scss'

const { Title, Text } = Typography

const MOCK_SESSIONS = [
  {
    id: '1',
    device: 'Chrome / macOS (Текущая сессия)',
    ip: '192.168.1.45',
    date: 'Активен сейчас',
    isCurrent: true,
    isMobile: false,
  },
  {
    id: '2',
    device: 'iPhone 15 Pro / Safari',
    ip: '178.45.201.12',
    date: '25 мая, 14:22',
    isCurrent: false,
    isMobile: true,
  },
  {
    id: '3',
    device: 'Windows PC / Firefox',
    ip: '84.22.110.5',
    date: '12 мая, 09:15',
    isCurrent: false,
    isMobile: false,
  },
]

export const SecurePage = () => {
  const [form] = Form.useForm()
  const [is2faEnabled, setIs2faEnabled] = useState(false)
  const [sessions, setSessions] = useState(MOCK_SESSIONS)

  const handlePasswordSubmit = () => {
    message.success('Пароль успешно обновлен')
    form.resetFields()
  }

  const handle2faChange = (checked: boolean) => {
    setIs2faEnabled(checked)
    message.info(
      checked ? 'Двухфакторная аутентификация включена' : '2FA отключена',
    )
  }

  const handleTerminateSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    message.success('Сессия успешно завершена')
  }

  const handleTerminateAll = () => {
    Modal.confirm({
      title: 'Завершить все сессии?',
      content:
        'Это приведет к выходу из аккаунта на всех устройствах, кроме текущего.',
      okText: 'Да, завершить',
      okType: 'danger',
      cancelText: 'Отмена',
      centered: true,
      onOk() {
        setSessions(prev => prev.filter(s => s.isCurrent))
        message.success('Все остальные сессии завершены')
      },
    })
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <div className={styles.iconWrapper}>
            <Shield className={styles.iconAccent} size={22} />
          </div>
          <div>
            <Title level={2} className={styles.title}>
              Безопасность и вход
            </Title>
            <p className={styles.subtitle}>
              Управляйте доступом к вашему аккаунту и настройками приватности
            </p>
          </div>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <KeyRound size={18} className={styles.cardIcon} />
          <Title level={4}>Изменение пароля</Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handlePasswordSubmit}
          requiredMark={false}
          className={styles.form}
        >
          <Form.Item
            name="oldPassword"
            label="Текущий пароль"
            rules={[{ required: true, message: 'Введите старый пароль' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <div className={styles.gridFields}>
            <Form.Item
              name="newPassword"
              label="Новый пароль"
              rules={[
                { required: true, message: 'Минимум 6 символов', min: 6 },
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Повторите новый пароль"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Повторите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value)
                      return Promise.resolve()
                    return Promise.reject(new Error('Пароли не совпадают'))
                  },
                }),
              ]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </div>

          <Form.Item className={styles.noMargin}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitBtn}
            >
              Обновить пароль
            </Button>
          </Form.Item>
        </Form>
      </section>

      <section className={styles.card}>
        <div className={styles.rowFlex}>
          <div className={styles.infoBlock}>
            <Title level={4}>Двухфакторная аутентификация (2FA)</Title>
            <Text className={styles.description}>
              Защитите свой аккаунт дополнительным кодом подтверждения при
              каждом входе в систему.
            </Text>
          </div>
          <Switch
            checked={is2faEnabled}
            onChange={handle2faChange}
            className={styles.customSwitch}
          />
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeaderWithAction}>
          <div className={styles.cardHeader}>
            <Laptop size={18} className={styles.cardIcon} />
            <Title level={4}>Активные сессии</Title>
          </div>
          {sessions.length > 1 && (
            <Button
              type="link"
              danger
              onClick={handleTerminateAll}
              className={styles.terminateAllBtn}
            >
              Завершить другие сессии
            </Button>
          )}
        </div>

        <List
          itemLayout="horizontal"
          dataSource={sessions}
          className={styles.sessionList}
          renderItem={item => (
            <List.Item
              actions={[
                !item.isCurrent ? (
                  <Button
                    type="text"
                    danger
                    className={styles.logoutActionBtn}
                    icon={<LogOut size={15} />}
                    onClick={() => handleTerminateSession(item.id)}
                  />
                ) : null,
              ]}
              className={styles.sessionItem}
            >
              <List.Item.Meta
                avatar={
                  <div
                    className={`${styles.deviceIconWrapper} ${item.isCurrent ? styles.currentDevice : ''}`}
                  >
                    {item.isMobile ? (
                      <Smartphone size={16} />
                    ) : (
                      <Laptop size={16} />
                    )}
                  </div>
                }
                title={
                  <span className={styles.deviceTitle}>{item.device}</span>
                }
                description={
                  <span className={styles.deviceMeta}>
                    {item.ip} •{' '}
                    <span className={item.isCurrent ? styles.activeText : ''}>
                      {item.date}
                    </span>
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </section>

      <section className={`${styles.card} ${styles.dangerZone}`}>
        <div className={styles.rowFlex}>
          <div className={styles.infoBlock}>
            <Title level={4} className={styles.dangerTitle}>
              Удаление аккаунта
            </Title>
            <Text className={styles.description}>
              Полное удаление вашего профиля, всех накопленных достижений и
              истории без возможности восстановления.
            </Text>
          </div>
          <Button
            type="primary"
            danger
            icon={<Trash2 size={15} />}
            className={styles.deleteBtn}
          >
            Удалить профиль
          </Button>
        </div>
      </section>
    </div>
  )
}
