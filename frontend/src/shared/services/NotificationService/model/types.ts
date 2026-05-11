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
  userId: string
  type: NotificationType
  title: string
  message: string
  payload: any
  link: string | null
  isViewed: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationResponse {
  items: Notification[]
  total: number
  page: number
  lastPage: number
}

export interface QueryNotificationsDto {
  page?: number
  limit?: number
  type?: NotificationType
  isViewed?: boolean
}
