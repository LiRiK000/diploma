import { Input } from 'antd'
import styles from './Search.module.scss'

export const Search = () => {
  const handleSearch = (value: string) => {
    console.log(value)
  }

  return (
    <Input.Search
      placeholder="Введите название книги..."
      allowClear
      enterButton="Найти"
      onSearch={handleSearch}
      className={styles.search}
    />
  )
}
