import s from './BookLoader.module.scss'

export const BookLoader = () => {
  return (
    <div className={s.loader}>
      <div className={s.book}>
        <div className={s.inner}>
          <div className={s.left}></div>
          <div className={s.middle}></div>
          <div className={s.right}></div>
        </div>
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  )
}
