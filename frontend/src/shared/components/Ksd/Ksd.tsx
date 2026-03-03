import styles from './Ksd.module.scss'

interface KsdProps {
  className?: string
}

export const Ksd = ({ className }: KsdProps) => {
  return <div className={`${styles.wrapper} ${className ?? ''}`}>Ksd</div>
}
