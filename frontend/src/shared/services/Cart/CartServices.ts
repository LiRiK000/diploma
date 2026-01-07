import { api } from '@shared/api'
// TODO => Убрать Static
export class CartService {
  static async getCart() {
    const response = await api.get('/cart')
    return response.data.data
  }
  static async addToCart(bookId: string, quantity = 1) {
    const response = await api.post('/cart/add', { bookId, quantity })
    return response.data.data
  }

  static async getTotalCart() {
    const response = await api.get('/cart/total')
    return response.data.totalItems ?? 0
  }

  static async removeFromCart(itemId: string) {
    const response = await api.delete(`/cart/item/${itemId}`)
    return response.data.message
  }
}
