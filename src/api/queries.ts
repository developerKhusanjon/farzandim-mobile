import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './http'
import type {
  Ability,
  AiHomeworkMode,
  AiHomeworkResult,
  AiMessage,
  CharacterGroup,
  Child,
  CognitiveTask,
  DayTask,
  Homework,
  HomeworkStatus,
  Interest,
  LessonSummary,
  Message,
  ProgressTrend,
  RecommendationStatus,
  ScheduleItem,
  SchoolBrief,
  StrengthWeakness,
  SubjectDetail,
  SubjectScore,
  Teacher,
  TrendPeriod,
} from './types'

export const qk = {
  children: ['children'] as const,
  dashboard: (childId: string) => ['dashboard', childId] as const,
  subjects: (childId: string) => ['subjects', childId] as const,
  subject: (childId: string, subjectId: string) => ['subject', childId, subjectId] as const,
  progress: (childId: string, period: TrendPeriod) => ['progress', childId, period] as const,
  character: (childId: string) => ['character', childId] as const,
  strengths: (childId: string) => ['strengths', childId] as const,
  interests: (childId: string) => ['interests', childId] as const,
  abilities: (childId: string) => ['abilities', childId] as const,
  interestAdvice: (childId: string) => ['interest-advice', childId] as const,
  homework: (childId: string, scope: string) => ['homework', childId, scope] as const,
  homeworkItem: (id: string) => ['homework-item', id] as const,
  lesson: (id: string) => ['lesson', id] as const,
  recommendations: (childId: string) => ['recommendations', childId] as const,
  messages: ['messages'] as const,
  school: ['school'] as const,
  teachers: ['teachers'] as const,
  schedule: ['schedule'] as const,
}

interface DashboardResponse {
  child: Child
  tasks: DayTask[]
  lastLesson?: LessonSummary
  unreadMessages: number
}

/* -------------------------------- Farzandlar ------------------------------ */

export const useChildren = () =>
  useQuery({ queryKey: qk.children, queryFn: () => api.get<Child[]>('/parent/children') })

export const useDashboard = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.dashboard(childId ?? ''),
    queryFn: () => api.get<DashboardResponse>(`/parent/children/${childId}/dashboard`),
    enabled: Boolean(childId),
  })

/* ---------------------------------- Fanlar -------------------------------- */

export const useSubjects = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.subjects(childId ?? ''),
    queryFn: () => api.get<SubjectScore[]>(`/students/${childId}/subjects`),
    enabled: Boolean(childId),
  })

export const useSubjectDetail = (childId: string | undefined, subjectId: string | undefined) =>
  useQuery({
    queryKey: qk.subject(childId ?? '', subjectId ?? ''),
    queryFn: () => api.get<SubjectDetail>(`/students/${childId}/subjects/${subjectId}`),
    enabled: Boolean(childId && subjectId),
  })

export const useProgressTrend = (childId: string | undefined, period: TrendPeriod) =>
  useQuery({
    queryKey: qk.progress(childId ?? '', period),
    queryFn: () => api.get<ProgressTrend>(`/students/${childId}/progress`, { period }),
    enabled: Boolean(childId),
  })

/* ----------------- Intellekt · xulq · kuchli/zaif tomonlar ----------------- */

export const useCharacter = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.character(childId ?? ''),
    queryFn: () => api.get<CharacterGroup[]>(`/students/${childId}/character`),
    enabled: Boolean(childId),
  })

export const useStrengths = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.strengths(childId ?? ''),
    queryFn: () => api.get<StrengthWeakness>(`/students/${childId}/strengths`),
    enabled: Boolean(childId),
  })

export const useInterests = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.interests(childId ?? ''),
    queryFn: () => api.get<Interest[]>(`/students/${childId}/interests`),
    enabled: Boolean(childId),
  })

export const useAbilities = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.abilities(childId ?? ''),
    queryFn: () => api.get<Ability[]>(`/students/${childId}/abilities`),
    enabled: Boolean(childId),
  })

export const useInterestAdvice = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.interestAdvice(childId ?? ''),
    queryFn: () => api.get<{ advice: string }>(`/students/${childId}/interest-advice`),
    enabled: Boolean(childId),
  })

/* ------------------------------ Uy vazifalari ----------------------------- */

export const useHomework = (childId: string | undefined, scope: 'today' | 'yesterday' | 'all') =>
  useQuery({
    queryKey: qk.homework(childId ?? '', scope),
    queryFn: () => api.get<Homework[]>(`/parent/children/${childId}/homework`, { scope }),
    enabled: Boolean(childId),
  })

export const useHomeworkItem = (id: string | undefined) =>
  useQuery({
    queryKey: qk.homeworkItem(id ?? ''),
    queryFn: () => api.get<Homework>(`/homework/${id}`),
    enabled: Boolean(id),
  })

export const useSetHomeworkStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: string; status: HomeworkStatus }) =>
      api.patch<Homework>(`/homework/${input.id}/status`, { status: input.status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['homework'] })
      void qc.invalidateQueries({ queryKey: ['homework-item'] })
      void qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/* ------------------------------ Dars xulosasi ----------------------------- */

export const useLesson = (id: string | undefined) =>
  useQuery({
    queryKey: qk.lesson(id ?? ''),
    queryFn: () => api.get<LessonSummary>(`/lessons/${id}`),
    enabled: Boolean(id),
  })

/* ------------------------- AI kognitiv topshiriqlar ----------------------- */

export const useRecommendations = (childId: string | undefined) =>
  useQuery({
    queryKey: qk.recommendations(childId ?? ''),
    queryFn: () => api.get<CognitiveTask[]>(`/students/${childId}/recommendations`),
    enabled: Boolean(childId),
  })

export const useSetRecommendationStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: string; status: RecommendationStatus }) =>
      api.patch<CognitiveTask>(`/recommendations/${input.id}`, { status: input.status }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['recommendations'] }),
  })
}

/* -------------------------------- Xabarlar -------------------------------- */

export const useMessages = () =>
  useQuery({ queryKey: qk.messages, queryFn: () => api.get<Message[]>('/messages') })

export const useMarkMessageRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post<Message>(`/messages/${id}/read`),
    onSuccess: () => void qc.invalidateQueries({ queryKey: qk.messages }),
  })
}

/* ------------------------------ Maktab (ko'rish) -------------------------- */

export const useSchool = () =>
  useQuery({ queryKey: qk.school, queryFn: () => api.get<SchoolBrief>('/parent/school') })

export const useTeachers = () =>
  useQuery({ queryKey: qk.teachers, queryFn: () => api.get<Teacher[]>('/parent/teachers') })

export const useSchedule = () =>
  useQuery({ queryKey: qk.schedule, queryFn: () => api.get<ScheduleItem[]>('/parent/schedule') })

/* ------------------------------- AI yordamchi ----------------------------- */

export const useSendAiMessage = () =>
  useMutation({
    mutationFn: (content: string) => api.post<AiMessage>('/ai/messages', { content }),
  })

/** Uy vazifasi ekranidagi 3 ta rejim: soddalashtir · tushuntir · yechib ber */
export const useAiHomework = () =>
  useMutation({
    mutationFn: (input: { homeworkId: string; mode: AiHomeworkMode }) =>
      api.post<AiHomeworkResult>(`/homework/${input.homeworkId}/ai`, { mode: input.mode }),
  })
