import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity } from 'react'
import {
  HomeOutlined,
  UnorderedListOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { UserAvatar } from '@entities/user'
import { routes } from '@shared/constants'
import { CartIcon } from '@entities/cart/components'

import styles from './MobileNavigation.module.scss'
import { isMobile } from './utils'

export const MobileNavigation = () => {
  const isShowMobileNavigation = isMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsMenuOpen(prev => !prev)
  }

  return (
    <Activity mode={isShowMobileNavigation ? 'visible' : 'hidden'}>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

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
          to={routes.cart}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <CartIcon noLink />
          <span className={styles.label}>Корзина</span>
        </NavLink>

        <div
          ref={menuRef}
          className={`${styles.navItemContainer} ${isMenuOpen ? styles.menuActive : ''}`}
        >
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className={styles.profilePopover}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              >
                <NavLink to="/notifications" className={styles.popoverItem}>
                  <BellOutlined className={styles.popoverIcon} />
                  <div className={styles.popoverText}>
                    <span className={styles.popoverTitle}>Уведомления</span>
                    <span className={styles.popoverDesc}>Новые события</span>
                  </div>
                </NavLink>

                <div className={styles.divider} />

                <NavLink to={routes.profile} className={styles.popoverItem}>
                  <UserOutlined className={styles.popoverIcon} />
                  <div className={styles.popoverText}>
                    <span className={styles.popoverTitle}>Мой аккаунт</span>
                    <span className={styles.popoverDesc}>
                      Настройки и заказы
                    </span>
                  </div>
                </NavLink>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleMenu}
            className={`${styles.navItem} ${styles.triggerBtn} ${
              location.pathname === routes.profile ||
              location.pathname === '/notifications'
                ? styles.active
                : ''
            }`}
          >
            <div className={styles.avatarWrapper}>
              <UserAvatar mobile />
            </div>
            <span className={styles.label}>Профиль</span>
          </button>
        </div>
      </nav>
    </Activity>
  )
}
