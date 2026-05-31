import { Col, Row, Switch, Typography } from 'antd'
import { SettingsCard } from './components/SettingsCard'
import styles from './ProfileSettings.module.scss'
import { PreferenceSelector } from '@features/update-preferences/PreferenceSelector.tsx'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'

const { Text } = Typography

export const ProfileSettings = () => {
  return (
    <div className={styles.wrapper}>
      <SettingsCard
        className={styles.settingsCardCustom}
        title="Настройки интерфейса"
      >
        <Row
          align="middle"
          justify="space-between"
          className={styles.settingsRow}
        >
          <Col xs={18} sm={20}>
            <Text className={styles.rowTitle}>Цветовая тема</Text>
            <div className={styles.description}>
              Выберите между светлым и темным оформлением приложения
            </div>
          </Col>
          <Col>
            <ThemeToggle />
          </Col>
        </Row>
      </SettingsCard>

      <SettingsCard title="Уточнить предпочтения">
        <PreferenceSelector />
      </SettingsCard>

      <SettingsCard title="Уведомления">
        <div className={styles.notificationGroup}>
          <Row
            align="middle"
            justify="space-between"
            className={styles.settingsRow}
          >
            <Col xs={18} sm={20}>
              <Text className={styles.rowTitle}>Подтверждение заявки</Text>
              <div className={styles.description}>
                Мгновенные push-уведомления о статусе ваших заявок
              </div>
            </Col>
            <Col>
              <Switch
                size="default"
                defaultChecked
                className={styles.customSwitch}
              />
            </Col>
          </Row>

          <Row
            align="middle"
            justify="space-between"
            className={styles.settingsRow}
          >
            <Col xs={18} sm={20}>
              <Text className={styles.rowTitle}>Напоминание о возврате</Text>
              <div className={styles.description}>
                Уведомлять за 3 дня до окончания срока сдачи книги
              </div>
            </Col>
            <Col>
              <Switch
                size="default"
                defaultChecked
                className={styles.customSwitch}
              />
            </Col>
          </Row>
        </div>
      </SettingsCard>
    </div>
  )
}
