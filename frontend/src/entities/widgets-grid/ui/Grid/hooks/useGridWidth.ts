import { useState, useLayoutEffect, useRef } from 'react'

export const useGridWidth = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Создаем обсервер, который следит за изменением физического размера контейнера сетки
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return

      const { width: contentWidth } = entries[0].contentRect

      // Округляем до целого числа, чтобы избежать микро-багов react-grid-layout с дробными пикселями
      setWidth(Math.floor(contentWidth))
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { containerRef, width }
}
