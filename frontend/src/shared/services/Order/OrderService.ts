import { api } from '@shared/api'
import { OrderResponse } from './types'

// Интерфейс для статистики
export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  popularBooks: Array<{
    bookId: string
    _sum: { quantity: number }
  }>
}

export class OrderService {
  /**
   * Создание заказа из корзины (User)
   */
  async checkout(): Promise<OrderResponse> {
    const { data } = await api.post<OrderResponse>('/orders/checkout')
    return data
  }

  /**
   * Получение всех заказов в системе (Librarian)
   * Добавили этот метод для админки
   */
  async getAllOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get<OrderResponse[]>('/orders/all')
    return data
  }

  /**
   * Одобрение заказа (Librarian)
   */
  async approveOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch<OrderResponse>(
      `/orders/${orderId}/approve`,
    )
    return data
  }

  /**
   * Отклонение/Отмена заказа (Librarian/User)
   * Используем роут /reject, который мы добавили на бэкенд
   */
  async rejectOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch<OrderResponse>(`/orders/${orderId}/reject`)
    return data
  }

  /**
   * Проверка 8-значного кода при выдаче (Librarian)
   */
  async verifyCode(pickupCode: string): Promise<OrderResponse> {
    const { data } = await api.post<OrderResponse>('/orders/verify-code', {
      pickupCode,
    })
    return data
  }

  /**
   * Подтверждение получения книг пользователем (User)
   */
  async confirmReceipt(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch<OrderResponse>(
      `/orders/${orderId}/confirm-receipt`,
    )
    return data
  }

  /**
   * Получение статистики для виджетов (Librarian)
   */
  async getStats(): Promise<OrderStats> {
    const { data } = await api.get<OrderStats>('/orders/stats')
    return data
  }

  /**
   * Получение списка заказов текущего пользователя (User)
   */
  async getMyOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get<OrderResponse[]>('/orders/my-orders')
    return data
  }

  /**
   * Получение конкретного заказа по ID
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const { data } = await api.get<OrderResponse>(`/orders/${orderId}`)
    return data
  }

  async cancelOrder(id: string): Promise<OrderResponse> {
    const { data } = await api.patch<OrderResponse>(`/orders/${id}/cancel`)
    return data
  }
  async verifyPickupCode(pickupCode: string): Promise<OrderResponse> {
    const { data } = await api.post<OrderResponse>('/orders/verify-code', {
      pickupCode,
    })
    return data
  }
  async returnOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch<OrderResponse>(`/orders/${orderId}/return`)
    return data
  }
}

export const orderService = new OrderService()
