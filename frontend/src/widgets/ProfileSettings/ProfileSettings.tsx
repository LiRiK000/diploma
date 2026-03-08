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
        <Row align="middle" justify="space-between">
          <Col>
            <Text strong>Цветовая тема</Text>
            <div className={styles.description}>
              Выберите между светлым и темным оформлением
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
        <Row align="middle" justify="space-between">
          <Col>
            <Text>Подтверждение заявки</Text>
          </Col>
          <Col>
            <Switch size="small" defaultChecked />
          </Col>
        </Row>
        <Row align="middle" justify="space-between">
          <Col>
            <Text>Напоминание о возврате</Text>
          </Col>
          <Col>
            <Switch size="small" defaultChecked />
          </Col>
        </Row>
      </SettingsCard>
    </div>
  )
}
