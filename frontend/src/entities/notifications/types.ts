export enum NotificationType {
  ORDER_STATUS = 'ORDER_STATUS',
  OVERDUE = 'OVERDUE',
  ACHIEVEMENT = 'ACHIEVEMENT',
  NEW_ARRIVAL = 'NEW_ARRIVAL',
  REMINDER = 'REMINDER',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isViewed: boolean
  createdAt: string
  link?: string
  payload?: any
}
