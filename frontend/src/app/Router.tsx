import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { routes } from './constants'
import { MainLayout } from '../app/layout/index'

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path={routes.home} element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
