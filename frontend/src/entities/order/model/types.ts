export interface IOrder {
  id: string
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'READY_TO_PICKUP'
    | 'ON_HAND'
    | 'CANCELLED'
    | 'RETURNED'
  orderDate: string
  user: {
    name: string
    surname: string
  }
  items: {
    id: string
    quantity: number
    book: {
      title: string
    }
  }[]
}

export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'READY_TO_PICKUP'
  | 'ON_HAND'
  | 'OVERDUE'
  | 'RETURNED'
  | 'CANCELLED'

export interface Order {
  id: string
  status: OrderStatus
  pickupCode?: string
  orderDate: string
  dueDate?: string
}
