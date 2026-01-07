// TODO порефакторить вынести inline
import { Badge, Avatar } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { routes } from '@shared/constants'
import styles from './CartIcon.module.scss'
import { useCartTotal } from '../model/useCartTotal'
import { CartIconProps } from './types'

export const CartIcon = ({ flag = false }: CartIconProps) => {
  const { data: itemCount = 0 } = useCartTotal()
  console.log(itemCount, 'счетчик')

  if (flag) {
    return (
      <Badge
        count={itemCount}
        showZero={false}
        size="small"
        color={flag ? '#FF4D4F' : undefined}
        className={`${styles.badge} ${flag ? styles.darkMode : ''}`}
      >
        <Link to={routes.cart}>
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
        </Link>
      </Badge>
    )
  }

  return (
    <Badge
      count={itemCount}
      showZero={false}
      size="small"
      className={styles.badge}
    >
      <Link to={routes.cart}>
        <Avatar
          shape="square"
          icon={<ShoppingCartOutlined />}
          style={{ background: 'none', cursor: 'pointer' }}
          className={styles.cartAvatar}
        />
      </Link>
    </Badge>
  )
}
