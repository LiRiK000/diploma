import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, AchievementCategory, Role } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

// ---------------- УТИЛИТЫ ----------------
const logStep = (msg: string) => console.log(`\n📌 ${msg}`);
const logDone = (msg: string) => console.log(`✅ ${msg}`);
const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ---------------- ДАННЫЕ ДЛЯ ЗАПОЛНЕНИЯ ----------------

const genresData = [
  { label: 'Научная фантастика', value: 'sci-fi' },
  { label: 'Фэнтези', value: 'fantasy' },
  { label: 'Детектив', value: 'mystery' },
  { label: 'Классика', value: 'classic' },
  { label: 'Ужасы', value: 'horror' },
  { label: 'Программирование', value: 'programming' },
  { label: 'Антиутопия', value: 'dystopia' },
  { label: 'Романтика', value: 'romance' },
  { label: 'История', value: 'history' },
  { label: 'Психология', value: 'psychology' },
  { label: 'Научно-популярная', value: 'science' },
];

const authorsAndBooksData = [
  // Фэнтези
  {
    firstName: 'Джон Р. Р.',
    lastName: 'Толкин',
    dateOfBirth: new Date('1892-01-03'),
    dateOfDeath: new Date('1973-09-02'),
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/b4/Tolkien_1916.jpg',
    books: [
      {
        title: 'Хоббит, или Туда и обратно',
        genreValue: 'fantasy',
        year: 1937,
        pages: 310,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Классика мирового фэнтези о путешествии Бильбо Бэггинса.',
      },
      {
        title: 'Братство Кольца',
        genreValue: 'fantasy',
        year: 1954,
        pages: 423,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Первая часть великой трилогии "Властелин колец".',
      },
      {
        title: 'Две крепости',
        genreValue: 'fantasy',
        year: 1954,
        pages: 352,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Вторая часть трилогии.',
      },
    ],
  },
  {
    firstName: 'Джоан',
    lastName: 'Роулинг',
    dateOfBirth: new Date('1965-07-31'),
    photoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg',
    books: [
      {
        title: 'Гарри Поттер и философский камень',
        genreValue: 'fantasy',
        year: 1997,
        pages: 432,
        lang: 'ru',
        publisher: 'Махаон',
        description: 'Первая книга о мальчике, который выжил.',
      },
      {
        title: 'Гарри Поттер и Тайная комната',
        genreValue: 'fantasy',
        year: 1998,
        pages: 480,
        lang: 'ru',
        publisher: 'Махаон',
        description: 'Второй год в школе чародейства и волшебства Хогвартс.',
      },
    ],
  },

  // Антиутопия / Фантастика
  {
    firstName: 'Джордж',
    lastName: 'Оруэлл',
    dateOfBirth: new Date('1903-06-25'),
    dateOfDeath: new Date('1950-01-21'),
    books: [
      {
        title: '1984',
        genreValue: 'dystopia',
        year: 1949,
        pages: 328,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Культовая антиутопия о тоталитарном обществе.',
      },
      {
        title: 'Скотный двор',
        genreValue: 'dystopia',
        year: 1945,
        pages: 112,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Сатирическая повесть-притча.',
      },
    ],
  },
  {
    firstName: 'Рэй',
    lastName: 'Брэдбери',
    dateOfBirth: new Date('1920-08-22'),
    dateOfDeath: new Date('2012-06-05'),
    books: [
      {
        title: '451 градус по Фаренгейту',
        genreValue: 'dystopia',
        year: 1953,
        pages: 256,
        lang: 'ru',
        publisher: 'Эксмо',
        description: 'Роман о мире, где книги подлежат сожжению.',
      },
      {
        title: 'Марсианские хроники',
        genreValue: 'sci-fi',
        year: 1950,
        pages: 352,
        lang: 'ru',
        publisher: 'Эксмо',
        description: 'История колонизации Марса землянами.',
      },
    ],
  },
  {
    firstName: 'Айзек',
    lastName: 'Азимов',
    dateOfBirth: new Date('1920-01-02'),
    dateOfDeath: new Date('1992-04-06'),
    books: [
      {
        title: 'Основание',
        genreValue: 'sci-fi',
        year: 1951,
        pages: 320,
        lang: 'ru',
        publisher: 'Эксмо',
        description: 'Первая книга величайшей научно-фантастической саги.',
      },
      {
        title: 'Я, робот',
        genreValue: 'sci-fi',
        year: 1950,
        pages: 280,
        lang: 'ru',
        publisher: 'Эксмо',
        description:
          'Сборник рассказов, сформулировавший Три закона робототехники.',
      },
    ],
  },

  // Программирование
  {
    firstName: 'Роберт',
    lastName: 'Мартин',
    dateOfBirth: new Date('1952-12-05'),
    books: [
      {
        title: 'Чистый код',
        genreValue: 'programming',
        year: 2008,
        pages: 464,
        lang: 'ru',
        publisher: 'Питер',
        description: 'Создание, анализ и рефакторинг программного кода.',
      },
      {
        title: 'Идеальный программист',
        genreValue: 'programming',
        year: 2011,
        pages: 256,
        lang: 'ru',
        publisher: 'Питер',
        description: 'Как стать профессионалом разработки ПО.',
      },
    ],
  },
  {
    firstName: 'Эндрю',
    lastName: 'Хант',
    dateOfBirth: new Date('1964-01-01'),
    books: [
      {
        title: 'Программист-прагматик',
        genreValue: 'programming',
        year: 1999,
        pages: 352,
        lang: 'ru',
        publisher: 'ДМК Пресс',
        description: 'Путь от подмастерья к мастеру.',
      },
    ],
  },

  // Классика
  {
    firstName: 'Фёдор',
    lastName: 'Достоевский',
    dateOfBirth: new Date('1821-11-11'),
    dateOfDeath: new Date('1881-02-09'),
    books: [
      {
        title: 'Преступление и наказание',
        genreValue: 'classic',
        year: 1866,
        pages: 672,
        lang: 'ru',
        publisher: 'Азбука',
        description: 'Социально-психологический и философский роман.',
      },
      {
        title: 'Братья Карамазовы',
        genreValue: 'classic',
        year: 1880,
        pages: 840,
        lang: 'ru',
        publisher: 'Азбука',
        description: 'Последний роман писателя.',
      },
      {
        title: 'Идиот',
        genreValue: 'classic',
        year: 1869,
        pages: 640,
        lang: 'ru',
        publisher: 'Азбука',
        description: 'История князя Мышкина.',
      },
    ],
  },
  {
    firstName: 'Михаил',
    lastName: 'Булгаков',
    dateOfBirth: new Date('1891-05-15'),
    dateOfDeath: new Date('1940-03-10'),
    books: [
      {
        title: 'Мастер и Маргарита',
        genreValue: 'classic',
        year: 1967,
        pages: 528,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Мистический и философский роман.',
      },
      {
        title: 'Собачье сердце',
        genreValue: 'classic',
        year: 1925,
        pages: 320,
        lang: 'ru',
        publisher: 'АСТ',
        description:
          'Сатирическая повесть об эксперименте профессора Преображенского.',
      },
    ],
  },
  {
    firstName: 'Джейн',
    lastName: 'Остин',
    dateOfBirth: new Date('1775-12-16'),
    dateOfDeath: new Date('1817-07-18'),
    books: [
      {
        title: 'Гордость и предубеждение',
        genreValue: 'romance',
        year: 1813,
        pages: 416,
        lang: 'ru',
        publisher: 'Азбука',
        description: 'Один из самых известных романов о любви.',
      },
      {
        title: 'Чувство и чувствительность',
        genreValue: 'romance',
        year: 1811,
        pages: 384,
        lang: 'ru',
        publisher: 'Азбука',
        description: 'История сестер Дэшвуд.',
      },
    ],
  },
  {
    firstName: 'Эрих Мария',
    lastName: 'Ремарк',
    dateOfBirth: new Date('1898-06-22'),
    dateOfDeath: new Date('1970-09-25'),
    books: [
      {
        title: 'На Западном фронте без перемен',
        genreValue: 'history',
        year: 1929,
        pages: 320,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Роман о "потерянном поколении".',
      },
      {
        title: 'Три товарища',
        genreValue: 'classic',
        year: 1936,
        pages: 480,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'История о настоящей дружбе и любви.',
      },
    ],
  },

  // Детективы и Ужасы
  {
    firstName: 'Стивен',
    lastName: 'Кинг',
    dateOfBirth: new Date('1947-09-21'),
    books: [
      {
        title: 'Сияние',
        genreValue: 'horror',
        year: 1977,
        pages: 447,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Отель "Оверлук" ждет своих зимних смотрителей.',
      },
      {
        title: 'Оно',
        genreValue: 'horror',
        year: 1986,
        pages: 1138,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Зло пробуждается в Дерри каждые 27 лет.',
      },
      {
        title: 'Зеленая миля',
        genreValue: 'classic',
        year: 1996,
        pages: 480,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'История Джона Коффи в тюрьме "Холодная гора".',
      },
    ],
  },
  {
    firstName: 'Агата',
    lastName: 'Кристи',
    dateOfBirth: new Date('1890-09-15'),
    dateOfDeath: new Date('1976-01-12'),
    books: [
      {
        title: 'Десять негритят',
        genreValue: 'mystery',
        year: 1939,
        pages: 320,
        lang: 'ru',
        publisher: 'Эксмо',
        description: 'Идеальное убийство на Негритянском острове.',
      },
      {
        title: 'Убийство в "Восточном экспрессе"',
        genreValue: 'mystery',
        year: 1934,
        pages: 352,
        lang: 'ru',
        publisher: 'Эксмо',
        description: 'Эркюль Пуаро расследует убийство в поезде.',
      },
    ],
  },
  {
    firstName: 'Артур Конан',
    lastName: 'Дойл',
    dateOfBirth: new Date('1859-05-22'),
    dateOfDeath: new Date('1930-07-07'),
    books: [
      {
        title: 'Собака Баскервилей',
        genreValue: 'mystery',
        year: 1902,
        pages: 288,
        lang: 'ru',
        publisher: 'Махаон',
        description: 'Одно из самых известных дел Шерлока Холмса.',
      },
      {
        title: 'Этюд в багровых тонах',
        genreValue: 'mystery',
        year: 1887,
        pages: 224,
        lang: 'ru',
        publisher: 'Махаон',
        description: 'Первая повесть о Шерлоке Холмсе.',
      },
    ],
  },

  // Научпоп и Психология
  {
    firstName: 'Юваль Ной',
    lastName: 'Харари',
    dateOfBirth: new Date('1976-02-24'),
    books: [
      {
        title: 'Sapiens. Краткая история человечества',
        genreValue: 'history',
        year: 2011,
        pages: 520,
        lang: 'ru',
        publisher: 'Синдбад',
        description: 'Как Человек разумный покорил мир.',
      },
      {
        title: 'Homo Deus. Краткая история завтрашнего дня',
        genreValue: 'science',
        year: 2015,
        pages: 496,
        lang: 'ru',
        publisher: 'Синдбад',
        description: 'Что ждет человечество в будущем.',
      },
    ],
  },
  {
    firstName: 'Даниэль',
    lastName: 'Канеман',
    dateOfBirth: new Date('1934-03-05'),
    books: [
      {
        title: 'Думай медленно... решай быстро',
        genreValue: 'psychology',
        year: 2011,
        pages: 656,
        lang: 'ru',
        publisher: 'АСТ',
        description: 'Как работает наше мышление.',
      },
    ],
  },
];

