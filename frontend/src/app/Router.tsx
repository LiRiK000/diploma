import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout/MainLayout'
import { LibrarianLayout } from './layout/LibrarianLayout/LibrarianLayout'
import { PageProvider } from './providers/PageProvider/PageProvider'
import { QueryProvider } from './providers/QueryProvider/QueryProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import { HomePage } from '@pages/home'
import { RegisterPage } from '@pages/register'
import { LoginPage } from '@pages/login'
import { ProfilePage } from '@pages/profile'
import { routes } from '@shared/constants'
import { Suspense, useEffect } from 'react'
import { Loader } from '@shared/components/Loader'
import { NotFound } from '@pages/404'
import { useCookieConsentStore } from '@features/cookie/model/store'
import { useShallow } from 'zustand/react/shallow'
import { PrivacyPage } from '@pages/privacy'
import { CartPage } from '@pages/cart'
import { BookPage } from '@pages/book'

export const Router = () => {
  const init = useCookieConsentStore(useShallow(state => state.init))

  useEffect(() => {
    init()
    // Выполняем только при монтировании
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <BrowserRouter>
      <QueryProvider>
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
            <Route
              path={routes.bookPage}
              element={
                <PageProvider>
                  <BookPage />
                </PageProvider>
              }
            />
            <Route
              path={routes.cart}
              element={
                <AuthProvider>
                  <PageProvider>
                    <CartPage />
                  </PageProvider>
                </AuthProvider>
              }
            />
          </Route>
          <Route
            path={routes.profile}
            element={
              <AuthProvider>
                <PageProvider>
                  <ProfilePage />
                </PageProvider>
              </AuthProvider>
            }
          />

          <Route
            path={routes.librarian}
            element={
              <AuthProvider>
                <PageProvider>
                  <LibrarianLayout />
                </PageProvider>
              </AuthProvider>
            }
          />
          <Route path={routes.privacy} element={<PrivacyPage />} />
          <Route path={routes.notFound} element={<NotFound />} />
        </Routes>
      </QueryProvider>
    </BrowserRouter>
  )
}
