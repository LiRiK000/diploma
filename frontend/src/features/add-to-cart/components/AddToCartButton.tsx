import { Button } from 'antd'
import { useAddToCart } from '../model/add-to-cart'
import { AddToCartButtonProps } from './types'
import { CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useCart } from '@features/get-cart'

export const AddToCartButton = ({
  bookId,
  fullWidth = false,
}: AddToCartButtonProps) => {
  const { mutate, isPending } = useAddToCart()
  const { data: cart, isLoading } = useCart()

  if (isLoading || !cart) {
    return (
      <Button block size="large" disabled>
        ...
      </Button>
    )
  }

  const isInCart = cart?.items.some(item => item.bookId === bookId)
  const canAddMore = cart?.canAddMore ?? true

  if (isInCart) {
    return (
      <Button
        block={fullWidth}
        size="large"
        icon={<CheckOutlined />}
        disabled
        style={{ backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' }}
      >
        В корзине
      </Button>
    )
  }
  if (!canAddMore) {
    return (
      <Button block size="large" disabled>
        Лимит корзины 3 книги
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
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        mutate(bookId)
      }}
    >
      {isPending ? 'Добавляем...' : 'В корзину'}
    </Button>
  )
}
