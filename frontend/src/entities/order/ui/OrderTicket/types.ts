export interface OrderTicketProps {
  code: string
  label: string
  message: string
  type: 'info' | 'warning' | 'error'
  variant?: 'primary' | 'return'
}
