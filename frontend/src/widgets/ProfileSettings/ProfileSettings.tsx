import { Col, Row, Switch, Typography } from 'antd'
import { SettingsCard } from './components/SettingsCard'
import styles from './ProfileSettings.module.scss'
import { PreferenceSelector } from '@features/update-preferences/PreferenceSelector.tsx'

const { Text } = Typography

export const ProfileSettings = () => {
  return (
    <div className={styles.wrapper}>
      {/* Секция Интерфейс */}

      <SettingsCard title="Настройки интерфейса">
        <Row align="middle" justify="space-between">
          <Col>
            <Text strong>Цветовая тема</Text>
            <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '13px' }}>
              Выберите между светлым и темным оформлением
            </div>
          </Col>
          <Col>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              defaultChecked={false}
            />
          </Col>
        </Row>

        <Row align="middle" justify="space-between"></Row>
      </SettingsCard>
      <SettingsCard title="Уточнить предпочтения">
        <PreferenceSelector />
      </SettingsCard>
      {/* Секция Уведомления */}
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
