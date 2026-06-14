import '@ant-design/v5-patch-for-react-19'
import '@shared/styles/global.scss'
import '@shared/styles/normalize.scss'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout/MainLayout'
import { LibrarianLayout } from './layout/LibrarianLayout/LibrarianLayout'
import { PageProvider } from './providers/PageProvider/PageProvider'
import { QueryProvider } from './providers/QueryProvider/QueryProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import { TourProvider } from './providers/TourProvider'
import { AnalyticsProvider } from './providers/AnalyticsProvider/AnalyticsProvider'
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
import { LibrarianOrdersTab } from '@widgets/LibrarianOrdersTab'
import { LibrarianBooksTab } from '@widgets/LibrarianBooksTab'
import { LibrarianAuthorsTab } from '@widgets/LibrarianAuthorsTab'
import { LibrarianRecommendationsTab } from '@widgets/LibrarianRecommendationsTab'
import { LibrarianUsersTab } from '@widgets/LibrarianUsersTab'
import { NotificationsPage } from '@pages/NotificationsPage/NotificationPage'
import { DashboardPage } from '@pages/dashboard'
import { SecurePage } from '@pages/profile/ui/SecurePage/SecurePage'
import { USER_ROLES } from '@entities/user'
import { PWAProvider } from '@app/providers/PWAProvider'
import { OfflinePage } from '@shared/ui/OfflinePage'
import { useOnlineStatus } from '@shared/hooks'

const OfflineRoutePage = () => {
  const { retry } = useOnlineStatus()
  return <OfflinePage onRetry={retry} />
}

export const Router = () => {
  const init = useCookieConsentStore(useShallow(state => state.init))

  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <PWAProvider>
        <QueryProvider>
          <AnalyticsProvider>
            <ThemeProvider>
              <AntApp>
                <TourProvider>
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
                            <AuthProvider>
                              <PageProvider>
                                <AuthorPage />
                              </PageProvider>
                            </AuthProvider>
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

                        <Route
                          path={routes.notifications}
                          element={
                            <AuthProvider>
                              <PageProvider>
                                <NotificationsPage />
                              </PageProvider>
                            </AuthProvider>
                          }
                        />

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
                            element={<SecurePage />}
                          />
                        </Route>
                      </Route>

                      <Route
                        path={routes.librarian}
                        element={
                          <AuthProvider strictTo={USER_ROLES.LIBRARIAN}>
                            <PageProvider>
                              <LibrarianLayout />
                            </PageProvider>
                          </AuthProvider>
                        }
                      >
                        <Route index element={<DashboardPage />} />
                        <Route path="orders" element={<LibrarianOrdersTab />} />
                        <Route
                          path="orders/:id"
                          element={<OrderDetailsPage />}
                        />
                        <Route path="books" element={<LibrarianBooksTab />} />
                        <Route
                          path="authors"
                          element={<LibrarianAuthorsTab />}
                        />
                        <Route path="users" element={<LibrarianUsersTab />} />
                        <Route
                          path="recommendations"
                          element={<LibrarianRecommendationsTab />}
                        />
                      </Route>
                      <Route path={routes.privacy} element={<PrivacyPage />} />
                      <Route
                        path={routes.offline}
                        element={<OfflineRoutePage />}
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </TourProvider>
              </AntApp>
            </ThemeProvider>
          </AnalyticsProvider>
        </QueryProvider>
      </PWAProvider>
    </BrowserRouter>
  )
}
