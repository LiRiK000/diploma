import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QUERY_CLIENT_CONFIG } from './constants'

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    ...QUERY_CLIENT_CONFIG,
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
