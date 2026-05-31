import { api } from '@shared/api'

export class CartService {
  async getCart() {
    const response = await api.get('/cart')
    return response.data.data
  }

  async addToCart(bookId: string, quantity = 1) {
    const response = await api.post('/cart/add', { bookId, quantity })
    return response.data.data
  }

  async getTotalCart(): Promise<number> {
    const response = await api.get('/cart/total')
    return response.data.totalItems ?? 0
  }

  async removeFromCart(itemId: string) {
    const response = await api.delete(`/cart/item/${itemId}`)
    return response.data.message
  }
}
