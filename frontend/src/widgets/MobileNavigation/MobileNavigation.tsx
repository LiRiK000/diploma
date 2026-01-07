import { UserAvatar } from '@entities/user'
import { routes } from '@shared/constants'
import { Link } from 'react-router-dom'
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
        <Link to={routes.home}>
          <HomeOutlined style={{ fontSize: '16px' }} />
        </Link>
        <Link to={routes.catalog}>
          <UnorderedListOutlined style={{ fontSize: '16px' }} />
        </Link>
        <CartIcon />
        <UserAvatar mobile />
      </nav>
    </Activity>
  )
}
