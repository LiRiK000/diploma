import { UserAvatar } from '@entities/user'
import { routes } from '@shared/constants'
import { Link } from 'react-router-dom'
import styles from './MobileNavigation.module.scss'
import { isMobile } from './utils'
import { Activity } from 'react'

export const MobileNavigation = () => {
  const isShowMobileNavigation = isMobile()

  return (
    <Activity mode={isShowMobileNavigation ? 'visible' : 'hidden'}>
      <nav className={styles.mobileNav}>
        <Link to={routes.home}>Главная</Link>
        <Link to={routes.catalog}>Каталог</Link>
        <Link to={routes.cart}>Корзина</Link>
        <UserAvatar mobile />
      </nav>
    </Activity>
  )
}
