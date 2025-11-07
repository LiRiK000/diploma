import { Search } from '@features/search'
import { BookFeed } from '@widgets/BookFeed/BookFeed'

export const HomePage = () => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <Search />
      </div>
      <BookFeed />
    </>
  )
}
