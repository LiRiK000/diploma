import { Badge, Avatar } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { NavLink, Link } from 'react-router-dom'
import { routes } from '@shared/constants'
import styles from './CartIcon.module.scss'
import { useCartTotal } from '../model/useCartTotal'
import { CartIconProps } from './types'

interface ExtendedProps extends CartIconProps {
  noLink?: boolean
}

export const CartIcon = ({ flag = false, noLink = false }: ExtendedProps) => {
  const { data: itemCount = 0 } = useCartTotal()

  const iconContent = <Avatar shape="square" icon={<ShoppingCartOutlined />} />

  const wrapperClass = `${styles.cartAction} ${flag ? styles.flagged : ''}`

  return (
    <Badge
      count={itemCount}
      showZero={false}
      size="small"
      color={flag ? '#FF4D4F' : undefined}
      className={`${styles.badge} ${flag ? styles.darkMode : ''}`}
    >
      {noLink ? (
        <div className={wrapperClass}>{iconContent}</div>
      ) : (
        <NavLink
          to={routes.cart}
          className={({ isActive }) => {
            const classes = [wrapperClass]
            if (isActive) classes.push(styles.cartActionActive)
            return classes.join(' ')
          }}
        >
          {iconContent}
        </NavLink>
      )}
    </Badge>
  )
}
