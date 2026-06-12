import { useMemo, useState } from 'react'
import { Button, Input, Space, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Search } from 'lucide-react'
import dayjs from 'dayjs'
import type { ManagedUser } from '@shared/services/UsersAdmin'
import { USER_ROLES_LABELS } from '@entities/user/constants'
import { getUserBlockInfo } from '@shared/utils/userBlockStatus'
import {
  useManagedUsers,
  useUserModerationActions,
} from '@features/manage-users/hooks/use-managed-users'
import { BlockUserModal } from '@features/manage-users/ui/BlockUserModal'
import classes from './LibrarianUsersTab.module.scss'

const getStatusTag = (user: ManagedUser) => {
  const blockInfo = getUserBlockInfo(user)

  if (blockInfo.type === 'blacklist') {
    return <Tag color="red">В ЧС</Tag>
  }

  if (blockInfo.type === 'suspended' && blockInfo.until) {
    return (
      <Tag color="orange">
        Заморожен до {dayjs(blockInfo.until).format('DD.MM.YYYY')}
      </Tag>
    )
  }

  return <Tag color="green">Активен</Tag>
}

export const LibrarianUsersTab = () => {
  const { data: users = [], isLoading, isFetching } = useManagedUsers()
  const { unblock } = useUserModerationActions()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase().trim()

    return users.filter(user => {
      const fullName = `${user.surname} ${user.name}`.toLowerCase()
      return (
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [users, searchQuery])

  const handleUnblock = async (user: ManagedUser) => {
    try {
      await unblock.mutateAsync(user.id)
      message.success('Пользователь разблокирован')
    } catch {
      message.error('Не удалось разблокировать пользователя')
    }
  }

  const columns: ColumnsType<ManagedUser> = useMemo(
    () => [
      {
        title: 'ФИО',
        key: 'fullName',
        render: (_, record) => `${record.surname} ${record.name}`,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        render: (role: ManagedUser['role']) => USER_ROLES_LABELS[role] ?? role,
      },
      {
        title: 'Статус',
        key: 'status',
        render: (_, record) => getStatusTag(record),
      },
      {
        title: 'Действия',
        key: 'actions',
        render: (_, record) => {
          const blockInfo = getUserBlockInfo(record)

          return (
            <Space wrap>
              <Button
                danger
                size="small"
                onClick={() => {
                  setSelectedUser(record)
                  setIsBlockModalOpen(true)
                }}
              >
                Заблокировать
              </Button>
              <Button
                size="small"
                disabled={!blockInfo.isBlocked}
                loading={unblock.isPending}
                onClick={() => void handleUnblock(record)}
              >
                Разблокировать
              </Button>
            </Space>
          )
        },
      },
    ],
    [unblock.isPending],
  )

  return (
    <>
      <div className={classes.tableHeader}>
        <Space direction="vertical" size={2}>
          <Typography.Title level={4} className={classes.tabTitle}>
            Управление пользователями
          </Typography.Title>
          <span className={classes.tabSubtitle}>
            Блокировка, временная заморозка и разблокировка читателей
          </span>
        </Space>

        <div className={classes.searchWrapper}>
          <Input
            placeholder="Поиск по ФИО или email..."
            allowClear
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            prefix={
              <Search
                size={16}
                style={{ color: 'var(--text-secondary)', marginRight: 4 }}
              />
            }
            className={classes.customSearchInput}
          />
        </div>
      </div>

      <div className={classes.tableWrapper}>
        <Table<ManagedUser>
          loading={isLoading || isFetching}
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          className={classes.customTable}
        />
      </div>

      <BlockUserModal
        user={selectedUser}
        open={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false)
          setSelectedUser(null)
        }}
      />
    </>
  )
}
