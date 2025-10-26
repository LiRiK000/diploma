import { LibrarianDashboardTab } from '@widgets/LibrarianDashboardTab'
import { LibrarianOrdersTab } from '@widgets/LibrarianOrdersTab'

export const TabContent = ({ selectedKey }: { selectedKey: string }) => {
  switch (selectedKey) {
    case 'dashboard':
      return <LibrarianDashboardTab />
    case 'orders':
      return <LibrarianOrdersTab />
    default:
      return null
  }
}
