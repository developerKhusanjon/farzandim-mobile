/**
 * Yagona HTTP klient.
 *
 * Hozir `USE_MOCK = true` — so'rovlar `src/mocks/router.ts` ga boradi.
 * Backend tayyor bo'lganda `.env` da `EXPO_PUBLIC_API_URL` beriladi va
 * `USE_MOCK` false bo'ladi. URL'lar va javob shakli o'zgarmaydi
 * (docs/03-api-contract.md).
 */
import { mockRequest } from '@/mocks/router'

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? ''
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false' && !API_URL

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

let authToken: string | null = null
export function setAuthToken(token: string | null) {
  authToken = token
}

async function request<T>(method: string, path: string, params?: Params, body?: unknown) {
  if (USE_MOCK) {
    return mockRequest<T>(method, withQuery(path, params), body)
  }

  const response = await fetch(`${API_URL}${withQuery(path, params)}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { code: string; message: string }
    } | null
    throw new ApiError(
      response.status,
      payload?.error?.code ?? 'UNKNOWN',
      payload?.error?.message ?? `So'rov bajarilmadi (${response.status})`,
    )
  }

  const payload = (await response.json()) as { data: T }
  return payload.data
}

export const api = {
  get: <T>(path: string, params?: Params) => request<T>('GET', path, params),
  post: <T>(path: string, body?: unknown, params?: Params) =>
    request<T>('POST', path, params, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, undefined, body),
}