const achievementsData = [
  {
    title: 'Книжный червь',
    description: 'Прочитайте 10 книг',
    icon: '🐛',
    category: AchievementCategory.READING,
    targetValue: 10,
    rewardExp: 500,
  },
  {
    title: 'Магистр чтения',
    description: 'Прочитайте 50 книг',
    icon: '📚',
    category: AchievementCategory.READING,
    targetValue: 50,
    rewardExp: 2000,
  },
  {
    title: 'Критик',
    description: 'Напишите 5 отзывов',
    icon: '✍️',
    category: AchievementCategory.SOCIAL,
    targetValue: 5,
    rewardExp: 300,
  },
  {
    title: 'Топ-рецензент',
    description: 'Напишите 20 отзывов',
    icon: '⭐',
    category: AchievementCategory.SOCIAL,
    targetValue: 20,
    rewardExp: 1000,
  },
  {
    title: 'Первые шаги',
    description: 'Зарегистрируйтесь и заполните профиль',
    icon: '👶',
    category: AchievementCategory.SYSTEM,
    targetValue: 1,
    rewardExp: 100,
  },
  {
    title: 'Лояльный читатель',
    description: 'С нами уже 1 год',
    icon: '🎂',
    category: AchievementCategory.SYSTEM,
    targetValue: 1,
    rewardExp: 500,
  },
];

