import { Button, Tooltip, message } from 'antd'
import {
  CheckOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAddToCart } from '../model/add-to-cart'
import { useRemoveFromCart } from '../model/remove-from-cart'
import { useCart } from '@features/get-cart'
import { routes } from '@shared/constants'
import { AddToCartButtonProps } from './types'
import { useGetMe } from '@app/providers/AuthProvider/hooks/useGetMe'
import { useUserBlockStatus } from '@shared/hooks/useUserBlockStatus'
import { getBlockActionTooltip } from '@shared/utils/userBlockStatus'

export const AddToCartButton = ({
  bookId,
  fullWidth = false,
  variant = 'default',
}: AddToCartButtonProps) => {
  const { data: userData } = useGetMe()
  const blockInfo = useUserBlockStatus()
  const navigate = useNavigate()
  const location = useLocation()

  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart()
  const { data: cart, isLoading } = useCart()

  const [isHovered, setIsHovered] = useState(false)

  const isAuthorized = userData?.status === 'success'
  const isBlocked = isAuthorized && blockInfo.isBlocked
  const isPending = isAdding || isRemoving

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthorized) {
      message.warning('Пожалуйста, авторизуйтесь для добавления книг в корзину')
      navigate(routes.login, { state: { from: location.pathname } })
      return
    }

    if (isBlocked) {
      return
    }

    if (cartItem && isInCart) {
      removeFromCart(cartItem.id)
    } else if (canAddMore) {
      addToCart(bookId)
    }
  }

  if (isLoading) {
    return (
      <Button
        block={variant === 'default' ? fullWidth : false}
        loading
        size="large"
      />
    )
  }

  const cartItem = cart?.items.find(item => item.bookId === bookId)
  const isInCart = !!cartItem
  const canAddMore = cart?.canAddMore ?? true

  // --- Рендеринг ---
  const buttonIcon = !isAuthorized ? (
    <LockOutlined />
  ) : isInCart && isHovered ? (
    <DeleteOutlined />
  ) : isInCart ? (
    <CheckOutlined />
  ) : (
    <ShoppingCartOutlined />
  )

  const buttonContent = !isAuthorized
    ? 'Войти для заказа'
    : isInCart
      ? isHovered
        ? 'Удалить?'
        : 'В корзине'
      : 'В корзину'

  const blockTooltip = isBlocked ? getBlockActionTooltip(blockInfo) : ''

  return (
    <Tooltip
      title={
        !isAuthorized
          ? 'Авторизуйтесь, чтобы добавить книгу'
          : blockTooltip
      }
    >
      <Button
        block={variant === 'default' ? fullWidth : false}
        shape={variant === 'icon' ? 'circle' : undefined}
        type={isInCart ? 'default' : 'primary'}
        danger={isInCart && isHovered}
        size="large"
        loading={isPending}
        disabled={!isAuthorized ? false : isBlocked || (!isInCart && !canAddMore)}
        icon={buttonIcon}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {variant !== 'icon' && buttonContent}
      </Button>
    </Tooltip>
  )
}
