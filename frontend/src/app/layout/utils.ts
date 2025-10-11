import { routes } from '../constants'

export const showSearch = (route: string) => {
  switch (route) {
    case routes.home:
      return true
    case routes.catalog:
      return true
    default:
      return false
  }
}
