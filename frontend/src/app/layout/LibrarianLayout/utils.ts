export const getPageTitle = (key: string) => {
  switch (key) {
    case 'dashboard':
      return 'Главная'
    case 'orders':
      return 'Открытые заявки'
    case 'users':
      return 'Users'
  }
}
