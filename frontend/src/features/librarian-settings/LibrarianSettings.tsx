import {
  EditOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Tooltip } from 'antd'
import { useLibrarianSettingsStore } from './model/store'
import { useShallow } from 'zustand/react/shallow'

export const LibrarianSettings = () => {
  const currentLibrarianAtPage = localStorage.getItem('librarianSelectedKey')

  const { isEditing, toggleEditing } = useLibrarianSettingsStore(
    useShallow(store => ({
      isEditing: store.isEditing,
      toggleEditing: store.toggleEditing,
    })),
  )

  if (currentLibrarianAtPage !== 'dashboard') return null

  return (
    <Tooltip title="Настройки" placement="bottomLeft">
      <Dropdown
        menu={{
          items: [
            {
              key: 'settings',
              label: isEditing
                ? 'Выключить режим редактирования'
                : 'Включить режим редактирования',
              icon: <EditOutlined />,
              onClick: toggleEditing,
            },
            { key: 'logout', label: 'Выйти', icon: <LogoutOutlined /> },
          ],
        }}
        trigger={['click']}
      >
        <Button type="primary" icon={<SettingOutlined />} />
      </Dropdown>
    </Tooltip>
  )
}
