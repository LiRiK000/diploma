export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  currentValue: number
  targetValue: number
  isCompleted: boolean
  rewardExp: number
  category: 'reading' | 'social' | 'system'
}

export const ACHIEVEMENTS_MOCK: Achievement[] = [
  {
    id: '1',
    title: 'Первые шаги',
    description: 'Прочитайте свою первую книгу полностью',
    icon: '📖',
    currentValue: 1,
    targetValue: 1,
    isCompleted: true,
    rewardExp: 100,
    category: 'reading',
  },
  {
    id: '2',
    title: 'Книжный червь',
    description: 'Прочитайте 10 книг',
    icon: '🐛',
    currentValue: 4,
    targetValue: 10,
    isCompleted: false,
    rewardExp: 500,
    category: 'reading',
  },
  {
    id: '3',
    title: 'Критик',
    description: 'Оставьте 5 отзывов на книги',
    icon: '✍️',
    currentValue: 2,
    targetValue: 5,
    isCompleted: false,
    rewardExp: 250,
    category: 'social',
  },
  {
    id: '4',
    title: 'Старожил',
    description: 'Заходите в приложение 7 дней подряд',
    icon: '🔥',
    currentValue: 7,
    targetValue: 7,
    isCompleted: true,
    rewardExp: 300,
    category: 'system',
  },
]
