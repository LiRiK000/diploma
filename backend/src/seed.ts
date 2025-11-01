import { Book } from './generated/prisma'
import { prisma } from './lib/prisma'
import bcrypt from 'bcrypt'

const genres = [
  { value: 'novel', label: 'Роман' },
  { value: 'story', label: 'Повесть' },
  { value: 'short_story', label: 'Рассказ' },
  { value: 'detective', label: 'Детектив' },
  { value: 'fantasy', label: 'Фэнтези' },
  { value: 'sci_fi', label: 'Научная фантастика' },
  { value: 'adventure', label: 'Приключения' },
  { value: 'biography', label: 'Биография' },
  { value: 'autobiography', label: 'Автобиография' },
  { value: 'historical', label: 'Историческая литература' },
  { value: 'poetry', label: 'Поэзия' },
  { value: 'drama', label: 'Драма' },
  { value: 'tragedy', label: 'Трагедия' },
  { value: 'comedy', label: 'Комедия' },
  { value: 'horror', label: 'Ужасы' },
  { value: 'thriller', label: 'Триллер' },
  { value: 'mystery', label: 'Мистика' },
  { value: 'psychological', label: 'Психологический роман' },
  { value: 'romance', label: 'Любовный роман' },
  { value: 'philosophical', label: 'Философская литература' },
  { value: 'essay', label: 'Эссе' },
  { value: 'journalism', label: 'Публицистика' },
  { value: 'documentary', label: 'Документальная проза' },
  { value: 'satire', label: 'Сатира' },
  { value: 'dystopia', label: 'Антиутопия' },
  { value: 'utopia', label: 'Утопия' },
  { value: 'children', label: 'Детская литература' },
  { value: 'folklore', label: 'Фольклор' },
  { value: 'classic', label: 'Классика' },
  { value: 'modern', label: 'Современная проза' },
]

async function main() {
  // Создаем жанры
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { value: genre.value },
      update: {},
      create: genre,
    })
  }
  console.log('✅ Genres seeded successfully!')

  const adminEmail = 'admin@library.com'
  const adminPassword = 'admin'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      surname: 'Librarian',
      role: 'LIBRARIAN',
    },
  })
  console.log('✅ Admin user seeded successfully!')
  console.log(`📧 Email: ${adminEmail}`)
  console.log(`🔑 Password: ${adminPassword}`)
  const authorsData = [
    {
      firstName: 'Лев',
      lastName: 'Толстой',
      dateOfBirth: new Date('1828-09-09'),
    },
    {
      firstName: 'Фёдор',
      lastName: 'Достоевский',
      dateOfBirth: new Date('1821-11-11'),
    },
    {
      firstName: 'Иван',
      lastName: 'Иванов',
      dateOfBirth: new Date('1980-01-01'),
    },
    {
      firstName: 'Иван',
      lastName: 'Иванов',
      dateOfBirth: new Date('1990-05-05'),
    },
  ]

  const authors = []

  for (const a of authorsData) {
    const author = await prisma.author.upsert({
      where: {
        firstName_lastName_dateOfBirth: {
          firstName: a.firstName,
          lastName: a.lastName,
          dateOfBirth: a.dateOfBirth,
        },
      },
      update: {},
      create: a,
    })

    authors.push(author)
  }

  const booksData = [
    {
      title: '1984',
      authorId: authors[0].id,
      genreValue: 'dystopia',
      description: 'Антиутопический роман о тоталитарном будущем.',
      publisher: 'Сэкер энд Уорберг',
      pageCount: 328,
      language: 'ru',
      availableQuantity: 5,
    },
    {
      title: 'Скотный двор',
      authorId: authors[0].id,
      genreValue: 'satire',
      description: 'Сатира на политические режимы в виде басни.',
      publisher: 'Сэкер энд Уорберг',
      pageCount: 150,
      language: 'ru',
      availableQuantity: 4,
    },
    {
      title: 'Убийство в Восточном экспрессе',
      authorId: authors[1].id,
      genreValue: 'detective',
      description: 'Классический детектив с Пуаро.',
      publisher: 'Collins Crime Club',
      pageCount: 256,
      language: 'ru',
      availableQuantity: 6,
    },
    {
      title: 'Десять негритят',
      authorId: authors[1].id,
      genreValue: 'detective',
      description: 'Детективная история о загадочных убийствах.',
      publisher: 'Collins Crime Club',
      pageCount: 240,
      language: 'ru',
      availableQuantity: 3,
    },
    {
      title: 'Основание',
      authorId: authors[2].id,
      genreValue: 'sci_fi',
      description: 'Эпопея о падении Галактической Империи.',
      publisher: 'Gnome Press',
      pageCount: 400,
      language: 'ru',
      availableQuantity: 7,
    },
    {
      title: 'Конец Вечности',
      authorId: authors[2].id,
      genreValue: 'sci_fi',
      description: 'Фантастика о путешествиях во времени.',
      publisher: 'Doubleday',
      pageCount: 270,
      language: 'ru',
      availableQuantity: 5,
    },
    {
      title: 'Хоббит, или Туда и обратно',
      authorId: authors[3].id,
      genreValue: 'fantasy',
      description: 'Приключения Бильбо Бэггинса в Средиземье.',
      publisher: 'Allen & Unwin',
      pageCount: 310,
      language: 'ru',
      availableQuantity: 10,
    },
    {
      title: 'Властелин колец',
      authorId: authors[3].id,
      genreValue: 'fantasy',
      description: 'Эпопея о Кольце Всевластья и борьбе добра и зла.',
      publisher: 'Allen & Unwin',
      pageCount: 1178,
      language: 'ru',
      availableQuantity: 8,
    },
  ]
  const books: Book[] = []
  for (const b of booksData) {
    let genre = await prisma.genre.findUnique({
      where: { value: b.genreValue },
    })
    if (!genre) {
      genre = await prisma.genre.findFirst()
    }

    if (!genre) {
      throw new Error(
        `Жанр для книги "${b.title}" не найден и резервный жанр отсутствует`,
      )
    }

    const book = await prisma.book.create({
      data: {
        title: b.title,
        authorId: b.authorId,
        genreId: genre.id,
        description: b.description,
        publisher: b.publisher,
        pageCount: b.pageCount,
        language: b.language,
        availableQuantity: b.availableQuantity,
      },
    })

    books.push(book)
  }
  const recommendations = [
    [1, 2, 3],
    [3, 4, 5],
    [5, 6, 1],
    [6, 7, 2],
    [7, 8, 4],
    [8, 1, 5],
    [2, 3, 6],
    [4, 5, 7],
  ]

  for (let i = 0; i < books.length; i++) {
    await prisma.book.update({
      where: { id: books[i].id },
      data: {
        recommendedBooks: {
          connect: recommendations[i].map(idx => ({ id: books[idx - 1].id })),
        },
      },
    })
  }

  console.log('Книги и рекомендации добавлены ')
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
