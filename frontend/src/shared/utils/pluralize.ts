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
