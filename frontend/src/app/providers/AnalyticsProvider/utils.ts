import { YANDEX_COUNTER_ID } from './constants'

export const loadYandexMetrika = () => {
  interface YMWindow extends Window {
    ym?: (...args: unknown[]) => void
    ymA?: unknown[][]
    ymL?: number
  }

  const win = window as YMWindow

  if (!win.ym) {
    win.ymA = []
    win.ym = function (...args: unknown[]) {
      if (win.ymA) {
        win.ymA.push(args)
      }
    }
  }
  win.ymL = 1 * new Date().getTime()

  const scripts = document.getElementsByTagName('script')
  for (let j = 0; j < scripts.length; j++) {
    if (scripts[j].src.includes('mc.yandex.ru/metrika/tag.js')) {
      return
    }
  }

  const k = document.createElement('script')
  const a = document.getElementsByTagName('script')[0]
  k.async = true
  k.src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_COUNTER_ID}`
  a.parentNode?.insertBefore(k, a)

  win.ym(YANDEX_COUNTER_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
  })
}
