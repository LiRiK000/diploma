import classes from './EmptyContent.module.scss'

export const EmptyContent = ({
  message,
}: {
  message: string | React.ReactNode
}) => {
  return <div className={classes['container']}>{message}</div>
}
