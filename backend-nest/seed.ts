import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, AchievementCategory } from '@prisma/client';
const pool = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: pool,
});

async function main() {
  const achievementsData = [
    {
      title: 'Первые шаги',
      description: 'Верните свою первую книгу в библиотеку',
      icon: '📚',
      category: AchievementCategory.READING,
      targetValue: 1,
      rewardExp: 100,
    },
    {
      title: 'Книжный червь',
      description: 'Прочитайте 10 книг',
      icon: '🐛',
      category: AchievementCategory.READING,
      targetValue: 10,
      rewardExp: 500,
    },
    {
      title: 'Библиофил',
      description: 'Прочитайте 50 книг',
      icon: '🏰',
      category: AchievementCategory.READING,
      targetValue: 50,
      rewardExp: 2000,
    },
    {
      title: 'Легендарный чтец',
      description: 'Прочитайте 100 книг',
      icon: '👑',
      category: AchievementCategory.READING,
      targetValue: 100,
      rewardExp: 5000,
    },

    // --- КАТЕГОРИЯ: СОЦИАЛЬНЫЕ (SOCIAL) ---
    {
      title: 'Критический взгляд',
      description: 'Оставьте свой первый отзыв на книгу',
      icon: '✍️',
      category: AchievementCategory.SOCIAL,
      targetValue: 1,
      rewardExp: 150,
    },
    {
      title: 'Лидер мнений',
      description: 'Напишите 10 содержательных отзывов',
      icon: '🔥',
      category: AchievementCategory.SOCIAL,
      targetValue: 10,
      rewardExp: 750,
    },
    {
      title: 'Преданный фанат',
      description: 'Подпишитесь на 5 авторов',
      icon: '❤️',
      category: AchievementCategory.SOCIAL,
      targetValue: 5,
      rewardExp: 300,
    },

    // --- КАТЕГОРИЯ: СИСТЕМНЫЕ (SYSTEM) ---
    {
      title: 'Персональный подход',
      description: 'Полностью заполните информацию в своем профиле',
      icon: '👤',
      category: AchievementCategory.SYSTEM,
      targetValue: 1,
      rewardExp: 200,
    },
    {
      title: 'Постоянный клиент',
      description: 'Сделайте 5 заказов в библиотеке',
      icon: '🎫',
      category: AchievementCategory.SYSTEM,
      targetValue: 5,
      rewardExp: 400,
    },
  ];

  for (const ach of achievementsData) {
    const existing = await prisma.achievement.findFirst({
      where: { title: ach.title },
    });

    if (!existing) {
      await prisma.achievement.create({
        data: ach,
      });
    } else {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: ach,
      });
    }
  }
  // Genres
  const genresData = [
    { label: 'Science Fiction', value: 'sci-fi' },
    { label: 'Fantasy', value: 'fantasy' },
    { label: 'Mystery', value: 'mystery' },
    { label: 'Non‑fiction', value: 'non-fiction' },
    { label: 'Classic', value: 'classic' },
    { label: 'Russian Classic', value: 'russian-classic' },
    { label: 'Children', value: 'children' },
    { label: 'Programming', value: 'programming' },
  ];

  const genres = await Promise.all(
    genresData.map((genre) =>
      prisma.genre.upsert({
        where: { value: genre.value },
        update: {},
        create: genre,
      }),
    ),
  );

  const genresByValue = new Map(genres.map((g) => [g.value, g]));

  // Authors
  const authorsData = [
    {
      firstName: 'Isaac',
      lastName: 'Asimov',
      dateOfBirth: new Date('1920-01-02'),
    },
    {
      firstName: 'J. R. R.',
      lastName: 'Tolkien',
      dateOfBirth: new Date('1892-01-03'),
    },
    {
      firstName: 'Agatha',
      lastName: 'Christie',
      dateOfBirth: new Date('1890-09-15'),
    },
    {
      firstName: 'George',
      lastName: 'Orwell',
      dateOfBirth: new Date('1903-06-25'),
    },
    {
      firstName: 'Stephen',
      lastName: 'Hawking',
      dateOfBirth: new Date('1942-01-08'),
    },
    {
      firstName: 'Александр',
      lastName: 'Пушкин',
      dateOfBirth: new Date('1799-06-06'),
    },
    {
      firstName: 'Фёдор',
      lastName: 'Достоевский',
      dateOfBirth: new Date('1821-11-11'),
    },
    {
      firstName: 'Лев',
      lastName: 'Толстой',
      dateOfBirth: new Date('1828-09-09'),
    },
    {
      firstName: 'Джон',
      lastName: 'Толкин',
      dateOfBirth: new Date('1892-01-03'),
    },
    {
      firstName: 'Donald',
      lastName: 'Knuth',
      dateOfBirth: new Date('1938-01-10'),
    },
    {
      firstName: 'Robert',
      lastName: 'Martin',
      dateOfBirth: new Date('1952-12-05'),
    },
    {
      firstName: 'Martin',
      lastName: 'Fowler',
      dateOfBirth: new Date('1963-12-18'),
    },
    {
      firstName: 'Kent',
      lastName: 'Beck',
      dateOfBirth: new Date('1961-03-31'),
    },
    {
      firstName: 'Eric',
      lastName: 'Evans',
      dateOfBirth: new Date('1965-01-01'),
    },
  ];

  const authors = await Promise.all(
    authorsData.map((author) =>
      prisma.author.upsert({
        where: {
          firstName_lastName_dateOfBirth: {
            firstName: author.firstName,
            lastName: author.lastName,
            dateOfBirth: author.dateOfBirth,
          },
        },
        update: {},
        create: author,
      }),
    ),
  );

  const authorByName = new Map(
    authors.map((a) => [`${a.firstName} ${a.lastName}`, a]),
  );

  // Books
  const booksData = [
    {
      title: 'Foundation',
      authorKey: 'Isaac Asimov',
      genreValue: 'sci-fi',
      description:
        'Epic science fiction novel about the fall and rebirth of a galactic empire.',
      subjects: ['galactic empire', 'psychohistory'],
      publisher: 'Gnome Press',
      publishedDate: new Date('1951-06-01'),
      pageCount: 255,
      language: 'en',
      availableQuantity: 5,
    },
    {
      title: 'The Lord of the Rings',
      authorKey: 'J. R. R. Tolkien',
      genreValue: 'fantasy',
      description: 'Classic high fantasy trilogy set in Middle‑earth.',
      subjects: ['middle-earth', 'one ring', 'fellowship'],
      publisher: 'Allen & Unwin',
      publishedDate: new Date('1954-07-29'),
      pageCount: 1178,
      language: 'en',
      availableQuantity: 3,
    },
    {
      title: 'Murder on the Orient Express',
      authorKey: 'Agatha Christie',
      genreValue: 'mystery',
      description:
        'Detective Hercule Poirot investigates a murder on a famous train.',
      subjects: ['detective', 'train', 'poirot'],
      publisher: 'Collins Crime Club',
      publishedDate: new Date('1934-01-01'),
      pageCount: 256,
      language: 'en',
      availableQuantity: 4,
    },
    {
      title: '1984',
      authorKey: 'George Orwell',
      genreValue: 'classic',
      description: 'Dystopian novel about totalitarianism and surveillance.',
      subjects: ['dystopia', 'totalitarianism', 'surveillance'],
      publisher: 'Secker & Warburg',
      publishedDate: new Date('1949-06-08'),
      pageCount: 328,
      language: 'en',
      availableQuantity: 6,
    },
    {
      title: 'A Brief History of Time',
      authorKey: 'Stephen Hawking',
      genreValue: 'non-fiction',
      description:
        'Popular‑science book on cosmology, black holes, and the Big Bang.',
      subjects: ['cosmology', 'black holes', 'physics'],
      publisher: 'Bantam Books',
      publishedDate: new Date('1988-03-01'),
      pageCount: 256,
      language: 'en',
      availableQuantity: 2,
    },
    {
      title: 'Руслан и Людмила',
      authorKey: 'Александр Пушкин',
      genreValue: 'russian-classic',
      description:
        'Поэма-­сказка, один из ключевых текстов русской литературы XIX века.',
      subjects: ['поэма', 'сказка'],
      publisher: 'Советский писатель',
      publishedDate: new Date('1820-01-01'),
      pageCount: 200,
      language: 'ru',
      availableQuantity: 10,
    },
    {
      title: 'Преступление и наказание',
      authorKey: 'Фёдор Достоевский',
      genreValue: 'russian-classic',
      description: 'Роман о моральном выборе, вине и раскаянии.',
      subjects: ['роман', 'психология'],
      publisher: 'Русское слово',
      publishedDate: new Date('1866-01-01'),
      pageCount: 600,
      language: 'ru',
      availableQuantity: 7,
    },
    {
      title: 'Война и мир',
      authorKey: 'Лев Толстой',
      genreValue: 'russian-classic',
      description:
        'Эпический роман о судьбах людей на фоне Отечественной войны 1812 года.',
      subjects: ['роман', 'история', 'эпос'],
      publisher: 'Русский вестник',
      publishedDate: new Date('1869-01-01'),
      pageCount: 1200,
      language: 'ru',
      availableQuantity: 4,
    },
    {
      title: 'Хоббит, или Туда и обратно',
      authorKey: 'Джон Толкин',
      genreValue: 'children',
      description: 'Повесть о путешествии Бильбо Бэггинса и его приключениях.',
      subjects: ['фэнтези', 'приключения'],
      publisher: 'Allen & Unwin',
      publishedDate: new Date('1937-09-21'),
      pageCount: 310,
      language: 'ru',
      availableQuantity: 8,
    },
    {
      title: 'The Art of Computer Programming',
      authorKey: 'Donald Knuth',
      genreValue: 'programming',
      description:
        'Multi‑volume work covering many kinds of programming algorithms and their analysis.',
      subjects: ['algorithms', 'computer science'],
      publisher: 'Addison‑Wesley',
      publishedDate: new Date('1968-01-01'),
      pageCount: 672,
      language: 'en',
      availableQuantity: 3,
    },
    {
      title: 'Clean Code',
      authorKey: 'Robert Martin',
      genreValue: 'programming',
      description:
        'Handbook of agile software craftsmanship focused on writing clean, maintainable code.',
      subjects: ['clean code', 'best practices'],
      publisher: 'Prentice Hall',
      publishedDate: new Date('2008-08-01'),
      pageCount: 464,
      language: 'en',
      availableQuantity: 5,
    },
    {
      title: 'Refactoring: Improving the Design of Existing Code',
      authorKey: 'Martin Fowler',
      genreValue: 'programming',
      description:
        'Practical guide to refactoring techniques for improving code structure.',
      subjects: ['refactoring', 'design'],
      publisher: 'Addison‑Wesley',
      publishedDate: new Date('1999-07-08'),
      pageCount: 431,
      language: 'en',
      availableQuantity: 4,
    },
    {
      title: 'Test‑Driven Development: By Example',
      authorKey: 'Kent Beck',
      genreValue: 'programming',
      description:
        'Introduction to test‑driven development with step‑by‑step examples.',
      subjects: ['tdd', 'testing'],
      publisher: 'Addison‑Wesley',
      publishedDate: new Date('2002-11-08'),
      pageCount: 220,
      language: 'en',
      availableQuantity: 4,
    },
    {
      title:
        'Domain‑Driven Design: Tackling Complexity in the Heart of Software',
      authorKey: 'Eric Evans',
      genreValue: 'programming',
      description:
        'Foundational book on domain‑driven design and strategic modeling.',
      subjects: ['ddd', 'architecture'],
      publisher: 'Addison‑Wesley',
      publishedDate: new Date('2003-08-30'),
      pageCount: 560,
      language: 'en',
      availableQuantity: 3,
    },
  ];

  for (const book of booksData) {
    const author = authorByName.get(book.authorKey);
    const genre = genresByValue.get(book.genreValue);

    if (!author || !genre) {
      // Skip creating a book if required relations are missing
      // This should not normally happen with the data above
      // but protects from partial seeding runs.
      continue;
    }

    await prisma.book.create({
      data: {
        title: book.title,
        author: {
          connect: { id: author.id },
        },
        genre: {
          connect: { id: genre.id },
        },
        description: book.description,
        subjects: book.subjects,
        publisher: book.publisher,
        publishedDate: book.publishedDate,
        pageCount: book.pageCount,
        language: book.language,
        availableQuantity: book.availableQuantity,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import { PrismaClient, Role } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🚀 Начинаем заполнение базы данных (Seeding)...');

//   // Очистка данных в правильном порядке (сначала те, на кого ссылаются)
//   await prisma.cartItem.deleteMany();
//   await prisma.orderItem.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.book.deleteMany();
//   await prisma.author.deleteMany();
//   await prisma.genre.deleteMany();
//   await prisma.user.deleteMany();

//   console.log('🧹 База очищена.');

//   // 1. Жанры
//   const fantasy = await prisma.genre.create({
//     data: { label: 'Фантастика', value: 'fantasy' },
//   });
//   const classic = await prisma.genre.create({
//     data: { label: 'Классика', value: 'classic' },
//   });

//   // 2. Авторы
//   const pushkin = await prisma.author.create({
//     data: {
//       firstName: 'Александр',
//       lastName: 'Пушкин',
//       dateOfBirth: new Date('1799-06-06'),
//     },
//   });

//   const tolkien = await prisma.author.create({
//     data: {
//       firstName: 'Джон',
//       lastName: 'Толкин',
//       dateOfBirth: new Date('1892-01-03'),
//     },
//   });

//   // 3. Книги
//   await prisma.book.create({
//     data: {
//       title: 'Руслан и Людмила',
//       description: 'Поэма Пушкина',
//       availableQuantity: 10,
//       authorId: pushkin.id,
//       genreId: fantasy.id,
//       language: 'Russian',
//       pageCount: 160,
//     },
//   });

//   await prisma.book.create({
//     data: {
//       title: 'Хоббит',
//       description: 'Туда и обратно',
//       availableQuantity: 15,
//       authorId: tolkien.id,
//       genreId: fantasy.id,
//       language: 'English',
//       pageCount: 310,
//     },
//   });

//   // 4. Тестовый пользователь (Админ/Библиотекарь)
//   await prisma.user.create({
//     data: {
//       email: 'admin@library.com',
//       password: 'password123', // В реальном приложении используй bcrypt!
//       name: 'Admin',
//       surname: 'Main',
//       role: Role.LIBRARIAN,
//     },
//   });

//   console.log('✅ Сидинг завершен успешно!');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Ошибка при заполнении базы:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
