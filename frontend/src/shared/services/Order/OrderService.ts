import { api } from '@shared/api'
import { OrderResponse } from './types'

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  popularBooks: Array<{
    bookId: string
    _sum: { quantity: number }
  }>
}
export class OrderService {
  async checkout(): Promise<OrderResponse> {
    const { data } = await api.post('/orders/checkout')
    return data
  }

  async getMyOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get('/orders/my')
    return data
  }

  async getOrderById(orderId: string): Promise<OrderResponse> {
    const { data } = await api.get(`/orders/${orderId}`)
    return data
  }

  async cancelOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch(`/orders/${orderId}/cancel`)
    return data
  }

  async confirmReceipt(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch(`/orders/${orderId}/confirm-receipt`)
    return data
  }
  async getAllOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get('/orders/admin/all')
    return data
  }

  async approveOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch(`/orders/${orderId}/approve`)
    return data
  }

  async rejectOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch(`/orders/${orderId}/reject`)
    return data
  }

  async verifyPickupCode(pickupCode: string): Promise<OrderResponse> {
    const { data } = await api.post('/orders/verify-code', { pickupCode })
    return data
  }

  async returnOrder(orderId: string): Promise<OrderResponse> {
    const { data } = await api.patch(`/orders/${orderId}/return`)
    return data
  }
  async returnOrderByCode(code: string): Promise<OrderResponse> {
    const { data } = await api.post('/orders/return-by-code', { code })
    return data
  }
}
