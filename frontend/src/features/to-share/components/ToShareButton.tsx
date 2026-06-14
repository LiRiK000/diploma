import { Button, Tooltip } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'
import styles from './ToShareButton.module.scss'
import { ShareButtonProps } from './type'

export const ToShareButton = ({ title }: ShareButtonProps) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(title)
    } catch {}
  }

  return (
    <Tooltip title="Поделиться">
      <Button
        type="text"
        icon={<ShareAltOutlined />}
        onClick={handleClick}
        size="large"
        className={styles.shareButton}
      >
        Поделиться
      </Button>
    </Tooltip>
  )
}
