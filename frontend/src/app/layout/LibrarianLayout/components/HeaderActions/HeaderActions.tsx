import { Button, Tooltip, Divider } from 'antd'
import { BookMarked, CheckCircle, RotateCcw } from 'lucide-react'
import { LibrarianSettings } from '@features/librarian-settings'
import { ThemeToggle } from '@features/theme-toggle/ui/ThemeToggle'
import { WidgetBuilderTrigger } from '@features/widget-builder'
import { ResetLayoutButton, GRID_ID } from '@entities/widgets-grid'
import styles from './HeaderActions.module.scss'

interface Props {
  isEditing: boolean
  toggleEditing: () => void
  hasLayoutsChanged: Record<string, boolean>
  onVerifyOpen: () => void
  onReturnOpen: () => void
  setWidgetBuilderOpen: (open: boolean) => void
}

export const HeaderActions = ({
  isEditing,
  toggleEditing,
  hasLayoutsChanged,
  onVerifyOpen,
  onReturnOpen,
  setWidgetBuilderOpen,
}: Props) => {
  return (
    <div className={styles.headerActions}>
      {isEditing ? (
        <>
          <WidgetBuilderTrigger onClick={() => setWidgetBuilderOpen(true)} />
          <Button
            type="primary"
            icon={<CheckCircle size={18} />}
            onClick={toggleEditing}
          />
          {hasLayoutsChanged[GRID_ID] && <ResetLayoutButton fontSize={18} />}
        </>
      ) : (
        <>
          <Tooltip title="Выдать по коду">
            <Button
              type="primary"
              icon={<BookMarked size={18} />}
              onClick={onVerifyOpen}
            />
          </Tooltip>
          <Tooltip title="Принять возврат">
            <Button
              className={styles.returnBtn}
              icon={<RotateCcw size={18} />}
              onClick={onReturnOpen}
            />
          </Tooltip>
          <LibrarianSettings />
        </>
      )}
      <Divider type="vertical" />
      <ThemeToggle />
    </div>
  )
}
