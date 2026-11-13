/**
 * Sessiya: foydalanuvchi, farzandlar, tanlangan farzand.
 * Tokenlar SecureStore'da, qolgani AsyncStorage'da.
 */
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  type AuthTokens,
  api,
  configureAuth,
  currentTokens,
  setTokens,
  tokensFrom,
} from '@/api/http'
import { queryClient } from '@/api/query-client'
import type { Child, Locale, ParentUser, SchoolBrief } from '@/api/types'

/* --------------------------------- Tokenlar -------------------------------- */

// SecureStore kalitlarida faqat harf, raqam, `.`, `-`, `_` bo'lishi mumkin
const ACCESS_KEY = 'farzandim.accessToken'
const REFRESH_KEY = 'farzandim.refreshToken'
const EXPIRES_KEY = 'farzandim.expiresAt'
/** Eski kalit, faqat tozalash uchun */
const LEGACY_TOKEN_KEY = 'farzandim.token'

async function saveTokens(next: AuthTokens | null) {
  if (!next) {
    await Promise.all(
      [ACCESS_KEY, REFRESH_KEY, EXPIRES_KEY, LEGACY_TOKEN_KEY].map((key) =>
        SecureStore.deleteItemAsync(key).catch(() => undefined),
      ),
    )
    return
  }
  await SecureStore.setItemAsync(ACCESS_KEY, next.accessToken)
  await SecureStore.setItemAsync(REFRESH_KEY, next.refreshToken)
  await SecureStore.setItemAsync(EXPIRES_KEY, next.expiresAt ? String(next.expiresAt) : '')
}

async function loadTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken, expiresAt] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
    SecureStore.getItemAsync(EXPIRES_KEY),
  ]).catch(() => [null, null, null] as const)
  if (!accessToken || !refreshToken) return null
  return { accessToken, refreshToken, expiresAt: expiresAt ? Number(expiresAt) : null }
}

/* ------------------------------ Backend javoblari -------------------------- */

/** Backend `AuthUserDto` */
interface AuthUser {
  id: string
  schoolId: string | null
  role: string
  firstName: string
  lastName: string
  avatarUrl?: string | null
  phone?: string | null
  email?: string | null
  locale?: string | null
}

/** `POST /auth/login`, `/auth/login/otp/verify` javobi */
interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn?: number
  user: AuthUser
}

/** `GET /auth/me` */
interface MeResponse {
  user: AuthUser
  /** Maktabga bog'lanmagan mustaqil ota-ona (faqat AI) */
  independent: boolean
  /** Maktab tarifidagi AI imkoniyatlari */
  features?: { ai: boolean; aiChat: boolean }
}

export interface OtpRequestResult {
  sent: boolean
  expiresInSeconds?: number
  /** Faqat dev backend qaytaradi */
  debugCode?: string
}

function toParentUser(user: AuthUser): ParentUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl ?? undefined,
    phone: user.phone ?? undefined,
    email: user.email ?? undefined,
    schoolId: user.schoolId,
    locale: (user.locale ?? 'uz') as Locale,
  }
}

/** Telefon yoki email alohida maydonda yuboriladi */
function contactBody(contact: string) {
  const value = contact.trim()
  return value.includes('@') ? { email: value } : { phone: value }
}

function deviceInfo() {
  return `farzandim-mobile · ${Platform.OS} ${String(Platform.Version)}`
}

/* --------------------------------- Do'kon ---------------------------------- */

interface SessionState {
  user: ParentUser | null
  children: Child[]
  school: SchoolBrief | null
  activeChildId: string | null
  features: { ai: boolean; aiChat: boolean } | null
  isAuthenticated: boolean
  /** Ilova birinchi marta ochilganda "Boshlash" ekrani ko'rsatiladi */
  onboarded: boolean
  hydrated: boolean

  loginWithPassword: (login: string, password: string) => Promise<void>
  requestOtp: (contact: string) => Promise<OtpRequestResult>
  verifyOtp: (contact: string, code: string) => Promise<void>
  /** Profil, farzandlar va maktabni yuklash */
  reloadProfile: () => Promise<void>
  logout: () => Promise<void>
  setActiveChild: (childId: string) => void
  completeOnboarding: () => void
}

const SIGNED_OUT = {
  user: null,
  children: [],
  school: null,
  activeChildId: null,
  features: null,
  isAuthenticated: false,
} satisfies Partial<SessionState>

