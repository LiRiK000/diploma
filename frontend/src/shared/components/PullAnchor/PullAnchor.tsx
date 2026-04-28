import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import styles from './PullAnchor.module.scss'

export const PullAnchor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.onChange(latest => {
      setIsVisible(latest > 300)
    })
  }, [scrollY])

  const handlePull = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      className={styles.anchorWrapper}
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -200 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <motion.div
        className={styles.ropeContainer}
        whileHover={{ y: 20 }}
        whileTap={{ y: 50, scaleY: 1.2 }}
        onClick={handlePull}
      >
        <div className={styles.ropeLine} />
        <div className={styles.handle}>
          <div className={styles.ring} />
        </div>
      </motion.div>
    </motion.div>
  )
}
