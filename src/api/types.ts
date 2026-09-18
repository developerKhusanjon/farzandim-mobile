/**
 * Farzandim mobil — domen tiplari (ota-ona nuqtai nazari).
 * Manba: docs/02-data-model.md va docs/03-api-contract.md — backend DTO'lari bilan bir xil.
 */
import type { AccentKey } from '@/theme'

export type Locale = 'uz' | 'ru' | 'en'

/* -------------------------------------------------------------------------- */
/*                              Foydalanuvchi                                 */
/* -------------------------------------------------------------------------- */

export interface ParentUser {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  email?: string
  /** `null` — maktabga bog'lanmagan mustaqil foydalanuvchi (faqat AI) */
  schoolId: string | null
  relation: 'MOTHER' | 'FATHER' | 'GUARDIAN'
  locale: Locale
}

export interface SchoolBrief {
  id: string
  name: string
  address: string
  photoUrl?: string
  phone: string
  academicYear: string
}

/* -------------------------------------------------------------------------- */
/*                                  Farzand                                   */
/* -------------------------------------------------------------------------- */

export interface Child {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
  gradeLevel: number
  groupName: string
  birthDate: string
  status: 'ACTIVE' | 'TRANSFERRED'
  /** Bugun maktabdami — bosh sahifadagi holat chipi */
  atSchool: boolean
  /** Asosiy ko'rsatkichlar */
  academicScore: number
  academicDelta: number
  activityScore: number
  activityDelta: number
  attendanceRate: number
  attendanceDelta: number
  /** Bosh sahifadagi qisqa hisob */
  interestsCount: number
  weaknessesCount: number
}

export interface SubjectScore {
  subjectId: string
  name: string
  shortName: string
  colorKey: AccentKey
  score: number
  delta: number
  teacherName: string
}

export interface TopicScore {
  topicId: string
  title: string
  score: number
}

export interface SubjectDetail extends SubjectScore {
  byTopic: TopicScore[]
  strengths: string[]
  needsWork: string[]
  recentGrades: { id: string; date: string; type: string; value: number; topic?: string }[]
  trend: { label: string; value: number }[]
  teacherComment?: string
}

/** Haftalik / oylik / yillik dinamika (mockup №5) */
export type TrendPeriod = 'WEEK' | 'MONTH' | 'YEAR'

export interface ProgressTrend {
  period: TrendPeriod
  rangeLabel: string
  points: { label: string; value: number }[]
  average: number
  delta: number
}

/* -------------------------------------------------------------------------- */
/*            Intellekt · qiziqish · xulq-atvor · kuchli/zaif tomon           */
/* -------------------------------------------------------------------------- */

export type CharacterCategory = 'COGNITIVE' | 'BEHAVIOR' | 'SOCIAL' | 'CREATIVE'

export interface CharacterTrait {
  key: string
  label: string
  /** 0–100 */
  score: number
  /** Ota-onaga tushunarli izoh — raqam nimani anglatishi */
  description: string
}

export interface CharacterGroup {
  category: CharacterCategory
  label: string
  colorKey: AccentKey
  /** Toifa bo'yicha umumiy ball */
  score: number
  traits: CharacterTrait[]
  /** O'qituvchi yoki AI kuzatuvi */
  summary: string
  updatedAt: string
  source: 'TEACHER' | 'AI'
}

export interface StrengthWeakness {
  strengths: { title: string; detail: string; colorKey: AccentKey }[]
  weaknesses: { title: string; detail: string; colorKey: AccentKey }[]
  /** AI ning umumiy xulosasi — ota-ona uchun bir paragraf */
  summary: string
}

export interface Interest {
  id: string
  key: string
  label: string
  description: string
  level: number
  colorKey: AccentKey
  iconKey: string
  source: 'TEACHER' | 'AI' | 'PARENT'
}

export interface Ability {
  id: string
  label: string
  description: string
  level: number
  colorKey: AccentKey
  iconKey: string
}

/* -------------------------------------------------------------------------- */
/*                              Kunlik faoliyat                               */
/* -------------------------------------------------------------------------- */

export type TaskKind = 'HOMEWORK' | 'LESSON' | 'INDEPENDENT'

