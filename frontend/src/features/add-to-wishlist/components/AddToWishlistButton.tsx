import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import styles from './AddToWishlistButton.module.scss'
import { AddToWishlistButtonProps } from './type'

export const AddToWishlistButton = ({ title }: AddToWishlistButtonProps) => {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const handleClick = () => {
    setIsInWishlist(prev => !prev)
  }
  return (
    <Tooltip
      title={isInWishlist ? 'Удалить из желаемого' : 'Добавить в желаемое'}
    >
      <Button
        type={isInWishlist ? 'primary' : 'default'}
        icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
        onClick={handleClick}
        size="large"
        className={`${styles.wishlistButton} ${
          isInWishlist ? styles.inWishlist : ''
        }`}
        danger={isInWishlist}
      >
        {isInWishlist ? 'В желаемом' : 'Хочу прочитать'}
      </Button>
    </Tooltip>
  )
}
