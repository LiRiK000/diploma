import { LibrarianDashboardTab } from '@widgets/LibrarianDashboardTab'
import { LibrarianOrdersTab } from '@widgets/LibrarianOrdersTab'
import { LibrarianBooksTab } from '@widgets/LibrarianBooksTab'
import { LibrarianAuthorsTab } from '@widgets/LibrarianAuthorsTab'
import { LibrarianRecommendationsTab } from '@widgets/LibrarianRecommendationsTab'

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
    case 'recommendations':
      return <LibrarianRecommendationsTab />
    default:
      return null
  }
}