/** Bosh sahifadagi "Bugungi vazifalar" qatori */
export interface DayTask {
  id: string
  kind: TaskKind
  subjectName: string
  subjectId: string
  colorKey: AccentKey
  time: string
  label: string
  done: boolean
}

export type HomeworkStatus = 'PENDING' | 'DONE' | 'MISSED'

export interface Homework {
  id: string
  subjectId: string
  subjectName: string
  colorKey: AccentKey
  title: string
  description: string
  dueDate: string
  estimatedMinutes: number
  difficulty: 'EASY' | 'NORMAL' | 'HARD'
  status: HomeworkStatus
  teacherName: string
  /** O'qituvchi yoki AI yozgan ota-ona uchun izoh */
  parentHint?: string
  /**
   * O'qituvchi aynan shu o'quvchi uchun soddalashtirilgan variant biriktirgan bo'lsa.
   * Bu — "qiynalayotgan o'quvchilar uchun soddalashtirish" oqimining natijasi.
   */
  adaptedVariant?: {
    reason: string
    description: string
    stepByStep: string[]
    parentHint: string
  }
}

export interface LessonSummary {
  id: string
  subjectId: string
  subjectName: string
  colorKey: AccentKey
  date: string
  topic: string
  teacherName: string
  summary: string
  terms: { term: string; definition: string }[]
}

/* -------------------------------------------------------------------------- */
/*                       AI kognitiv rivojlantiruvchi topshiriqlar            */
/* -------------------------------------------------------------------------- */

export type CognitiveArea =
  | 'LOGIC'
  | 'MEMORY'
  | 'ATTENTION'
  | 'LANGUAGE'
  | 'SPATIAL'
  | 'CREATIVITY'
  | 'EMOTIONAL'

export type RecommendationStatus = 'SUGGESTED' | 'IN_PROGRESS' | 'DONE'

export interface CognitiveTask {
  id: string
  area: CognitiveArea
  areaLabel: string
  colorKey: AccentKey
  title: string
  description: string
  /** Nega aynan shu bola uchun — aniq raqamga tayanadi */
  rationale: string
  steps: string[]
  durationMinutes: number
  difficulty: 'EASY' | 'NORMAL' | 'HARD'
  status: RecommendationStatus
  /** Ota-ona bilan birga yoki bola mustaqil */
  withParent: boolean
  createdAt: string
}

/* -------------------------------------------------------------------------- */
/*                            Xabarlar va bildirishnomalar                    */
/* -------------------------------------------------------------------------- */

export type MessageCategory = 'LESSON' | 'HOMEWORK' | 'GRADE' | 'TEACHER' | 'SCHOOL' | 'SYSTEM'

export interface Message {
  id: string
  category: MessageCategory
  colorKey: AccentKey
  iconKey: string
  title: string
  body: string
  sentAt: string
  isRead: boolean
  /** Bosilganda ochiladigan ekran */
  link?: { screen: 'lesson' | 'homework' | 'subject'; id: string }
}

/* -------------------------------------------------------------------------- */
/*                                Maktab (ko'rish)                            */
/* -------------------------------------------------------------------------- */

export interface Teacher {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
  subjectName: string
  colorKey: AccentKey
  groups: string[]
  phone?: string
  email?: string
}

export interface ScheduleItem {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  subjectId: string
  subjectName: string
  colorKey: AccentKey
  teacherName: string
  room: string
}

/* -------------------------------------------------------------------------- */
/*                                 AI yordamchi                               */
/* -------------------------------------------------------------------------- */

export interface AiMessage {
  id: string
  author: 'USER' | 'AI'
  content: string
  /** AI javobi ostidagi termin chiplari */
  terms?: string[]
  createdAt: string
}

/** Uy vazifasi bo'yicha AI yordamining uchta rejimi */
export type AiHomeworkMode = 'SIMPLIFY' | 'EXPLAIN' | 'SOLVE'

export interface AiHomeworkResult {
  mode: AiHomeworkMode
  /** `SOLVE` rejimida majburiy ogohlantirish */
  warning?: string
  content: string
  steps?: string[]
}
