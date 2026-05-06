import { SettingOutlined } from '@ant-design/icons' // Оставляем классику Ant
import { LayoutGrid, LogOut } from 'lucide-react'
import { Button, Dropdown, Tooltip } from 'antd'
import { useLibrarianSettingsStore } from './model/store'
import { useShallow } from 'zustand/react/shallow'

export const LibrarianSettings = () => {
  const { isEditing, toggleEditing } = useLibrarianSettingsStore(
    useShallow(store => ({
      isEditing: store.isEditing,
      toggleEditing: store.toggleEditing,
    })),
  )

  const items = [
    {
      key: 'edit-mode',
      label: isEditing ? 'Выключить конструктор' : 'Режим редактирования',
      icon: <LayoutGrid size={16} strokeWidth={2} />,
      onClick: toggleEditing,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Выйти из системы',
      icon: <LogOut size={16} strokeWidth={2} />,
      danger: true,
    },
  ]

  return (
    <Tooltip title="Настройки интерфейса" placement="bottom">
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <Button
          type="text"
          icon={<SettingOutlined style={{ fontSize: '15px' }} />}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </Dropdown>
    </Tooltip>
  )
}
