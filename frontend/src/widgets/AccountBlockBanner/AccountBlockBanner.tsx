import { Alert } from 'antd'
import dayjs from 'dayjs'
import { useUserBlockStatus } from '@shared/hooks/useUserBlockStatus'
import styles from './AccountBlockBanner.module.css'

export const AccountBlockBanner = () => {
  const blockInfo = useUserBlockStatus()

  if (!blockInfo.isBlocked) return null

  const message =
    blockInfo.type === 'blacklist'
      ? 'Ваш аккаунт заблокирован'
      : `Ваш аккаунт заморожен до ${dayjs(blockInfo.until).format('DD.MM.YYYY')}`

  const description = blockInfo.reason
    ? `Причина: ${blockInfo.reason}`
    : blockInfo.type === 'blacklist'
      ? 'Заказ книг и добавление в корзину недоступны.'
      : 'До указанной даты заказ книг и добавление в корзину недоступны.'

  return (
    <Alert
      className={styles.banner}
      type="error"
      showIcon
      banner
      message={message}
      description={description}
    />
  )
}
