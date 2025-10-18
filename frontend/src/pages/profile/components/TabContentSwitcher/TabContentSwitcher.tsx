import { TAB_COMPONENTS } from '../../constants'

interface TabContentSwitcherProps {
  selectedKey: string
}

export const TabContentSwitcher = ({
  selectedKey,
}: TabContentSwitcherProps) => {
  switch (selectedKey) {
    case 'profile':
      return TAB_COMPONENTS.profile
    default:
      return null
  }
}
