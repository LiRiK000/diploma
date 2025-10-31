import { Button, Tooltip } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'
import styles from './ToShareButton.module.scss'
import { ShareButtonProps } from './type'

export const ToShareButton = ({ title }: ShareButtonProps) => {
  const handleClick = () => {
    console.log(title)
  }
  return (
    <Tooltip title="Поделиться">
      <Button
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