export const useSession = create<SessionState>()(
  persist(
    (set, get) => {
      /** Lokal sessiyani tozalash */
      const clearLocal = async () => {
        setTokens(null)
        await saveTokens(null)
        queryClient.clear()
        set({ ...SIGNED_OUT })
      }

      const startSession = async (res: AuthResponse) => {
        const tokens = tokensFrom(res)
        setTokens(tokens)
        await saveTokens(tokens)
        queryClient.clear()
        try {
          await get().reloadProfile()
        } catch (error) {
          // Profil olinmasa sessiyani yarim holatda qoldirmaymiz
          await clearLocal()
          throw error
        }
        set({ isAuthenticated: true })
      }

      return {
        ...SIGNED_OUT,
        onboarded: false,
        hydrated: false,

        loginWithPassword: async (login, password) => {
          const res = await api.postPublic<AuthResponse>('/auth/login', {
            login: login.trim(),
            password,
            deviceInfo: deviceInfo(),
          })
          await startSession(res)
        },

        requestOtp: async (contact) =>
          api.postPublic<OtpRequestResult>('/auth/login/otp/request', contactBody(contact)),

        verifyOtp: async (contact, code) => {
          const res = await api.postPublic<AuthResponse>('/auth/login/otp/verify', {
            ...contactBody(contact),
            code: code.trim(),
            deviceInfo: deviceInfo(),
          })
          await startSession(res)
        },

        reloadProfile: async () => {
          const me = await api.get<MeResponse>('/auth/me')
          let children: Child[] = []
          let school: SchoolBrief | null = null
          if (!me.independent) {
            ;[children, school] = await Promise.all([
              api.get<Child[]>('/parent/children'),
              // Maktab ma'lumoti majburiy emas
              api.get<SchoolBrief>('/parent/school').catch(() => null),
            ])
          }
          const previous = get().activeChildId
          set({
            user: toParentUser(me.user),
            children,
            school,
            features: me.features ?? null,
            activeChildId: children.find((c) => c.id === previous)?.id ?? children[0]?.id ?? null,
          })
        },

        logout: async () => {
          const refreshToken = currentTokens()?.refreshToken
          if (refreshToken) {
            // Tarmoq bo'lmasa ham lokal chiqamiz
            await api.postPublic('/auth/logout', { refreshToken }).catch(() => undefined)
          }
          await clearLocal()
        },

        setActiveChild: (childId) => set({ activeChildId: childId }),
        completeOnboarding: () => set({ onboarded: true }),
      }
    },
    {
      name: 'farzandim.session',
      storage: createJSONStorage(() => AsyncStorage),
      // v1 sessiyada token yo'q — qayta kirish kerak
      version: 2,
      migrate: (persisted) => ({
        ...SIGNED_OUT,
        onboarded: Boolean((persisted as { onboarded?: boolean } | null)?.onboarded),
      }),
      // isAuthenticated tokenlardan aniqlanadi
      partialize: (s) => ({
        user: s.user,
        children: s.children,
        school: s.school,
        activeChildId: s.activeChildId,
        features: s.features,
        onboarded: s.onboarded,
      }),
      onRehydrateStorage: () => (state) => {
        void (async () => {
          const tokens = await loadTokens()
          setTokens(tokens)
          const restored = Boolean(tokens && state?.user)
          useSession.setState({ isAuthenticated: restored, hydrated: true })
          // Farzandlar ro'yxatini fonda yangilaymiz
          if (restored) void useSession.getState().reloadProfile().catch(() => undefined)
        })()
      },
    },
  ),
)

// Refresh rad etilsa — lokal chiqish
configureAuth({
  persist: saveTokens,
  onExpired: () => {
    setTokens(null)
    void saveTokens(null)
    queryClient.clear()
    useSession.setState({ ...SIGNED_OUT })
  },
})

/** Joriy tanlangan farzand — ekranlarda eng ko'p kerak bo'ladigan ma'lumot */
export function useActiveChild() {
  return useSession((s) => s.children.find((c) => c.id === s.activeChildId) ?? s.children[0] ?? null)
}

/** Maktabga bog'lanmagan mustaqil foydalanuvchi — faqat AI bo'limlari ochiq */
export function useIsStandalone() {
  return useSession((s) => s.isAuthenticated && !s.user?.schoolId)
}
