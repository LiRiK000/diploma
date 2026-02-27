import { Button } from 'antd'
import { useAddToCart } from '../model/add-to-cart'
import { AddToCartButtonProps } from './types'
import { CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useCart } from '@features/get-cart'

export const AddToCartButton = ({
  bookId,
  fullWidth = false,
  variant = 'default',
}: AddToCartButtonProps) => {
  const { mutate, isPending } = useAddToCart()
  const { data: cart, isLoading } = useCart()

  if (isLoading || !cart) {
    return (
      <Button
        shape={variant === 'icon' ? 'circle' : undefined}
        block={variant === 'default' ? fullWidth : false}
        disabled
      >
        ...
      </Button>
    )
  }

  const isInCart = cart.items.some(item => item.bookId === bookId)
  const canAddMore = cart.canAddMore ?? true

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    mutate(bookId)
  }

  // ---------------- ICON VARIANT ----------------

  if (variant === 'icon') {
    return (
      <Button
        type={isInCart ? 'default' : 'primary'}
        shape="circle"
        icon={isInCart ? <CheckOutlined /> : <ShoppingCartOutlined />}
        loading={isPending}
        disabled={isInCart || !canAddMore}
        onClick={handleClick}
      />
    )
  }

  // ---------------- DEFAULT VARIANT ----------------

  if (isInCart) {
    return (
      <Button block={fullWidth} size="large" icon={<CheckOutlined />} disabled>
        В корзине
      </Button>
    )
  }

  if (!canAddMore) {
    return (
      <Button block={fullWidth} size="large" disabled>
        Лимит 3 книги
      </Button>
    )
  }

  return (
    <Button
      block={fullWidth}
      type="primary"
      size="large"
      loading={isPending}
      icon={<ShoppingCartOutlined />}
      onClick={handleClick}
    >
      {isPending ? 'Добавляем...' : 'В корзину'}
    </Button>
  )
}
