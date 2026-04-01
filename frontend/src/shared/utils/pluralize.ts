/**
 * Универсальная функция для склонения существительных после числительных
 * @param count - число
 * @param forms - массив из трех форм [1, 2, 5] (например: ['книга', 'книги', 'книг'])
 */
export const pluralize = (
  count: number,
  forms: [string, string, string],
): string => {
  const cases = [2, 0, 1, 1, 1, 2]
  const index =
    count % 100 > 4 && count % 100 < 20
      ? 2
      : cases[count % 10 < 5 ? count % 10 : 5]
  return forms[index]
}

export const pluralizeItems = (count: number): string =>
  pluralize(count, ['товар', 'товара', 'товаров'])

export const pluralizeFollowers = (count: number): string =>
  pluralize(count, ['подписчик', 'подписчика', 'подписчиков'])

export const pluralizeReviews = (count: number): string =>
  pluralize(count, ['отзыв', 'отзыва', 'отзывов'])

export const pluralizePieces = (count: number): string =>
  pluralize(count, ['штука', 'штуки', 'штук'])

export const pluralizeBooks = (count: number): string =>
  pluralize(count, ['книга', 'книги', 'книг'])

/**
 * Подсчитывает общее количество единиц товара в корзине
 * @param items - массив элементов корзины
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateTotalItems = (items: any[]): number => {
  return items.reduce((total, item) => total + (item.quantity || 0), 0)
}
