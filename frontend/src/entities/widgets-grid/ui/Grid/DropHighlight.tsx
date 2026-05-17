import { FC, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Layout } from 'react-grid-layout'
import { layoutCellToPixels, GridMetrics } from '../../lib/gridGeometry'
import classes from './DropHighlight.module.scss'

interface DropHighlightProps {
  hint: Pick<Layout, 'x' | 'y' | 'w' | 'h'> | null
  metrics: GridMetrics
}

const spring = { type: 'spring' as const, stiffness: 520, damping: 44, mass: 0.75 }

export const DropHighlight: FC<DropHighlightProps> = ({ hint, metrics }) => {
  const rect = useMemo(
    () => (hint && metrics.width > 0 ? layoutCellToPixels(hint, metrics) : null),
    [hint, metrics],
  )

  if (!rect) return null

  return (
    <motion.div
      className={classes.root}
      initial={false}
      animate={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        opacity: 1,
      }}
      transition={spring}
    >
      <motion.span
        className={classes.label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.02 }}
      >
        Сюда
      </motion.span>
    </motion.div>
  )
}
