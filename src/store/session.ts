/**
 * Sessiya holati: foydalanuvchi, tanlangan farzand, token.
 *
 * Token `expo-secure-store` da (Keychain / EncryptedSharedPreferences) saqlanadi,
 * qolgan holat `AsyncStorage` da — docs/04-mobile-tz.md § Xavfsizlik.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { api, setAuthToken } from '@/api/http'
import type { Child, ParentUser, SchoolBrief } from '@/api/types'

const TOKEN_KEY = 'farzandim.token'

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: ParentUser
  children: Child[]
  school: SchoolBrief | null
}

interface SessionState {
  user: ParentUser | null
  children: Child[]
  school: SchoolBrief | null
  activeChildId: string | null
  isAuthenticated: boolean
  /** Ilova birinchi marta ochilganda "Boshlash" ekrani ko'rsatiladi */
  onboarded: boolean
  hydrated: boolean

  loginWithPassword: (login: string, password: string) => Promise<void>
  requestOtp: (contact: string) => Promise<void>
  verifyOtp: (contact: string, code: string) => Promise<void>
  logout: () => Promise<void>
  setActiveChild: (childId: string) => void
  completeOnboarding: () => void
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      children: [],
      school: null,
      activeChildId: null,
      isAuthenticated: false,
      onboarded: false,
      hydrated: false,

      loginWithPassword: async (login, password) => {
        const res = await api.post<LoginResponse>('/auth/login', { login, password })
        await SecureStore.setItemAsync(TOKEN_KEY, res.accessToken)
        setAuthToken(res.accessToken)
        set({
          user: res.user,
          children: res.children,
          school: res.school,
          activeChildId: res.children[0]?.id ?? null,
          isAuthenticated: true,
        })
      },

      requestOtp: async (contact) => {
        await api.post('/auth/login/otp/request', { contact })
      },

      verifyOtp: async (contact, code) => {
        const res = await api.post<LoginResponse>('/auth/login/otp/verify', { contact, code })
        await SecureStore.setItemAsync(TOKEN_KEY, res.accessToken)
        setAuthToken(res.accessToken)
        set({
          user: res.user,
          children: res.children,
          school: res.school,
          activeChildId: res.children[0]?.id ?? null,
          isAuthenticated: true,
        })
      },

      logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined)
        setAuthToken(null)
        set({
          user: null,
          children: [],
          school: null,
          activeChildId: null,
          isAuthenticated: false,
        })
      },

      setActiveChild: (childId) => set({ activeChildId: childId }),
      completeOnboarding: () => set({ onboarded: true }),
    }),
    {
      name: 'farzandim.session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        children: s.children,
        school: s.school,
        activeChildId: s.activeChildId,
        isAuthenticated: s.isAuthenticated,
        onboarded: s.onboarded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrated === false && useSession.setState({ hydrated: true })
        useSession.setState({ hydrated: true })
      },
    },
  ),
)

/** Joriy tanlangan farzand — ekranlarda eng ko'p kerak bo'ladigan ma'lumot */
export function useActiveChild() {
  return useSession((s) => s.children.find((c) => c.id === s.activeChildId) ?? s.children[0] ?? null)
}

/** Maktabga bog'lanmagan mustaqil foydalanuvchi — faqat AI bo'limlari ochiq */
export function useIsStandalone() {
  return useSession((s) => s.isAuthenticated && !s.user?.schoolId)
}
