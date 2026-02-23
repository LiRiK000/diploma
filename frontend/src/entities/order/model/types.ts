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
