import { useLayoutEffect, useRef, useState } from 'react'

export const useGridWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      setWidth(container.clientWidth)
    }

    update()

    const observer = new ResizeObserver(update)

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return {
    containerRef,
    width,
  }
}
