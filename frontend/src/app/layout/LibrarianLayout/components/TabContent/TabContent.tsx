import { LibrarianDashboardTab } from '@widgets/LibrarianDashboardTab'
import { LibrarianOrdersTab } from '@widgets/LibrarianOrdersTab'
import { LibrarianBooksTab } from '@widgets/LibrarianBooksTab'
import { LibrarianAuthorsTab } from '@widgets/LibrarianAuthorsTab'

export const TabContent = ({ selectedKey }: { selectedKey: string }) => {
  switch (selectedKey) {
    case 'dashboard':
      return <LibrarianDashboardTab />
    case 'orders':
      return <LibrarianOrdersTab />
    case 'books':
      return <LibrarianBooksTab />
    case 'authors':
      return <LibrarianAuthorsTab />
    default:
      return null
  }
}
