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
