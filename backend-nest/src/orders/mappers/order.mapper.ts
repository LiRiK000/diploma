import { Order, OrderItem, Book, User, Author, Genre } from '@prisma/client';
import { getFullUrl } from 'src/utils/getFullCoverUrl';

type OrderWithRelations = Order & {
  user: User;
  items: (OrderItem & {
    book: Book & {
      author: Author;
      genre: Genre;
    };
  })[];
};

export class OrderMapper {
  static toResponse(order: OrderWithRelations) {
    return {
      id: order.id,
      status: order.status,
      pickupCode: order.pickupCode,

      orderDate: order.orderDate.toISOString(),
      dueDate: order.dueDate.toISOString(),
      returnDate: order.returnDate?.toISOString() ?? null,

      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),

      user: order.user
        ? {
            id: order.user.id,
            name: order.user.name,
            surname: order.user.surname,
            email: order.user.email,
            phone: order.user.phone,
            avatarUrl: getFullUrl(order.user.avatarUrl),
            level: order.user.level,
            experience: order.user.experience,
            isInBlacklist: order.user.isInBlacklist,
          }
        : null,

      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,

        book: {
          id: item.book.id,
          title: item.book.title,
          coverImage: getFullUrl(item.book.coverImage),

          author: {
            id: item.book.author.id,
            name: item.book.author.firstName + ' ' + item.book.author.lastName,
          },

          genre: item.book.genre,
        },
      })),
    };
  }
}
