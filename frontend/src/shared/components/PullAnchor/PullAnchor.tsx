import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import styles from './PullAnchor.module.scss'

export const PullAnchor = () => {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', latest => {
    const next = latest > 400

    setVisible(prev => (prev !== next ? next : prev))
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          className={styles.anchor}
          aria-label="Scroll to top"
          initial={{
            opacity: 0,
            scale: 0.82,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.88,
            y: 14,
          }}
          transition={{
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{
            y: -4,
          }}
          whileTap={{
            scale: 0.94,
          }}
        >
          <ChevronUp size={18} strokeWidth={2.2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
