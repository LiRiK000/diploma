import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import { PageProvider } from './providers/PageProvider/PageProvider'
import { QueryProvider } from './providers/QueryProvider/QueryProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import { HomePage } from '@pages/home'
import { RegisterPage } from '@pages/register'
import { LoginPage } from '@pages/login'
import { ProfilePage } from '@pages/profile'
import { routes } from '@shared/constants'

export const Router = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <PageProvider>
                  <HomePage />
                </PageProvider>
              }
            />
            <Route
              path={routes.register}
              element={
                <PageProvider>
                  <RegisterPage />
                </PageProvider>
              }
            />
            <Route
              path={routes.login}
              element={
                <PageProvider>
                  <LoginPage />
                </PageProvider>
              }
            />
          </Route>
          <Route
            path={routes.profile}
            element={
              <AuthProvider>
                <ProfilePage />
              </AuthProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}
