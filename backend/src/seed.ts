import { prisma } from './prisma.config'
import bcrypt from 'bcrypt'
import { genres, authorsData, booksData, recommendations } from './constants'
import { Book } from './generated/prisma'

async function main() {
  // Жанры
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { value: genre.value },
      update: {},
      create: genre,
    })
  }
  console.log('✅ Genres seeded successfully!')

  // Админ
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

  // Авторы
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
      create: {
        firstName: a.firstName,
        lastName: a.lastName,
        dateOfBirth: a.dateOfBirth,
      },
    })
    authors.push(author)
  }
  console.log('✅ Authors seeded successfully!')

  // Книги
  const books: Book[] = []
  for (const b of booksData) {
    let genre = await prisma.genre.findUnique({
      where: { value: b.genreValue },
    })
    if (!genre) genre = await prisma.genre.findFirst()
    if (!genre) throw new Error(`Жанр для книги "${b.title}" не найден`)

    const book = await prisma.book.create({
      data: {
        title: b.title,
        authorId: authors[b.authorIndex].id,
        genreId: genre.id,
        description: b.description,
        publisher: b.publisher,
        pageCount: b.pageCount,
        language: b.language,
        availableQuantity: b.availableQuantity,
        subjects: b.subjects,
        publishedDate: b.publishedDate,
      },
    })
    books.push(book)
  }
  console.log(`✅ ${books.length} books created`)

  // Рекомендации (connect по id)
  for (let i = 0; i < books.length; i++) {
    const recs = recommendations[i] || []
    if (recs.length === 0) continue
    await prisma.book.update({
      where: { id: books[i].id },
      data: {
        recommendedBooks: {
          connect: recs.map(idx => ({ id: books[idx - 1].id })),
        },
      },
    })
  }
  console.log('✅ Recommendations applied')

  console.log('🎉 Seeding finished!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
