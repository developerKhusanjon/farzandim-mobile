import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './http'

/** Umumiy query klient (login/logout'da tozalanadi) */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // 4xx'da qayta urinilmaydi
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < 1
      },
    },
  },
})
