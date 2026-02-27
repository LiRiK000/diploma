import { Button, Tooltip } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import styles from './AddToWishlistButton.module.scss'
import { AddToWishlistButtonProps } from './type'
import { useFavorites } from '../hooks/useFavorites'
import { useToggleFavorite } from '../hooks/useToggleFavorite'

export const AddToWishlistButton = ({
  variant = 'default',
  fullWidth = false,
  id,
}: AddToWishlistButtonProps) => {
  const { mutate: toggleFavorite, isPending } = useToggleFavorite()

  const { data: favorites, isLoading } = useFavorites()

  if (isLoading) {
    return <Button shape={variant === 'icon' ? 'circle' : undefined} />
  }

  const isInWishlist: boolean =
    favorites?.some((book: { id: string | number }) => book.id === id) ?? false

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
  }

  const icon = isInWishlist ? <HeartFilled /> : <HeartOutlined />

  if (variant === 'icon') {
    return (
      <Tooltip
        title={isInWishlist ? 'Удалить из желаемого' : 'Добавить в желаемое'}
      >
        <Button
          shape="circle"
          type={isInWishlist ? 'primary' : 'default'}
          icon={icon}
          loading={isPending}
          onClick={handleClick}
          className={`${styles.wishlistButton} ${
            isInWishlist ? styles.inWishlist : ''
          }`}
          danger={isInWishlist}
        />
      </Tooltip>
    )
  }

  return (
    <Tooltip
      title={isInWishlist ? 'Удалить из желаемого' : 'Добавить в желаемое'}
    >
      <Button
        type={isInWishlist ? 'primary' : 'default'}
        icon={icon}
        loading={isPending}
        onClick={handleClick}
        size="large"
        block={fullWidth}
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
