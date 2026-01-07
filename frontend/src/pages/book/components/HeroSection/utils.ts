import { message } from 'antd'

export const handleWantToRead = (title: string) => {
  message.success(`Добавлены "${title}" в прочитать позже`)
}

export const handleWantToCard = (title: string) => {
  message.success(`Добавлено "${title}" в корзину`)
}

export const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    message.success('Скопиравно!')
  } catch {
    message.error('Ошибка копирования')
  }
}
