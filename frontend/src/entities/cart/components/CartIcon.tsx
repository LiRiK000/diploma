import { Badge, Avatar } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { routes } from '@shared/constants'
import styles from './CartIcon.module.scss'
import { useCartTotal } from '../model/useCartTotal'
import { CartIconProps } from './types'

interface ExtendedProps extends CartIconProps {
  noLink?: boolean
}

export const CartIcon = ({ flag = false, noLink = false }: ExtendedProps) => {
  const { data: itemCount = 0 } = useCartTotal()

  const iconContent = (
    <Avatar
      shape="square"
      icon={<ShoppingCartOutlined />}
      style={{
        background: 'none',
        cursor: 'pointer',
        color: flag ? '#000' : 'inherit',
      }}
      className={styles.cartAvatar}
    />
  )

  return (
    <Badge
      count={itemCount}
      showZero={false}
      size="small"
      color={flag ? '#FF4D4F' : undefined}
      className={`${styles.badge} ${flag ? styles.darkMode : ''}`}
    >
      {noLink ? iconContent : <Link to={routes.cart}>{iconContent}</Link>}
    </Badge>
  )
}
