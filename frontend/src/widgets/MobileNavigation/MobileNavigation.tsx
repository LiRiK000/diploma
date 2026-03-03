import { UserAvatar } from '@entities/user'
import { routes } from '@shared/constants'
import { NavLink } from 'react-router-dom'
import styles from './MobileNavigation.module.scss'
import { isMobile } from './utils'
import { Activity } from 'react'
import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { CartIcon } from '@entities/cart/components'

export const MobileNavigation = () => {
  const isShowMobileNavigation = isMobile()

  return (
    <Activity mode={isShowMobileNavigation ? 'visible' : 'hidden'}>
      <nav className={styles.mobileNav}>
        <NavLink
          to={routes.home}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <HomeOutlined />
          <span className={styles.label}>Главная</span>
        </NavLink>

        <NavLink
          to={routes.catalog}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <UnorderedListOutlined />
          <span className={styles.label}>Каталог</span>
        </NavLink>

        <NavLink
          to={routes.cart} // Предположим, что роут корзины такой
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <CartIcon />
          <span className={styles.label}>Корзина</span>
        </NavLink>

        <NavLink
          to={routes.profile} // Предположим, что роут профиля такой
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <UserAvatar mobile />
          <span className={styles.label}>Профиль</span>
        </NavLink>
      </nav>
    </Activity>
  )
}
