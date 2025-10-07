import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { routes } from './constants'

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
