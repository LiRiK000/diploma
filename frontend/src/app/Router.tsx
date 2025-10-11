import { QueryProvider } from './providers/QueryProvider/QueryProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { MainLayout } from './layout/MainLayout'
import { routes } from './constants'
import { RegisterPage } from '@pages/register'
import { LoginPage } from '@pages/login'

export const Router = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={routes.register} element={<RegisterPage />} />
            <Route path={routes.login} element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}
