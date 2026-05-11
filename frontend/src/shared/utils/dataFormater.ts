import dayjs from 'dayjs'

import 'dayjs/locale/ru'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(calendar)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.locale('ru')

dayjs.updateLocale('ru', {
  calendar: {
    lastDay: '[Вчера в] HH:mm',
    sameDay: '[Сегодня в] HH:mm',
    lastWeek: 'D MMMM [в] HH:mm',
    sameElse: 'D MMMM YYYY',
  },
})

/**
 * Утилита для "умного" форматирования даты уведомлений
 * @param dateString - ISO дата с бэкенда
 */
export const formatNotificationDate = (dateString: string | Date): string => {
  const date = dayjs(dateString)
  const now = dayjs()

  if (now.diff(date, 'hour') < 1) {
    return date.fromNow()
  }

  return date.calendar()
}

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('MMMM D, YYYY')
}
