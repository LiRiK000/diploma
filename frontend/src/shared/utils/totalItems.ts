import { CartItemResponse } from '@shared/services/Cart/types'

export const calculateTotalItems = (items: CartItemResponse[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
