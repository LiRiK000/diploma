import { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './ChartMeasure.module.scss'

export interface ChartSize {
  width: number
  height: number
}

interface ChartMeasureProps {
  className?: string
  minHeight?: number
  children: (size: ChartSize) => ReactNode
}

export const ChartMeasure = ({
  className,
  minHeight = 120,
  children,
}: ChartMeasureProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<ChartSize>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const measure = () => {
      const rect = node.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)

      setSize(prev =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      )
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const ready = size.width > 0 && size.height > 0

  return (
    <div
      ref={ref}
      className={clsx(styles.root, className)}
      style={{ minHeight }}
    >
      {ready ? children(size) : null}
    </div>
  )
}
