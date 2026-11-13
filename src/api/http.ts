/**
 * Yagona HTTP klient.
 *
 *  • `EXPO_PUBLIC_API_URL` berilgan bo'lsa — haqiqiy mobile-backend (`.../api/v1`);
 *    berilmagan yoki `EXPO_PUBLIC_USE_MOCK=true` — `src/mocks/router.ts`.
 *  • javob qobig'ini ochadi: `{ data }` → `data`; xato → `ApiError`, tarmoq yo'q → `NetworkError`
 *  • 401 → bitta umumiy `POST /auth/refresh` (single-flight) → so'rov bir marta qaytariladi.
 *    Backend refresh tokenni har safar almashtiradi va eskisini qayta ishlatishni
 *    o'g'irlik deb biladi — shuning uchun parallel refresh bo'lmasligi shart.
 *  • token tugashiga oz qolganda so'rovdan oldin yangilanadi
 *  • login/refresh/logout tokensiz ketadi: muddati o'tgan token bilan backend
 *    ochiq endpointda ham 401 qaytaradi (Quarkus proactive auth).
 *
 * Tokenlarni saqlash `store/session.ts` da (SecureStore) — bu modul unga
 * `configureAuth` orqali ulanadi, aylana import bo'lmaydi.
 */
import { mockRequest } from '@/mocks/router'

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '')
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true' || !API_URL

/** Token tugashiga shuncha qolganda so'rovdan oldin yangilanadi */
const REFRESH_SKEW_MS = 30_000

export class ApiError extends Error {
  code: string
  status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/** Tarmoq xatosi (internet yo'q, backend o'chiq) — ApiError'dan alohida */
export class NetworkError extends Error {
  constructor() {
    super("Server bilan aloqa yo'q. Internetni tekshiring va qayta urinib ko'ring.")
    this.name = 'NetworkError'
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  /** ms (epoch); null — noma'lum */
  expiresAt: number | null
}

/** `POST /auth/login`, `/auth/login/otp/verify`, `/auth/refresh` javobidagi tokenlar */
export function tokensFrom(res: { accessToken: string; refreshToken: string; expiresIn?: number }) {
  return {
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    expiresAt: res.expiresIn ? Date.now() + res.expiresIn * 1000 : null,
  } satisfies AuthTokens
}

/* ------------------------------ Token holati ------------------------------- */

let tokens: AuthTokens | null = null
let persistTokens: (next: AuthTokens | null) => Promise<void> = async () => undefined
let onSessionExpired: () => void = () => undefined

/** Sessiya do'koni ulanadi: tokenlarni saqlash va sessiya tugaganda chiqib ketish */
export function configureAuth(options: {
  persist: (next: AuthTokens | null) => Promise<void>
  onExpired: () => void
}) {
  persistTokens = options.persist
  onSessionExpired = options.onExpired
}

export function setTokens(next: AuthTokens | null) {
  tokens = next
}

export function currentTokens() {
  return tokens
}

/* ---------------------------------- So'rov --------------------------------- */

type Params = Record<string, string | number | boolean | undefined | null>

function withQuery(path: string, params?: Params) {
  if (!params) return path
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  )
  if (!entries.length) return path
  const query = entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')
  return `${path}?${query}`
}

async function toApiError(response: Response) {
  const payload = (await response.json().catch(() => null)) as {
    error?: { code?: string; message?: string }
  } | null
  if (payload?.error?.code && payload.error.message) {
    return new ApiError(response.status, payload.error.code, payload.error.message)
  }
  // Xavfsizlik qatlamining 401/403 javoblari tanasiz keladi
  const fallback: Record<number, [string, string]> = {
    401: ['UNAUTHORIZED', 'Sessiya tugagan. Qayta kiring'],
    403: ['FORBIDDEN', "Bu amalga ruxsat yo'q"],
    404: ['NOT_FOUND', 'Topilmadi'],
    429: ['RATE_LIMITED', "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring"],
  }
  const [code, message] = fallback[response.status] ?? [
    'HTTP_ERROR',
    `So'rov bajarilmadi (${response.status})`,
  ]
  return new ApiError(response.status, code, message)
}

async function rawFetch(method: string, path: string, token: string | null, body?: unknown) {
  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new NetworkError()
  }
}

/* ---------------------------------- Refresh -------------------------------- */

let refreshInFlight: Promise<string> | null = null

async function doRefresh(): Promise<string> {
  const used = tokens?.refreshToken
  if (!used) {
    onSessionExpired()
    throw new ApiError(401, 'UNAUTHORIZED', 'Sessiya tugagan. Qayta kiring')
  }
  const response = await rawFetch('POST', '/auth/refresh', null, { refreshToken: used })
  if (response.ok) {
    const { data } = (await response.json()) as {
      data: { accessToken: string; refreshToken: string; expiresIn?: number }
    }
    tokens = tokensFrom(data)
    await persistTokens(tokens)
    return tokens.accessToken
  }
  const error = await toApiError(response)
  // Server xatosi — sessiyani yopmaymiz, keyinroq qayta urinib ko'riladi
  if (response.status >= 500 || response.status === 429) throw error
  // Rad etildi (bekor qilingan, maktab to'xtatilgan, obuna tugagan) — chiqib ketamiz
  tokens = null
  await persistTokens(null)
  onSessionExpired()
  throw error
}

/** Bir vaqtda faqat bitta refresh so'rovi ketadi — qolganlar shu va'dani kutadi */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

async function freshAccessToken(): Promise<string | null> {
  if (!tokens) return null
  const expiring = tokens.expiresAt !== null && tokens.expiresAt - Date.now() < REFRESH_SKEW_MS
  if (!expiring) return tokens.accessToken
  try {
    return await refreshAccessToken()
  } catch (error) {
    // Tarmoq yo'q bo'lsa eski token bilan urinib ko'ramiz
    if (error instanceof NetworkError) return tokens?.accessToken ?? null
    throw error
  }
}

async function request<T>(
  method: string,
  path: string,
  options: { params?: Params; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { params, body, auth = true } = options
  const url = withQuery(path, params)
  if (USE_MOCK) return mockRequest<T>(method, url, body)

  // Tanasiz POST/PATCH ham JSON bo'lib ketadi — aks holda JAX-RS 415 qaytarishi mumkin
  const payload = body !== undefined ? body : method === 'POST' || method === 'PATCH' ? {} : undefined

  const token = auth ? await freshAccessToken() : null
  let response = await rawFetch(method, url, token, payload)
  if (response.status === 401 && auth && tokens?.refreshToken) {
    response = await rawFetch(method, url, await refreshAccessToken(), payload)
  }
  if (!response.ok) throw await toApiError(response)
  if (response.status === 204) return undefined as T
  const json = (await response.json()) as { data: T }
  return json.data
}

export const api = {
  get: <T>(path: string, params?: Params) => request<T>('GET', path, { params }),
  post: <T>(path: string, body?: unknown, params?: Params) =>
    request<T>('POST', path, { params, body }),
  patch: <T>(path: string, body?: unknown, params?: Params) =>
    request<T>('PATCH', path, { params, body }),
  delete: <T>(path: string, params?: Params) => request<T>('DELETE', path, { params }),
  /** Tokensiz POST — login, OTP, logout (401'da refresh qilinmaydi) */
  postPublic: <T>(path: string, body?: unknown) =>
    request<T>('POST', path, { body, auth: false }),
}

/** Har qanday xatodan foydalanuvchiga ko'rsatiladigan matn */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof NetworkError) return error.message
  if (error instanceof Error && error.message) return error.message
  return 'Kutilmagan xato yuz berdi'
}
