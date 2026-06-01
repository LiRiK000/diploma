import React, { createContext, useContext, useState, useEffect } from 'react'
import { Joyride, Step, CallbackProps, STATUS } from 'react-joyride'
import { useLocation } from 'react-router-dom'
import { routes } from '@shared/constants'
import { TourContextType, TourProviderProps } from './types'

const TourContext = createContext<TourContextType | undefined>(undefined)

export const TourProvider = ({ children }: TourProviderProps) => {
  const [runTour, setRunTour] = useState(false)
  const [currentSteps, setCurrentSteps] = useState<Step[]>([])
  const location = useLocation()

  const stepsConfig: Record<string, Step[]> = {
    [routes.librarian]: [
      {
        target: '.tour-step-sider-menu',
        content:
          'Это ваше главное меню навигации. Здесь можно переключаться между заявками, каталогом книг и авторами.',
        title: '🧭 Навигация',
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '.tour-step-header-actions',
        content:
          'Здесь находятся быстрые действия: подтверждение выдачи по коду от читателя и оформление возврата книги.',
        title: '⚡ Быстрые операции',
        placement: 'bottom',
        disableBeacon: true,
      },
    ],
    [`${routes.librarian}/orders`]: [
      {
        target: '.tour-step-orders-table',
        content:
          'В этой таблице отображаются все запросы от читателей. Вы можете одобрять, отклонять или переходить в детальный просмотр.',
        title: '📋 Журнал заявок',
        placement: 'top',
        disableBeacon: true,
      },
    ],
    dynamic_order_page: [
      {
        target: '.tour-step-order-info',
        content:
          'Здесь собрана полная информация о запрашиваемых книгах и сроках их хранения.',
        title: '📖 Содержимое заказа',
        placement: 'right',
        disableBeacon: true,
      },
      {
        target: '.tour-step-user-sidebar',
        content:
          'Карточка читателя: история его активности, текущие задолженности и контакты.',
        title: '👤 Профиль читателя',
        placement: 'left',
        disableBeacon: true,
      },
    ],
    [`${routes.librarian}/books`]: [
      {
        target: '.tour-step-add-book-btn',
        content:
          'Используйте эту кнопку для внесения новых поступлений или заполнения карточек книг.',
        title: '🆕 Новое поступление',
        placement: 'bottom',
        disableBeacon: true,
      },
    ],
    [`${routes.librarian}/authors`]: [
      {
        target: '.tour-step-authors-title',
        content:
          'Здесь вы можете актуализировать информацию об авторах, добавлять фотографии и годы жизни.',
        title: '✍️ Справочник авторов',
        placement: 'bottom',
        disableBeacon: true,
      },
    ],
  }

  useEffect(() => {
    setRunTour(false)
    setCurrentSteps([])

    const isOrderDetailsPage = /^\/librarian\/orders\/[^/]+$/.test(
      location.pathname,
    )
    const activeSteps = isOrderDetailsPage
      ? stepsConfig['dynamic_order_page']
      : stepsConfig[location.pathname]

    if (!activeSteps || activeSteps.length === 0) return

    const storageKey = `tour_passed_${location.pathname}`
    const hasPassedTour = localStorage.getItem(storageKey)

    if (!hasPassedTour) {
      setCurrentSteps(activeSteps)

      const checkElement = setInterval(() => {
        const targetSelector = activeSteps[0].target as string
        const element = document.querySelector(targetSelector)

        console.log(
          `[Роут: ${location.pathname}] Проверка элемента ${targetSelector}:`,
          element ? 'НАЙДЕН! 🎉' : 'Ожидание... 🔍',
        )

        if (element) {
          setRunTour(true)
          clearInterval(checkElement)
        }
      }, 600)

      return () => clearInterval(checkElement)
    }
  }, [location.pathname])

  const startTour = () => {
    const isOrderDetailsPage = /^\/librarian\/orders\/[^/]+$/.test(
      location.pathname,
    )
    const activeSteps = isOrderDetailsPage
      ? stepsConfig['dynamic_order_page']
      : stepsConfig[location.pathname]
    if (activeSteps) {
      setCurrentSteps(activeSteps)
      setRunTour(true)
    }
  }

  const stopTour = () => setRunTour(false)

  const handleTourCallback = (data: CallbackProps) => {
    const { status } = data
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem(`tour_passed_${location.pathname}`, 'true')
      setRunTour(false)
    }
  }

  return (
    <TourContext.Provider
      value={{ startTour, stopTour, isTourRunning: runTour }}
    >
      {children}
      <Joyride
        steps={currentSteps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={handleTourCallback}
        disableOverlayClose={true}
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            primaryColor: '#1677ff',
            textColor: '#212529',
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: 'left',
            fontFamily: 'inherit',
            borderRadius: '12px',
          },
          buttonNext: { borderRadius: '6px', fontWeight: 600 },
          buttonBack: { marginRight: '8px', color: '#8c8c8c' },
          buttonSkip: { color: '#8c8c8c' },
        }}
      />
    </TourContext.Provider>
  )
}

export const useTour = () => {
  const context = useContext(TourContext)
  if (!context)
    throw new Error('useTour должен использоваться внутри TourProvider')
  return context
}
