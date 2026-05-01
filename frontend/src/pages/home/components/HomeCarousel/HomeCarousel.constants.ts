import { Sparkles, BookOpen, Terminal } from 'lucide-react'

export const SLIDES = [
  {
    id: 1,
    title: 'Мир фэнтези ждет вас',
    desc: 'Лучшие новинки этого месяца со скидкой до 20%',
    buttonText: 'Смотреть подборку',
    color: '#6366f1',
    type: 'fantasy',
    Icon: Sparkles,
  },
  {
    id: 2,
    title: 'Русская классика',
    desc: 'Глубина души и вечные смыслы в новом формате',
    buttonText: 'Читать классику',
    color: '#92400e',
    type: 'classic',
    Icon: BookOpen,
  },
  {
    id: 3,
    title: 'Code & Science',
    desc: 'Освойте современные технологии и алгоритмы',
    buttonText: 'В мир IT',
    color: '#06b6d4',
    type: 'tech',
    Icon: Terminal,
  },
]
