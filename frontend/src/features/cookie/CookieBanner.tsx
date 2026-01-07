import { useEffect, useState } from 'react'
import { Modal, Button, Typography } from 'antd'
import { useCookieConsentStore } from './model/store'
import { COOKIE_CONSENT_TEXT } from './constants'
import { routes } from '@shared/constants'

const { Text, Link: AntLink } = Typography

export const CookieBanner = () => {
  const { consent, accept, revoke } = useCookieConsentStore(state => state)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!consent) {
      setVisible(true)
    }
  }, [consent])

  if (consent) return null

  const handleAccept = () => {
    accept()
    setVisible(false)
  }

  const handleRevoke = () => {
    revoke()
    setVisible(false)
  }

  return (
    <Modal
      open={visible}
      closable={false}
      centered
      maskClosable={false}
      footer={null}
      width={600}
      title="Согласие на использование куки"
    >
      <div style={{ marginBottom: 24 }}>
        <Text>
          {COOKIE_CONSENT_TEXT}
          <AntLink href={routes.privacy}>Политика конфиденциальности</AntLink>
        </Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={handleAccept} type="primary">
          Принять
        </Button>
        <Button type="default" onClick={handleRevoke} danger>
          Отклонить
        </Button>
      </div>
    </Modal>
  )
}
