import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './http'

/**
 * Ilova bo'yicha yagona query klient — login/logout'da tozalanadi, aks holda
 * oldingi hisobning keshlangan ma'lumoti keyingisiga ko'rinib qoladi.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // 4xx — qayta urinish foyda bermaydi (ruxsat yo'q, topilmadi)
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < 1
      },
    },
  },
})
