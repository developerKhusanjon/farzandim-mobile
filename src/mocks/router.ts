/**
 * Mock "server" — yo'l bo'yicha ma'lumot qaytaradi.
 *
 * URL'lar docs/03-api-contract.md dagi shartnoma bilan bir xil, shuning uchun
 * backend ulanganda `src/api/http.ts` dagi `USE_MOCK` ni false qilish kifoya.
 */
import * as db from './data'
import type { AiHomeworkMode, TrendPeriod } from '@/api/types'

/** Tarmoq kechikishini taqlid qilish — skeletonlar ko'rinishi uchun */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type Route = {
  method: string
  pattern: RegExp
  handler: (args: {
    params: string[]
    query: URLSearchParams
    body: unknown
  }) => unknown | Promise<unknown>
  /** AI javoblari sekinroq — haqiqiy his berish uchun */
  lag?: number
}

/** Login — maktab ota-onasi, OTP — mustaqil foydalanuvchi */
let mockIndependent = false

function mockUser() {
  return { ...db.parent, schoolId: mockIndependent ? null : db.parent.schoolId, role: 'PARENT' }
}

function mockAuth() {
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: mockUser(),
    schools: mockIndependent ? [] : [db.school],
  }
}

const routes: Route[] = [
  /* ---------------------------------- Auth --------------------------------- */
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    lag: 500,
    handler: () => {
      mockIndependent = false
      return mockAuth()
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/login\/otp\/request$/,
    lag: 600,
    handler: () => ({ sent: true, channel: 'PHONE', expiresInSeconds: 300, debugCode: '000000' }),
  },
  {
    method: 'POST',
    pattern: /^\/auth\/login\/otp\/verify$/,
    lag: 500,
    handler: () => {
      // Mustaqil foydalanuvchi — maktabga bog'lanmagan, faqat AI funksiyalari
      mockIndependent = true
      return mockAuth()
    },
  },
  { method: 'POST', pattern: /^\/auth\/refresh$/, handler: () => mockAuth() },
  { method: 'POST', pattern: /^\/auth\/logout$/, handler: () => ({ ok: true }) },
  {
    method: 'GET',
    pattern: /^\/auth\/me$/,
    handler: () => ({
      user: mockUser(),
      schools: mockIndependent ? [] : [db.school],
      independent: mockIndependent,
      features: { ai: true, aiChat: true },
    }),
  },

  /* -------------------------------- Farzandlar ------------------------------ */
  { method: 'GET', pattern: /^\/parent\/children$/, handler: () => db.children },
  {
    method: 'GET',
    pattern: /^\/parent\/children\/([^/]+)\/dashboard$/,
    handler: ({ params }) => {
      const child = db.children.find((c) => c.id === params[0]) ?? db.children[0]!
      return {
        child,
        tasks: db.dayTasks,
        lastLesson: db.lessonSummaries[0],
        unreadMessages: db.messages.filter((m) => !m.isRead).length,
      }
    },
  },

  /* ---------------------------------- Fanlar -------------------------------- */
  { method: 'GET', pattern: /^\/students\/([^/]+)\/subjects$/, handler: () => db.subjects },
  {
    method: 'GET',
    pattern: /^\/students\/([^/]+)\/subjects\/([^/]+)$/,
    handler: ({ params }) => db.subjectDetail(params[1]!) ?? null,
  },
  {
    method: 'GET',
    pattern: /^\/students\/([^/]+)\/progress$/,
    handler: ({ query }) => db.progressTrend((query.get('period') ?? 'WEEK') as TrendPeriod),
  },

  /* ------------------ Intellekt · xulq · kuchli/zaif tomonlar ---------------- */
  { method: 'GET', pattern: /^\/students\/([^/]+)\/character$/, handler: () => db.characterGroups },
  {
    method: 'GET',
    pattern: /^\/students\/([^/]+)\/strengths$/,
    handler: () => db.strengthWeakness,
  },
  { method: 'GET', pattern: /^\/students\/([^/]+)\/interests$/, handler: () => db.interests },
  { method: 'GET', pattern: /^\/students\/([^/]+)\/abilities$/, handler: () => db.abilities },
  {
    method: 'GET',
    pattern: /^\/students\/([^/]+)\/interest-advice$/,
    handler: () => ({ advice: db.interestAdvice }),
  },

  /* ------------------------------ Uy vazifalari ----------------------------- */
  {
    method: 'GET',
    pattern: /^\/parent\/children\/([^/]+)\/homework$/,
    handler: ({ query }) => {
      const scope = query.get('scope') ?? 'today'
      if (scope === 'all') return db.homework
      // Demo ma'lumotda barcha vazifalar bugungi kunga tegishli
      return db.homework
    },
  },
  {
    method: 'GET',
    pattern: /^\/homework\/([^/]+)$/,
    handler: ({ params }) => db.homework.find((h) => h.id === params[0]) ?? null,
  },
  {
    method: 'PATCH',
    pattern: /^\/homework\/([^/]+)\/status$/,
    lag: 300,
    handler: ({ params, body }) => {
      const hw = db.homework.find((h) => h.id === params[0])
      const next = (body as { status?: 'PENDING' | 'DONE' | 'MISSED' })?.status
      if (hw && next) hw.status = next
      return hw ?? null
    },
  },

  /* ------------------------------ Dars xulosasi ----------------------------- */
  {
    method: 'GET',
    pattern: /^\/lessons\/([^/]+)$/,
    handler: ({ params }) => db.lessonSummaries.find((l) => l.id === params[0]) ?? null,
  },

  /* --------------------- AI kognitiv rivojlantiruvchi topshiriqlar ---------- */
  {
    method: 'GET',
    pattern: /^\/students\/([^/]+)\/recommendations$/,
    handler: () => db.cognitiveTasks,
  },
  {
    method: 'PATCH',
    pattern: /^\/recommendations\/([^/]+)$/,
    lag: 300,
    handler: ({ params, body }) => {
      const task = db.cognitiveTasks.find((t) => t.id === params[0])
      const next = (body as { status?: 'SUGGESTED' | 'IN_PROGRESS' | 'DONE' })?.status
      if (task && next) task.status = next
      return task ?? null
    },
  },

  /* -------------------------------- Xabarlar -------------------------------- */
  { method: 'GET', pattern: /^\/messages$/, handler: () => db.messages },
  {
    method: 'POST',
    pattern: /^\/messages\/([^/]+)\/read$/,
    lag: 120,
    handler: ({ params }) => {
      const msg = db.messages.find((m) => m.id === params[0])
      if (msg) msg.isRead = true
      return msg ?? null
    },
  },

  /* ------------------------------ Maktab (ko'rish) -------------------------- */
  { method: 'GET', pattern: /^\/parent\/school$/, handler: () => db.school },
  { method: 'GET', pattern: /^\/parent\/teachers$/, handler: () => db.teachers },
  { method: 'GET', pattern: /^\/parent\/schedule$/, handler: () => db.schedule },

  /* ------------------------------- AI yordamchi ----------------------------- */
  {
    method: 'GET',
    pattern: /^\/ai\/suggestions$/,
    lag: 80,
    handler: () => db.aiSubjectChips,
  },
  {
    method: 'POST',
    pattern: /^\/ai\/messages$/,
    lag: 900,
    handler: ({ body }) => {
      const content = (body as { content?: string })?.content ?? ''
      const reply = db.aiReply(content)
      return {
        id: `ai-${Date.now()}`,
        author: 'AI' as const,
        content: reply.content,
        terms: reply.terms,
        createdAt: new Date().toISOString(),
      }
    },
  },
  {
    method: 'POST',
    pattern: /^\/homework\/([^/]+)\/ai$/,
    lag: 1100,
    handler: ({ params, body }) => {
      const mode = (body as { mode?: AiHomeworkMode })?.mode ?? 'EXPLAIN'
      return db.aiHomeworkResult(params[0]!, mode)
    },
  },
]

export async function mockRequest<T>(method: string, pathWithQuery: string, body?: unknown) {
  const [path, queryString = ''] = pathWithQuery.split('?')
  const query = new URLSearchParams(queryString)

  for (const route of routes) {
    if (route.method !== method) continue
    const match = route.pattern.exec(path!)
    if (!match) continue
    await delay(route.lag ?? 160)
    return route.handler({ params: match.slice(1), query, body }) as T
  }

  throw new Error(`[mock] Yo'l topilmadi: ${method} ${path}`)
}
