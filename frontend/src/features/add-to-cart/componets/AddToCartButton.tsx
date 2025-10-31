import { useState } from 'react'
import { Button, Tooltip } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import styles from './AddToCartButton.module.scss'
import { AddToCartButtonProps } from './types'

export const AddToCartButton = ({ title }: AddToCartButtonProps) => {
  const [isInCart, setIsInCart] = useState(false)
  const handleClick = () => {
    setIsInCart(prev => !prev)
  }
  return (
    <Tooltip title={isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}>
      <Button
        type={isInCart ? 'primary' : 'default'}
        icon={<ShoppingCartOutlined />}
        onClick={handleClick}
        size="large"
        className={`${styles.cartButton} ${isInCart ? styles.inCart : ''}`}
      >
        {isInCart ? 'В корзине' : 'В корзину'}
      </Button>
    </Tooltip>
  )
}
