import { Button } from 'antd'
import { useAddToCart } from '../model/add-to-cart'
import { AddToCartButtonProps } from './types'
import {
  CheckOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useCart } from '@features/get-cart'

import { useRemoveFromCart } from '../model/remove-from-cart'
import { useState } from 'react'

export const AddToCartButton = ({
  bookId,
  fullWidth = false,
  variant = 'default',
}: AddToCartButtonProps) => {
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart()
  const { data: cart, isLoading } = useCart()

  const [isHovered, setIsHovered] = useState(false)

  const isPending = isAdding || isRemoving

  if (isLoading || !cart) {
    return (
      <Button
        shape={variant === 'icon' ? 'circle' : undefined}
        block={variant === 'default' ? fullWidth : false}
        disabled
        size="large"
      >
        ...
      </Button>
    )
  }

  const cartItem = cart.items.find(item => item.bookId === bookId)
  const isInCart = !!cartItem
  const canAddMore = cart.canAddMore ?? true

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInCart && cartItem) {
      removeFromCart(cartItem.id)
    } else if (canAddMore) {
      addToCart(bookId)
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        type={isInCart ? 'default' : 'primary'}
        shape="circle"
        danger={isInCart && isHovered}
        icon={
          isInCart ? (
            isHovered ? (
              <DeleteOutlined />
            ) : (
              <CheckOutlined />
            )
          ) : (
            <ShoppingCartOutlined />
          )
        }
        loading={isPending}
        disabled={!isInCart && !canAddMore}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    )
  }

  if (!isInCart && !canAddMore) {
    return (
      <Button block={fullWidth} size="large" disabled>
        Лимит 3 книги
      </Button>
    )
  }

  return (
    <Button
      block={fullWidth}
      type={isInCart ? 'default' : 'primary'}
      danger={isInCart && isHovered}
      size="large"
      loading={isPending}
      icon={
        isInCart ? (
          isHovered ? (
            <DeleteOutlined />
          ) : (
            <CheckOutlined />
          )
        ) : (
          <ShoppingCartOutlined />
        )
      }
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isInCart
        ? isHovered
          ? 'Удалить?'
          : 'В корзине'
        : isPending
          ? 'Добавляем...'
          : 'В корзину'}
    </Button>
  )
}
