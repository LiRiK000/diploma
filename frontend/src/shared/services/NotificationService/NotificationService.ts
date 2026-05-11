import { api } from '@shared/api'
import {
  Notification,
  NotificationResponse,
  QueryNotificationsDto,
} from './model/types'

export class NotificationService {
  /**
   * Получение списка уведомлений с курсорной пагинацией
   */
  async findMine(query?: QueryNotificationsDto): Promise<NotificationResponse> {
    const response = await api.get<NotificationResponse>('/notifications', {
      params: query,
    })
    return response.data
  }

  /**
   * Получить объект с количеством непрочитанных
   */
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>(
      '/notifications/unread-count',
    )
    return response.data
  }

  /**
   * Отметить все как прочитанные
   */
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all')
  }

  /**
   * Отметить одно уведомление
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch<Notification>(`/notifications/${id}/read`)
    return response.data
  }

  /**
   * Удалить уведомление
   */
  async remove(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`)
  }
}

export const notificationService = new NotificationService()
