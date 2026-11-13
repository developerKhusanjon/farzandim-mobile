import { useEffect } from 'react'
import { View } from 'react-native'
import { Stack, SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts as usePoppins,
} from '@expo-google-fonts/poppins'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInter,
} from '@expo-google-fonts/inter'
import { colors } from '@/theme'
import { useSession } from '@/store/session'
import { queryClient } from '@/api/query-client'

void SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [poppinsLoaded] = usePoppins({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  const hydrated = useSession((s) => s.hydrated)
  const isAuthenticated = useSession((s) => s.isAuthenticated)

  const ready = poppinsLoaded && interLoaded && hydrated

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync()
  }, [ready])

  // Shriftlar va saqlangan sessiya yuklanmaguncha hech narsa chizilmaydi —
  // aks holda matnlar tizim shriftida "sakrab" ko'rinadi.
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="subject/[id]" />
              <Stack.Screen name="homework/[id]" />
              <Stack.Screen name="lesson/[id]" />
              <Stack.Screen name="character" />
              <Stack.Screen name="interests" />
              <Stack.Screen name="recommendations" />
              <Stack.Screen name="ai" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="school/index" />
              <Stack.Screen name="school/teachers" />
              <Stack.Screen name="school/schedule" />
            </Stack.Protected>
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
