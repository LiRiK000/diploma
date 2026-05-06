import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout/MainLayout'
import { LibrarianLayout } from './layout/LibrarianLayout/LibrarianLayout'
import { PageProvider } from './providers/PageProvider/PageProvider'
import { QueryProvider } from './providers/QueryProvider/QueryProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import { HomePage } from '@pages/home'
import { RegisterPage } from '@pages/register'
import { LoginPage } from '@pages/login'
import { routes } from '@shared/constants'
import { Suspense, useEffect } from 'react'
import { NotFound } from '@pages/404'
import { useCookieConsentStore } from '@features/cookie/model/store'
import { useShallow } from 'zustand/react/shallow'
import { PrivacyPage } from '@pages/privacy'
import { CartPage } from '@pages/cart'
import { BookPage } from '@pages/book'
import { AuthorPage } from '@pages/author/AuthorPage'
import { SearchPage } from '@pages/SearchPage/SearchPage'
import { OrderPage } from '@pages/order/OrderPage'
import { OrderList } from '@pages/OrderList/OrderList'
import { CatalogPage } from '@pages/catalog'
import { ProfileLayout } from '@app/layout/ProfileLayout'
import { ProfileInfoPage } from '@pages/profile/ui/ProfileInfoPage'
import { ProfileSettingsPage } from '@pages/profile/ui/ProfileSettingsPage'
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider'
import { AchievementsPage } from '@pages/profile/AchievementsPage'
import { Loader } from '@shared/components/Loader'
import { App as AntApp } from 'antd'
import { OrderDetailsPage } from '@pages/OrderDetailsPage/OrderDetailsPage'
import { LibrarianDashboardTab } from '@widgets/LibrarianDashboardTab'
import { LibrarianOrdersTab } from '@widgets/LibrarianOrdersTab'
import { LibrarianBooksTab } from '@widgets/LibrarianBooksTab'
import { LibrarianAuthorsTab } from '@widgets/LibrarianAuthorsTab'
import { LibrarianRecommendationsTab } from '@widgets/LibrarianRecommendationsTab'
export const Router = () => {
  const init = useCookieConsentStore(useShallow(state => state.init))

  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <AntApp>
            <Suspense fallback={<Loader />}>
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
                    path={routes.order}
                    element={
                      <PageProvider>
                        <OrderPage />
                      </PageProvider>
                    }
                  />
                  <Route
                    path={routes.search}
                    element={
                      <PageProvider>
                        <SearchPage />
                      </PageProvider>
                    }
                  />
                  <Route
                    path={routes.authorPage}
                    element={
                      <PageProvider>
                        <AuthorPage />
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
                  <Route
                    path={routes.catalog}
                    element={
                      <AuthProvider>
                        <PageProvider>
                          <CatalogPage />
                        </PageProvider>
                      </AuthProvider>
                    }
                  />
                  <Route
                    path={routes.orders}
                    element={
                      <AuthProvider>
                        <PageProvider>
                          <OrderList />
                        </PageProvider>
                      </AuthProvider>
                    }
                  />

                  {/* Вложенные роуты профиля */}
                  <Route
                    path={routes.profile}
                    element={
                      <AuthProvider>
                        <PageProvider>
                          <ProfileLayout />
                        </PageProvider>
                      </AuthProvider>
                    }
                  >
                    <Route index element={<ProfileInfoPage />} />
                    <Route
                      path={routes.profileSettings}
                      element={<ProfileSettingsPage />}
                    />
                    <Route
                      path={routes.achievements}
                      element={<AchievementsPage />}
                    />
                    <Route
                      path={routes.secure}
                      element={<div>Безопасность (В разработке)</div>}
                    />
                  </Route>
                </Route>

                <Route
                  path={routes.librarian}
                  element={
                    <AuthProvider>
                      <PageProvider>
                        <LibrarianLayout />
                      </PageProvider>
                    </AuthProvider>
                  }
                >
                  <Route index element={<LibrarianDashboardTab />} />

                  <Route path="orders" element={<LibrarianOrdersTab />} />

                  <Route path="orders/:id" element={<OrderDetailsPage />} />

                  <Route path="books" element={<LibrarianBooksTab />} />

                  <Route path="authors" element={<LibrarianAuthorsTab />} />

                  <Route
                    path="recommendations"
                    element={<LibrarianRecommendationsTab />}
                  />
                </Route>

                <Route path={routes.privacy} element={<PrivacyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AntApp>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  )
}