const levelsData = [
  { level: 1, minExp: 0, title: 'Новичок' },
  { level: 2, minExp: 1000, title: 'Читатель' },
  { level: 3, minExp: 3000, title: 'Книголюб' },
  { level: 4, minExp: 10000, title: 'Магистр библиотеки' },
  { level: 5, minExp: 25000, title: 'Хранитель знаний' },
];

const reviewTemplates = [
  'Прекрасная книга!',
  'Прочитал на одном дыхании.',
  'Шедевр своего времени.',
  'Очень рекомендую всем!',
  'Сюжет закручен потрясающе.',
  'Слегка затянуто, но концовка спасает.',
  'Оставило двоякое впечатление, но стоит того.',
  'Одна из лучших книг в этом жанре.',
  'Заставляет задуматься.',
  'Абсолютный маст-рид!',
  'Не мог оторваться всю ночь.',
  'Перечитываю уже во второй раз, открываю новые детали.',
];

// ---------------- ОСНОВНОЙ СКРИПТ ----------------

async function clean() {
  logStep('Очистка базы данных...');

  await prisma.$transaction([
    prisma.userAchievement.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.levelConfig.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.review.deleteMany(),
    prisma.notification.deleteMany(),

    prisma.collection.deleteMany(),
    prisma.book.deleteMany(),
    prisma.author.deleteMany(),
    prisma.genre.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  logDone('База очищена');
}

async function main() {
  console.log('🚀 SEED START');
  await clean();

  // ================= СИСТЕМНЫЕ СПРАВОЧНИКИ =================
  logStep('Заполнение уровней и достижений...');
  await prisma.levelConfig.createMany({ data: levelsData });
  await prisma.achievement.createMany({ data: achievementsData });
  logDone('Справочники готовы');

  // ================= ЖАНРЫ =================
  logStep('Создание жанров...');
  const createdGenres = await Promise.all(
    genresData.map((g) => prisma.genre.create({ data: g })),
  );
  const genreMap: Record<string, string> = {};
  createdGenres.forEach((g) => {
    genreMap[g.value] = g.id;
  });
  logDone(`Жанры готовы (создано: ${createdGenres.length})`);

  // ================= АВТОРЫ И КНИГИ =================
  logStep('Создание авторов и их книг...');
  const allBooks: { id: string; title: string; genreId: string }[] = [];

  for (const authorData of authorsAndBooksData) {
    const { books, ...authorDetails } = authorData;

    const author = await prisma.author.create({
      data: {
        ...authorDetails,
        books: {
          create: books.map((book) => ({
            title: book.title,
            genreId: genreMap[book.genreValue],
            description: book.description,
            publishedDate: new Date(`${book.year}-01-01`),
            pageCount: book.pages,
            language: book.lang,
            publisher: book.publisher,
            availableQuantity: randNum(5, 30),
            coverImage: `https://picsum.photos/seed/${encodeURIComponent(book.title)}/300/450`,
            subjects: [book.genreValue, 'bestseller'],
          })),
        },
      },
      include: { books: true },
    });

    allBooks.push(...author.books);
  }
  logDone(`Авторы и книги созданы (всего книг: ${allBooks.length})`);

  // ================= ПОЛЬЗОВАТЕЛИ =================
  logStep('Создание пользователей...');

  const fakePasswordHash = 'hashed_123456';
  const USERS_COUNT = 50;

  const users: any[] = [];

  for (let i = 0; i < USERS_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        email: i === 0 ? 'admin@library.com' : `user${i}@test.com`,
        password: fakePasswordHash,
        name: i === 0 ? 'Главный' : 'Пользователь',
        surname: i === 0 ? 'Библиотекарь' : `Тестовый ${i}`,
        displayName: i === 0 ? 'Admin' : `Reader_${i}`,
        role: i === 0 ? Role.LIBRARIAN : Role.USER,
        experience: randNum(0, 12000),
        level: randNum(1, 4),
      },
    });

    users.push(user);

    // защита от перегруза
    if (i % 10 === 0) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  logDone(`Создано пользователей: ${USERS_COUNT}`);

  // ================= ПОДБОРКИ =================
  logStep('Формирование коллекций...');
  const popularBooks = [...allBooks]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
  const itBooks = allBooks.filter((b) => b.genreId === genreMap['programming']);
  const classicBooks = allBooks.filter(
    (b) => b.genreId === genreMap['classic'],
  );
  const detectiveBooks = allBooks.filter(
    (b) => b.genreId === genreMap['mystery'],
  );
  const scifiBooks = allBooks.filter(
    (b) =>
      b.genreId === genreMap['sci-fi'] || b.genreId === genreMap['dystopia'],
  );

  const collectionsData = [
    {
      title: '🔥 Популярное в этом месяце',
      slug: 'popular',
      desc: 'Выбор наших читателей',
      books: popularBooks,
    },
    {
      title: '💻 Программирование и IT',
      slug: 'it-books',
      desc: 'Фундаментальная литература',
      books: itBooks,
    },
    {
      title: '🎩 Золотая классика',
      slug: 'classics',
      desc: 'Книги, проверенные временем',
      books: classicBooks,
    },
    {
      title: '🕵️ Мастера детектива',
      slug: 'detectives',
      desc: 'Закрученные сюжеты и загадки',
      books: detectiveBooks,
    },
    {
      title: '🚀 Взгляд в будущее',
      slug: 'sci-fi',
      desc: 'Лучшая научная фантастика и антиутопии',
      books: scifiBooks,
    },
  ];

  for (const col of collectionsData) {
    if (col.books.length > 0) {
      await prisma.collection.create({
        data: {
          title: col.title,
          slug: col.slug,
          description: col.desc,
          books: { connect: col.books.map((b) => ({ id: b.id })) },
        },
      });
    }
  }
  logDone('Тематические подборки сформированы');

  // ================= ОТЗЫВЫ И АКТИВНОСТЬ =================
  logStep('Генерация социальной активности (чтение и отзывы)...');

  // Чтобы не спамить базу слишком сильно, каждый пользователь прочитает от 3 до 8 книг
  // и оставит отзывы на половину из них
  for (const user of users) {
    const readCount = randNum(3, 8);
    const sampleBooks = [...allBooks]
      .sort(() => Math.random() - 0.5)
      .slice(0, readCount);

    // Подключаем прочитанные книги
    await prisma.user.update({
      where: { id: user.id },
      data: {
        readBooks: { connect: sampleBooks.map((b) => ({ id: b.id })) },
      },
    });

    // Оставляем отзывы на случайные книги из прочитанных (примерно 50% шанс оставить отзыв)
    for (const book of sampleBooks) {
      if (Math.random() > 0.5) {
        await prisma.review.create({
          data: {
            userId: user.id,
            bookId: book.id,
            description: rand(reviewTemplates),
          },
        });
      }
    }
  }
  logDone('Прочтения и отзывы сгенерированы');

  logStep('✅ МАСШТАБНЫЙ СИД УСПЕШНО ЗАВЕРШЕН!');
}

main()
  .catch((e) => {
    console.error('❌ ОШИБКА СИДЕРА:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
