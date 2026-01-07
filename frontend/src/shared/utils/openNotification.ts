import { notification } from 'antd'

export const openNotification = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info',
) => {
  notification[type]({
    message,
  })
}
