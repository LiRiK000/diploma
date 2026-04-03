export interface OrderItem {
  id: string
  quantity: number
  book?: {
    title: string
    author?: string
    isbn?: string
  }
}

export interface OrderResponse {
  id: string
  status: string
  orderDate: string
  user?: {
    name: string
    surname: string
  }
  items: OrderItem[]
}
