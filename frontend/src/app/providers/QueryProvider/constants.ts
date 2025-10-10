import type { QueryClientConfig } from '@tanstack/react-query'

export const QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      networkMode: 'online',
    },
  },
} as const
