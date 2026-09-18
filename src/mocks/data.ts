/**
 * Farzandim mobil — mock ma'lumotlar.
 *
 * Backend tayyor bo'lganda bu fayl o'chiriladi (`src/api/http.ts` dagi
 * `USE_MOCK` false bo'ladi) — URL'lar va javob shakli o'zgarmaydi.
 * Raqamlar dizayn maketidagi bilan bir xil olingan.
 */
import type {
  Ability,
  AiMessage,
  CharacterGroup,
  Child,
  CognitiveTask,
  DayTask,
  Homework,
  Interest,
  LessonSummary,
  Message,
  ParentUser,
  ProgressTrend,
  ScheduleItem,
  SchoolBrief,
  StrengthWeakness,
  SubjectDetail,
  SubjectScore,
  Teacher,
  TrendPeriod,
} from '@/api/types'

/** Demo "bugun" — sanalar shunga nisbatan hisoblanadi */
export const TODAY = new Date()

function iso(offsetDays = 0) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

function at(hour: number, minute = 0, offsetDays = 0) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

/* -------------------------------------------------------------------------- */
/*                          Ota-ona, maktab, farzand                          */
/* -------------------------------------------------------------------------- */

export const parent: ParentUser = {
  id: 'prn-1',
  firstName: 'Emma',
  lastName: 'Karimova',
  avatarUrl: 'https://i.pravatar.cc/200?img=45',
  phone: '+998 90 123 45 67',
  schoolId: 'sch-1',
  relation: 'MOTHER',
  locale: 'uz',
}

export const school: SchoolBrief = {
  id: 'sch-1',
  name: 'Sunrise Private School',
  address: 'Toshkent, Shayxontohur',
  phone: '+998 71 200 44 55',
  academicYear: '2024–2025',
}

export const children: Child[] = [
  {
    id: 'std-1',
    firstName: 'Aziza',
    lastName: 'Karimova',
    avatarUrl: 'https://i.pravatar.cc/200?img=47',
    gradeLevel: 4,
    groupName: 'A sinf',
    birthDate: '2016-05-20',
    status: 'ACTIVE',
    atSchool: true,
    academicScore: 84,
    academicDelta: 5,
    activityScore: 81,
    activityDelta: 3,
    attendanceRate: 96,
    attendanceDelta: 2,
    interestsCount: 3,
    weaknessesCount: 2,
  },
  {
    id: 'std-2',
    firstName: 'Bekzod',
    lastName: 'Karimov',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    gradeLevel: 2,
    groupName: 'B sinf',
    birthDate: '2018-09-03',
    status: 'ACTIVE',
    atSchool: true,
    academicScore: 78,
    academicDelta: -2,
    activityScore: 86,
    activityDelta: 4,
    attendanceRate: 93,
    attendanceDelta: -1,
    interestsCount: 2,
    weaknessesCount: 3,
  },
]

/* -------------------------------------------------------------------------- */
/*                                   Fanlar                                   */
/* -------------------------------------------------------------------------- */

export const subjects: SubjectScore[] = [
  {
    subjectId: 'sub-1',
    name: 'Matematika',
    shortName: 'Mat',
    colorKey: 'blue',
    score: 84,
    delta: 5,
    teacherName: 'Dilshoda Karimova',
  },
  {
    subjectId: 'sub-2',
    name: 'Ingliz tili',
    shortName: 'Ing',
    colorKey: 'green',
    score: 91,
    delta: 3,
    teacherName: 'Sardorbek Raximov',
  },
  {
    subjectId: 'sub-3',
    name: 'Tabiiy fanlar',
    shortName: 'Tab',
    colorKey: 'amber',
    score: 78,
    delta: 2,
    teacherName: "Go'zal Yuldasheva",
  },
  {
    subjectId: 'sub-4',
    name: 'Dasturlash',
    shortName: 'Das',
    colorKey: 'purple',
    score: 66,
    delta: 4,
    teacherName: 'Azizbek Tursunov',
  },
]

const SUBJECT_DETAILS: Record<string, Omit<SubjectDetail, keyof SubjectScore>> = {
  'sub-1': {
    byTopic: [
      { topicId: 't1', title: 'Sonlar va amallar', score: 94 },
      { topicId: 't2', title: 'Kasrlar', score: 62 },
      { topicId: 't3', title: 'Geometriya', score: 89 },
      { topicId: 't4', title: "O'lchov birliklari", score: 85 },
      { topicId: 't5', title: 'Matnli masalalar', score: 71 },
    ],
    strengths: ["Ko'paytirish va bo'lish", 'Geometrik shakllar'],
    needsWork: ['Kasrlar bilan amallar', 'Matnli masalalarni tahlil qilish'],
    recentGrades: [
      { id: 'g1', date: iso(-2), type: 'Sinf ishi', value: 90, topic: 'Geometriya' },
      { id: 'g2', date: iso(-5), type: 'Uy vazifasi', value: 85, topic: "O'lchov birliklari" },
      { id: 'g3', date: iso(-9), type: 'Test', value: 68, topic: 'Kasrlar' },
      { id: 'g4', date: iso(-14), type: 'Sinf ishi', value: 92, topic: 'Sonlar va amallar' },
    ],
    trend: [
      { label: 'Yan', value: 74 },
      { label: 'Fev', value: 77 },
      { label: 'Mar', value: 79 },
      { label: 'Apr', value: 81 },
      { label: 'May', value: 84 },
    ],
    teacherComment:
      'Aziza darsda faol, savol berishdan tortinmaydi. Kasrlar mavzusida qo‘shimcha mashq qilsa, natija yanada yaxshilanadi.',
  },
  'sub-2': {
    byTopic: [
      { topicId: 't1', title: "So'z boyligi", score: 95 },
      { topicId: 't2', title: 'Grammatika', score: 88 },
      { topicId: 't3', title: 'Tinglab tushunish', score: 93 },
      { topicId: 't4', title: "Og'zaki nutq", score: 90 },
      { topicId: 't5', title: 'Yozma ish', score: 86 },
    ],
    strengths: ["So'z boyligi", 'Tinglab tushunish', "Og'zaki nutq"],
    needsWork: [],
    recentGrades: [
      { id: 'g1', date: iso(-1), type: 'Og‘zaki', value: 95, topic: "Og'zaki nutq" },
      { id: 'g2', date: iso(-4), type: 'Test', value: 92, topic: 'Grammatika' },
      { id: 'g3', date: iso(-8), type: 'Uy vazifasi', value: 88, topic: "So'z boyligi" },
    ],
    trend: [
      { label: 'Yan', value: 84 },
      { label: 'Fev', value: 86 },
      { label: 'Mar', value: 88 },
      { label: 'Apr', value: 89 },
      { label: 'May', value: 91 },
    ],
    teacherComment:
      'Ingliz tilida sinfdagi eng kuchli o‘quvchilardan biri. Murakkabroq matnlar bilan ishlashni boshlash mumkin.',
  },
  'sub-3': {
    byTopic: [
      { topicId: 't1', title: 'Tirik organizmlar', score: 86 },
      { topicId: 't2', title: "O'simliklar", score: 58 },
      { topicId: 't3', title: 'Suv va havo', score: 82 },
      { topicId: 't4', title: 'Quyosh tizimi', score: 88 },
    ],
    strengths: ['Quyosh tizimi', 'Tirik organizmlar'],
    needsWork: ["O'simliklar tuzilishi"],
    recentGrades: [
      { id: 'g1', date: iso(-3), type: 'Uy vazifasi', value: 60, topic: "O'simliklar" },
      { id: 'g2', date: iso(-7), type: 'Sinf ishi', value: 85, topic: 'Suv va havo' },
    ],
    trend: [
      { label: 'Yan', value: 72 },
      { label: 'Fev', value: 74 },
      { label: 'Mar', value: 75 },
      { label: 'Apr', value: 76 },
      { label: 'May', value: 78 },
    ],
    teacherComment:
      'O‘simliklar mavzusida atamalarni eslab qolishda qiynalmoqda. Uyda jonli misollar bilan takrorlash foyda beradi.',
  },
  'sub-4': {
    byTopic: [
      { topicId: 't1', title: 'Algoritm asoslari', score: 74 },
      { topicId: 't2', title: 'Scratch', score: 70 },
      { topicId: 't3', title: 'Sikllar', score: 55 },
      { topicId: 't4', title: 'Shartli operatorlar', score: 58 },
    ],
    strengths: ['Algoritm asoslari'],
    needsWork: ['Sikllar', 'Shartli operatorlar'],
    recentGrades: [
      { id: 'g1', date: iso(-2), type: 'Loyiha', value: 64, topic: 'Scratch' },
      { id: 'g2', date: iso(-6), type: 'Sinf ishi', value: 58, topic: 'Sikllar' },
    ],
    trend: [
      { label: 'Yan', value: 58 },
      { label: 'Fev', value: 60 },
      { label: 'Mar', value: 62 },
      { label: 'Apr', value: 63 },
      { label: 'May', value: 66 },
    ],
    teacherComment:
      'Sikl va shart tushunchalari hali mustahkamlanmagan. Vizual misollar (o‘yin, animatsiya) bilan tushuntirish samarali bo‘ladi.',
  },
}

export function subjectDetail(subjectId: string): SubjectDetail | undefined {
  const base = subjects.find((s) => s.subjectId === subjectId)
  const extra = SUBJECT_DETAILS[subjectId]
  if (!base || !extra) return undefined
  return { ...base, ...extra }
}

/* -------------------------------------------------------------------------- */
/*                         O'zlashtirish dinamikasi                           */
/* -------------------------------------------------------------------------- */

const TRENDS: Record<TrendPeriod, ProgressTrend> = {
  WEEK: {
    period: 'WEEK',
    rangeLabel: '20 – 26 may, 2024',
    average: 84,
    delta: 5,
    points: [
      { label: 'Du', value: 78 },
      { label: 'Se', value: 82 },
      { label: 'Ch', value: 76 },
      { label: 'Pa', value: 85 },
      { label: 'Ju', value: 84 },
      { label: 'Sh', value: 88 },
      { label: 'Ya', value: 86 },
    ],
  },
  MONTH: {
    period: 'MONTH',
    rangeLabel: 'May, 2024',
    average: 82,
    delta: 4,
    points: [
      { label: '1-h', value: 76 },
      { label: '2-h', value: 80 },
      { label: '3-h', value: 83 },
      { label: '4-h', value: 84 },
    ],
  },
  YEAR: {
    period: 'YEAR',
    rangeLabel: '2024–2025 o‘quv yili',
    average: 80,
    delta: 10,
    points: [
      { label: 'Sen', value: 72 },
      { label: 'Okt', value: 74 },
      { label: 'Noy', value: 77 },
      { label: 'Dek', value: 78 },
      { label: 'Yan', value: 80 },
      { label: 'Fev', value: 81 },
      { label: 'Mar', value: 82 },
      { label: 'Apr', value: 83 },
      { label: 'May', value: 84 },
    ],
  },
}

export function progressTrend(period: TrendPeriod) {
  return TRENDS[period]
}

/* -------------------------------------------------------------------------- */
/*          Intellekt · xulq-atvor · kuchli va zaif tomonlar (⭐ asosiy)       */
/* -------------------------------------------------------------------------- */

export const characterGroups: CharacterGroup[] = [
  {
    category: 'COGNITIVE',
    label: 'Intellekt va fikrlash',
    colorKey: 'blue',
    score: 86,
    source: 'AI',
    updatedAt: iso(-3),
    summary:
      'Aziza mantiqiy topshiriqlarni tez yechadi va qonuniyatlarni o‘zi topa oladi. Diqqatni uzoq ushlab turishda esa qiynaladi — topshiriqning oxirgi qismida xatolar ko‘payadi.',
    traits: [
      {
        key: 'logic',
        label: 'Mantiqiy fikrlash',
        score: 92,
        description: 'Sabab-natijani tez topadi, qonuniyatlarni mustaqil aniqlaydi',
      },
      {
        key: 'memory',
        label: 'Xotira',
        score: 84,
        description: 'Yangi so‘z va qoidalarni yaxshi eslab qoladi',
      },
      {
        key: 'attention',
        label: 'Diqqat barqarorligi',
        score: 64,
        description: '15–20 daqiqadan keyin e‘tibor pasayadi',
      },
      {
        key: 'spatial',
        label: 'Fazoviy tasavvur',
        score: 89,
        description: 'Geometrik shakllarni fazoda yaxshi tasavvur qiladi',
      },
      {
        key: 'analysis',
        label: 'Tahlil qilish',
        score: 78,
        description: 'Matnli masalada shartni ajratishda yordam kerak',
      },
    ],
  },
  {
    category: 'BEHAVIOR',
    label: 'Xulq-atvor',
    colorKey: 'pink',
    score: 88,
    source: 'TEACHER',
    updatedAt: iso(-6),
    summary:
      'Darsga doim tayyor keladi va qoidalarga rioya qiladi. Xato qilishdan cho‘chiydi — javobga ishonchi bo‘lmasa, qo‘l ko‘tarmaydi.',
    traits: [
      {
        key: 'discipline',
        label: 'Intizom',
        score: 94,
        description: 'Darsga kechikmaydi, jihozlari doim tayyor',
      },
      {
        key: 'responsibility',
        label: 'Mas’uliyat',
        score: 90,
        description: 'Uy vazifalarini o‘z vaqtida bajaradi',
      },
      {
        key: 'initiative',
        label: 'Tashabbuskorlik',
        score: 72,
        description: 'Ishonchi komil bo‘lgandagina ixtiyoriy javob beradi',
      },
      {
        key: 'resilience',
        label: 'Xatoga munosabat',
        score: 66,
        description: 'Xato qilsa, ruhi tushadi va qayta urinishdan tortinadi',
      },
    ],
  },
  {
    category: 'SOCIAL',
    label: 'Ijtimoiy ko‘nikmalar',
    colorKey: 'teal',
    score: 81,
    source: 'TEACHER',
    updatedAt: iso(-6),
    summary:
      'Kichik guruhlarda yaxshi ishlaydi, sinfdoshlariga yordam beradi. Katta auditoriya oldida gapirishda hayajonlanadi.',
    traits: [
      {
        key: 'teamwork',
        label: 'Jamoada ishlash',
        score: 88,
        description: '3–4 kishilik guruhda faol rol oladi',
      },
      {
        key: 'communication',
        label: 'Muloqot',
        score: 76,
        description: 'Sinf oldida taqdimot qilishda hayajonlanadi',
      },
      {
        key: 'empathy',
        label: 'Hamdardlik',
        score: 90,
        description: 'Qiynalayotgan sinfdoshiga o‘zi yordam taklif qiladi',
      },
    ],
  },
  {
    category: 'CREATIVE',
    label: 'Ijodkorlik',
    colorKey: 'purple',
    score: 79,
    source: 'AI',
    updatedAt: iso(-3),
    summary:
      'Ochiq yakunli topshiriqlarda o‘ziga xos yechimlar taklif qiladi. Rasm va loyiha ishlarida g‘oyalari boy.',
    traits: [
      {
        key: 'imagination',
        label: 'Tasavvur',
        score: 85,
        description: 'Hikoya va loyihalarda original g‘oyalar beradi',
      },
      {
        key: 'expression',
        label: 'O‘zini ifodalash',
        score: 73,
        description: 'Fikrini yozma bayon qilishda so‘z boyligi cheklangan',
      },
    ],
  },
]

export const strengthWeakness: StrengthWeakness = {
  summary:
    'Azizaning eng kuchli tomoni — mantiqiy fikrlash va til o‘rganish qobiliyati. Asosiy o‘sish nuqtasi esa diqqatni uzoq ushlab turish va xatodan qo‘rqmaslik. Bu ikkisi ustida ishlash boshqa barcha fanlardagi natijani ham ko‘taradi.',
  strengths: [
    {
      title: 'Mantiqiy fikrlash — 92%',
      detail: 'Qonuniyatlarni o‘zi topadi, matematikada sinfdagi eng yaxshi natijalardan',
      colorKey: 'blue',
    },
    {
      title: 'Til o‘rganish — 91%',
      detail: 'Ingliz tilida so‘z boyligi va tinglab tushunish darajasi yuqori',
      colorKey: 'green',
    },
    {
      title: 'Intizom va mas’uliyat — 94%',
      detail: 'Uy vazifalarini o‘z vaqtida bajaradi, darsga doim tayyor keladi',
      colorKey: 'teal',
    },
  ],
  weaknesses: [
    {
      title: 'Diqqat barqarorligi — 64%',
      detail:
        '15–20 daqiqadan so‘ng e‘tibor pasayadi. Topshiriqning oxirgi qismida xatolar ko‘payadi',
      colorKey: 'amber',
    },
    {
      title: 'Xatoga munosabat — 66%',
      detail: 'Xato qilishdan cho‘chiydi, shuning uchun qiyin savolda urinib ko‘rmaydi',
      colorKey: 'red',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*                        Qiziqishlar va qobiliyatlar                         */
/* -------------------------------------------------------------------------- */

export const interests: Interest[] = [
  {
    id: 'int-1',
    key: 'math',
    label: 'Matematika',
    description: 'Mantiqiy fikrlash, muammolarni yechish',
    level: 92,
    colorKey: 'blue',
    iconKey: 'calculator',
    source: 'AI',
  },
  {
    id: 'int-2',
    key: 'english',
    label: 'Ingliz tili',
    description: "Til o'rganish, so'z boyligini oshirish",
    level: 88,
    colorKey: 'green',
    iconKey: 'languages',
    source: 'TEACHER',
  },
  {
    id: 'int-3',
    key: 'drawing',
    label: 'Rasm chizish',
    description: 'Ijodkorlik, tasviriy tafakkur',
    level: 76,
    colorKey: 'pink',
    iconKey: 'palette',
    source: 'TEACHER',
  },
  {
    id: 'int-4',
    key: 'sport',
    label: 'Sport',
    description: 'Faollik, jamoaviy ishlash',
    level: 68,
    colorKey: 'teal',
    iconKey: 'activity',
    source: 'PARENT',
  },
]

export const abilities: Ability[] = [
  {
    id: 'ab-1',
    label: 'Analitik fikrlash',
    description: 'Murakkab masalani qismlarga ajratib yecha oladi',
    level: 90,
    colorKey: 'blue',
    iconKey: 'brain',
  },
  {
    id: 'ab-2',
    label: 'Lingvistik qobiliyat',
    description: 'Yangi tilni tez o‘zlashtiradi, talaffuzi aniq',
    level: 89,
    colorKey: 'green',
    iconKey: 'languages',
  },
  {
    id: 'ab-3',
    label: 'Vizual-fazoviy',
    description: 'Shakl va fazoviy munosabatlarni yaxshi tasavvur qiladi',
    level: 85,
    colorKey: 'purple',
    iconKey: 'shapes',
  },
  {
    id: 'ab-4',
    label: 'Ijodiy tasavvur',
    description: 'Ochiq yakunli topshiriqlarda original g‘oyalar beradi',
    level: 79,
    colorKey: 'pink',
    iconKey: 'sparkles',
  },
  {
    id: 'ab-5',
    label: 'Jamoaviy ishlash',
    description: 'Kichik guruhda faol va foydali rol oladi',
    level: 81,
    colorKey: 'teal',
    iconKey: 'users',
  },
]

/** Qiziqishlar ekranidagi AI tavsiyasi (mockup №6) */
export const interestAdvice =
  'Aziza uchun ingliz tilida davom etish tavsiya etiladi. Bu uning kelajakdagi imkoniyatlarini kengaytiradi — til va mantiq qobiliyati birga rivojlansa, dasturlashdagi natija ham ko‘tariladi.'

/* -------------------------------------------------------------------------- */
/*                              Kunlik faoliyat                               */
/* -------------------------------------------------------------------------- */

export const dayTasks: DayTask[] = [
  {
    id: 'dt-1',
    kind: 'HOMEWORK',
    subjectId: 'sub-1',
    subjectName: 'Matematika',
    colorKey: 'blue',
    time: '11:00',
    label: 'Uy vazifasi',
    done: true,
  },
  {
    id: 'dt-2',
    kind: 'LESSON',
    subjectId: 'sub-2',
    subjectName: 'Ingliz tili',
    colorKey: 'green',
    time: '13:00',
    label: 'Dars',
    done: false,
  },
  {
    id: 'dt-3',
    kind: 'INDEPENDENT',
    subjectId: 'sub-3',
    subjectName: 'Tabiatshunoslik',
    colorKey: 'amber',
    time: '15:00',
    label: 'Mustaqil ish',
    done: false,
  },
]

export const homework: Homework[] = [
  {
    id: 'hw-1',
    subjectId: 'sub-1',
    subjectName: 'Matematika',
    colorKey: 'blue',
    title: 'Misollar: 1–10 (daftarda)',
    description:
      '1) 84-betdagi 1–10 misollarni daftarga yeching.\n2) Har bir misolda yechim bosqichlarini to‘liq yozing.\n3) Javoblarni tekshirib, xato topsangiz qizil qalam bilan tuzating.',
    dueDate: iso(0),
    estimatedMinutes: 25,
    difficulty: 'NORMAL',
    status: 'DONE',
    teacherName: 'Dilshoda Karimova',
    parentHint:
      'Aziza misollarni tez yechadi, lekin oxirgi 2–3 tasida shoshib xato qiladi. Bajarib bo‘lgach, javoblarni birga tekshiring.',
  },
  {
    id: 'hw-2',
    subjectId: 'sub-2',
    subjectName: 'Ingliz tili',
    colorKey: 'green',
    title: "Yangi so'zlar (10 ta)",
    description:
      '1) Unit 6 dagi 10 ta yangi so‘zni daftarga yozing va tarjimasini toping.\n2) Har bir so‘z bilan bittadan gap tuzing.\n3) Audio yozuvni tinglab, talaffuzni 3 marta takrorlang.',
    dueDate: iso(0),
    estimatedMinutes: 20,
    difficulty: 'EASY',
    status: 'DONE',
    teacherName: 'Sardorbek Raximov',
    parentHint:
      'So‘zlarni kartochka usulida takrorlang: bir tomonda inglizcha, ikkinchisida o‘zbekcha. Ertasi kuni yana bir bor takrorlash eslab qolishni mustahkamlaydi.',
  },
  {
    id: 'hw-3',
    subjectId: 'sub-3',
    subjectName: 'Tabiatshunoslik',
    colorKey: 'amber',
    title: "Mavzu: O'simliklar",
    description:
      '1) O‘simlikni chizing va qismlarini belgilang: ildiz, poya, barg, gul, meva.\n2) Har bir qismning vazifasini bir gapda yozing.\n3) Fotosintez jarayonini 3 ta gap bilan tushuntiring.\n4) Uyingizdagi bitta o‘simlikni kuzatib, 3 ta xususiyatini yozing.',
    dueDate: iso(0),
    estimatedMinutes: 30,
    difficulty: 'HARD',
    status: 'MISSED',
    teacherName: "Go'zal Yuldasheva",
    parentHint:
      'Kitobdagi rasmni ko‘rsatishdan ko‘ra, uydagi gulni birga kuzatish samaraliroq. "Bu qism nima uchun kerak deb o‘ylaysan?" deb so‘rang — javobni o‘zi topsin.',
    // O'qituvchi AI yordamida aynan Aziza uchun soddalashtirilgan variant biriktirgan
    adaptedVariant: {
      reason:
        'Tabiiy fanlarda "O‘simliklar" mavzusi bo‘yicha natija 58% — atamalarni eslab qolishda qiyinchilik bor',
      description:
        'Soddalashtirilgan variant:\n\n1) O‘simlikning faqat 3 ta asosiy qismini chizing: ildiz, poya, barg. (Gul va meva keyingi darsda)\n2) Har bir qism yonida bitta so‘z yozing: ildiz — "suv oladi", poya — "ko‘taradi", barg — "nafas oladi".\n3) Fotosintezni bir gap bilan ayting: "Barg quyosh yorug‘ligidan oziq tayyorlaydi."',
      stepByStep: [
        'Uydagi gulni stolga qo‘ying va birga qarab chiqing',
        'Har bir qismni barmoq bilan ko‘rsatib nomini ayting, keyin Aziza takrorlasin',
        'Chizishni birga boshlang — birinchi qismini siz, qolganini u chizsin',
        'Oxirida: "Barg nima qiladi?" deb so‘rang. O‘z so‘zi bilan aytsa — tushungan',
      ],
      parentHint:
        'Bu variant o‘qituvchi tomonidan aynan Aziza uchun tayyorlangan. Maqsad — kamroq material, lekin to‘liq tushunish. Asl vazifani keyinroq qaytib bajarish mumkin.',
    },
  },
]

export const lessonSummaries: LessonSummary[] = [
  {
    id: 'les-1',
    subjectId: 'sub-1',
    subjectName: 'Matematika',
    colorKey: 'blue',
    date: iso(0),
    topic: 'Sonlar bilan amallar',
    teacherName: 'Dilshoda Karimova',
    summary:
      'Bugungi darsda Aziza sonlar bilan amallarni takrorladi va yangi mavzu — ko‘p xonali sonlarni qo‘shish bilan tanishdi.\n\nDarsda nimalar bo‘ldi:\n• Yangi mavzu tushuntirildi, doskada 3 ta namuna yechildi\n• O‘quvchilar juftlikda 5 ta mashq bajarishdi\n• Dars oxirida qisqa og‘zaki so‘rov o‘tkazildi\n\nAziza darsda faol ishtirok etdi va 5 ta savolga javob berdi. Yangi mavzuni tushunishda qiynalmadi.',
    terms: [
      {
        term: 'Qo‘shiluvchi',
        definition: 'Qo‘shish amalida qatnashadigan sonlar. Masalan 25 + 30 da 25 va 30',
      },
      { term: 'Yig‘indi', definition: 'Qo‘shish amalining natijasi. 25 + 30 = 55 — bu yig‘indi' },
      {
        term: 'Xona birligi',
        definition: 'Sonning har bir raqami turgan o‘rin: birlik, o‘nlik, yuzlik',
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                   AI kognitiv rivojlantiruvchi topshiriqlar (⭐)           */
/* -------------------------------------------------------------------------- */

export const cognitiveTasks: CognitiveTask[] = [
  {
    id: 'ct-1',
    area: 'ATTENTION',
    areaLabel: 'Diqqat',
    colorKey: 'amber',
    title: 'Diqqatni jamlash mashqi',
    description:
      '"Farqni top" turidagi rasmlar bilan kuniga 8 daqiqa ishlash. So‘ng topilgan farqlarni ovoz chiqarib aytib berish.',
    rationale:
      'Diqqat barqarorligi 64% — topshiriqning oxirgi qismida xatolar ko‘paymoqda. Bu mashq e‘tiborni uzoqroq ushlab turishga o‘rgatadi.',
    steps: [
      'Taymer qo‘ying — aniq 8 daqiqa',
      'Aziza topgan har bir farqni ovoz chiqarib aytsin',
      'Vaqt tugaganda to‘xtating, hatto tugatmagan bo‘lsa ham',
      'Ertasi kuni bir xil vaqtda takrorlang',
    ],
    durationMinutes: 8,
    difficulty: 'EASY',
    status: 'SUGGESTED',
    withParent: true,
    createdAt: iso(-1),
  },
  {
    id: 'ct-2',
    area: 'LOGIC',
    areaLabel: 'Mantiq',
    colorKey: 'blue',
    title: 'Matnli masalani sxemaga aylantirish',
    description:
      'Har kuni 1 ta matnli masala oling. Yechishdan oldin masalani rasm yoki sxema ko‘rinishida chizing — keyingina hisoblang.',
    rationale:
      'Matematikada matnli masalalar 71% — shartni matematik ifodaga o‘girishda qiyinchilik bor. Sxema chizish shu ko‘prikni quradi.',
    steps: [
      'Masalani ovoz chiqarib o‘qing',
      '"Nima berilgan? Nima topish kerak?" — ikkalasini yozib oling',
      'Rasm yoki sxema chizing (odamlar, quti, chiziq — nima mos kelsa)',
      'Faqat shundan keyin hisoblashni boshlang',
    ],
    durationMinutes: 15,
    difficulty: 'NORMAL',
    status: 'IN_PROGRESS',
    withParent: true,
    createdAt: iso(-5),
  },
  {
    id: 'ct-3',
    area: 'EMOTIONAL',
    areaLabel: 'Emotsional',
    colorKey: 'red',
    title: '"Xato — bu foyda" o‘yini',
    description:
      'Kuniga bir marta: siz ham, Aziza ham o‘sha kuni qilgan bitta xatoni aytasiz va undan nima o‘rganganini qo‘shasiz.',
    rationale:
      'Xatoga munosabat ko‘rsatkichi 66% — xato qilishdan cho‘chiydi va qiyin savolda urinib ko‘rmaydi. Bu o‘yin xatoni normallashtiradi.',
    steps: [
      'Kechqurun 5 daqiqa ajrating',
      'Avval SIZ o‘z xatoingizni ayting — namuna bo‘ling',
      'Keyin Aziza aytsin, hech qanday tanqidsiz',
      'Har biriga "nima o‘rganding?" savolini qo‘shing',
    ],
    durationMinutes: 5,
    difficulty: 'EASY',
    status: 'SUGGESTED',
    withParent: true,
    createdAt: iso(-1),
  },
  {
    id: 'ct-4',
    area: 'LANGUAGE',
    areaLabel: 'Nutq',
    colorKey: 'green',
    title: 'Kunlik 5 gaplik hikoya',
    description:
      'Kun davomida bo‘lgan bitta voqeani 5 ta gap bilan yozma bayon qilish. Har hafta 1 ta yangi bog‘lovchi so‘z qo‘shish.',
    rationale:
      'O‘zini ifodalash 73% — yozma nutqda gap tuzilishi cheklangan. Bu mashq so‘z boyligini tabiiy ravishda kengaytiradi.',
    steps: [
      'Kun oxirida "bugun eng qiziq nima bo‘ldi?" deb so‘rang',
      'Aziza 5 ta gap bilan yozsin',
      'Xatolarni tuzatmang — mazmunga e‘tibor bering',
      'Haftada bir marta yozganlarini birga o‘qing',
    ],
    durationMinutes: 10,
    difficulty: 'EASY',
    status: 'DONE',
    withParent: false,
    createdAt: iso(-12),
  },
  {
    id: 'ct-5',
    area: 'SPATIAL',
    areaLabel: 'Fazoviy tasavvur',
    colorKey: 'purple',
    title: 'Qog‘ozdan 3D shakllar',
    description:
      'Qog‘ozdan kub, piramida va silindr yasash, so‘ng ularning yoyilmasini daftarga chizish.',
    rationale:
      'Fazoviy tasavvur 89% — bu kuchli tomon. Uni yanada rivojlantirish geometriya va dasturlashdagi natijani ko‘taradi.',
    steps: [
      'Internetdan yoyilma shablonini chop eting',
      'Birga qirqib yopishtiring',
      'Tayyor shaklga qarab yoyilmasini xotiradan chizsin',
      'Keyingi safar shablonsiz urinib ko‘ring',
    ],
    durationMinutes: 20,
    difficulty: 'NORMAL',
    status: 'SUGGESTED',
    withParent: false,
    createdAt: iso(-2),
  },
]

/* -------------------------------------------------------------------------- */
/*                                  Xabarlar                                  */
/* -------------------------------------------------------------------------- */

export const messages: Message[] = [
  {
    id: 'msg-1',
    category: 'LESSON',
    colorKey: 'blue',
    iconKey: 'book-open',
    title: 'Matematika darsi haqida xulosa',
    body: 'Bugungi darsda Aziza sonlar bilan amallarni takrorladi va yangi mavzu bilan tanishdi.',
    sentAt: at(15, 30),
    isRead: false,
    link: { screen: 'lesson', id: 'les-1' },
  },
  {
    id: 'msg-2',
    category: 'HOMEWORK',
    colorKey: 'green',
    iconKey: 'clipboard-check',
    title: 'Uy vazifasi eslatmasi',
    body: "Ingliz tili: 5 ta yangi so'z yod olish. Muddat — bugun soat 20:00 gacha.",
    sentAt: at(13, 0),
    isRead: false,
    link: { screen: 'homework', id: 'hw-2' },
  },
  {
    id: 'msg-3',
    category: 'TEACHER',
    colorKey: 'purple',
    iconKey: 'message-circle',
    title: "O'qituvchi xabari",
    body: 'Ertaga matematikadan nazorat ishi bo‘ladi. Kasrlar mavzusini takrorlashni unutmang.',
    sentAt: at(11, 20),
    isRead: true,
  },
  {
    id: 'msg-4',
    category: 'GRADE',
    colorKey: 'teal',
    iconKey: 'trending-up',
    title: 'Yangi natija',
    body: "Ingliz tili fanidan o'zlashtirish 91% ga yetdi (+3%).",
    sentAt: at(9, 45),
    isRead: true,
    link: { screen: 'subject', id: 'sub-2' },
  },
  {
    id: 'msg-5',
    category: 'SCHOOL',
    colorKey: 'amber',
    iconKey: 'megaphone',
    title: 'Maktab yangiliklari',
    body: "Ota-onalar uchun yozgi o'quv kurslari haqida ma'lumot e'lon qilindi.",
    sentAt: at(8, 30),
    isRead: true,
  },
  {
    id: 'msg-6',
    category: 'SYSTEM',
    colorKey: 'pink',
    iconKey: 'gift',
    title: 'Tug‘ilgan kun',
    body: 'Aziza bugun 10 yoshda! 🎉 Sinfdoshlari va o‘qituvchilari tabriklaydi.',
    sentAt: at(7, 10),
    isRead: true,
  },
]

/* -------------------------------------------------------------------------- */
/*                          Maktab (faqat ko'rish)                            */
/* -------------------------------------------------------------------------- */

export const teachers: Teacher[] = [
  {
    id: 'tch-1',
    firstName: 'Dilshoda',
    lastName: 'Karimova',
    avatarUrl: 'https://i.pravatar.cc/200?img=32',
    subjectName: 'Matematika',
    colorKey: 'blue',
    groups: ['4-A', '4-B'],
    phone: '+998 90 111 22 33',
    email: 'dilshoda.karimova@sunrise.uz',
  },
  {
    id: 'tch-2',
    firstName: 'Sardorbek',
    lastName: 'Raximov',
    avatarUrl: 'https://i.pravatar.cc/200?img=13',
    subjectName: 'Ingliz tili',
    colorKey: 'green',
    groups: ['3-A', '3-B', '4-A'],
    phone: '+998 90 222 33 44',
    email: 'sardorbek.raximov@sunrise.uz',
  },
  {
    id: 'tch-3',
    firstName: "Go'zal",
    lastName: 'Yuldasheva',
    avatarUrl: 'https://i.pravatar.cc/200?img=20',
    subjectName: 'Tabiatshunoslik',
    colorKey: 'amber',
    groups: ['2-A', '2-B', '4-A'],
    phone: '+998 90 333 44 55',
    email: 'gozal.yuldasheva@sunrise.uz',
  },
  {
    id: 'tch-4',
    firstName: 'Azizbek',
    lastName: 'Tursunov',
    avatarUrl: 'https://i.pravatar.cc/200?img=15',
    subjectName: 'Dasturlash',
    colorKey: 'purple',
    groups: ['5-A', '5-B', '4-A'],
    phone: '+998 90 444 55 66',
    email: 'azizbek.tursunov@sunrise.uz',
  },
  {
    id: 'tch-5',
    firstName: 'Madina',
    lastName: 'Nurmatova',
    avatarUrl: 'https://i.pravatar.cc/200?img=26',
    subjectName: "Tasviriy san'at",
    colorKey: 'pink',
    groups: ['1-A', '1-B', '4-A'],
    phone: '+998 90 555 66 77',
    email: 'madina.nurmatova@sunrise.uz',
  },
]

/** Haftalik jadval: [dushanba..juma] × [vaqt, fanId] */
const SCHEDULE_GRID: { day: number; slots: [string, string][] }[] = [
  {
    day: 1,
    slots: [
      ['09:00', 'sub-1'],
      ['10:00', 'sub-2'],
      ['11:00', 'sub-3'],
      ['12:00', 'sub-4'],
    ],
  },
  {
    day: 2,
    slots: [
      ['09:00', 'sub-2'],
      ['10:00', 'sub-1'],
      ['11:00', 'sub-4'],
    ],
  },
  {
    day: 3,
    slots: [
      ['09:00', 'sub-3'],
      ['10:00', 'sub-1'],
      ['11:00', 'sub-2'],
      ['12:00', 'sub-4'],
    ],
  },
  {
    day: 4,
    slots: [
      ['09:00', 'sub-1'],
      ['10:00', 'sub-4'],
      ['11:00', 'sub-2'],
    ],
  },
  {
    day: 5,
    slots: [
      ['09:00', 'sub-2'],
      ['10:00', 'sub-3'],
      ['11:00', 'sub-1'],
      ['12:00', 'sub-4'],
    ],
  },
]

export const schedule: ScheduleItem[] = SCHEDULE_GRID.flatMap(({ day, slots }) =>
  slots.map(([time, subjectId], i): ScheduleItem => {
    const subject = subjects.find((s) => s.subjectId === subjectId)!
    const hour = Number(time.split(':')[0])
    return {
      id: `sch-${day}-${i}`,
      dayOfWeek: day,
      startTime: time,
      endTime: `${String(hour).padStart(2, '0')}:45`,
      subjectId,
      subjectName: subject.name,
      colorKey: subject.colorKey,
      teacherName: subject.teacherName,
      room: '204',
    }
  }),
)

/* -------------------------------------------------------------------------- */
/*                               AI yordamchi                                 */
/* -------------------------------------------------------------------------- */

export const aiGreeting =
  'Salom! 👋 Uy vazifangizni yaxshiroq tushunishingiz uchun yordam berishga tayyorman. Qaysi fan bo‘yicha yordam kerak?'

export const aiSubjectChips = [
  { id: 'sub-1', label: 'Matematika', colorKey: 'blue' as const, iconKey: 'calculator' },
  { id: 'sub-2', label: 'Ingliz tili', colorKey: 'green' as const, iconKey: 'languages' },
  { id: 'sub-3', label: 'Tabiatshunoslik', colorKey: 'amber' as const, iconKey: 'flask-conical' },
  { id: 'other', label: 'Boshqa fan', colorKey: 'purple' as const, iconKey: 'book-open' },
]

const AI_REPLIES: { match: RegExp; content: string; terms?: string[] }[] = [
  {
    match: /soddalash|oson|qiyin/i,
    content:
      'Vazifani soddalashtirdim:\n\n• Mashqlar soni kamaytirildi — avval 3 tasini bajarsin\n• Har bir mashq oldiga namuna qo‘shdim\n• Murakkab so‘zlarni oddiyroq so‘zlar bilan almashtirdim\n\nAvval namunani birga ko‘rib chiqing, keyin Aziza o‘xshash mashqni mustaqil bajarsin. Tugagach, birga tekshiring.',
  },
  {
    match: /tushuntir|qanday|nima uchun/i,
    content:
      'Bosqichma-bosqich tushuntiraman:\n\n1-qadam. Shartni ovoz chiqarib o‘qing va "nima topish kerak?" degan savolga javob bering.\n\n2-qadam. Berilgan ma‘lumotlarni yozib oling — bu chalkashib ketmaslikka yordam beradi.\n\n3-qadam. Qaysi qoida kerakligini eslang. Darslikdagi namunaga qarash mumkin.\n\n4-qadam. Yechimni yozing va javobni shart bilan solishtiring: mantiqan to‘g‘rimi?\n\nMuhim: javobni o‘zingiz aytib bermang. Aziza qiynalsa — savol bering: "bu yerda nima o‘zgardi?"',
    terms: ['shart', 'yechim', 'tekshirish'],
  },
  {
    match: /yech|javob|natija/i,
    content:
      '⚠️ Bu yechim faqat tekshirish uchun. Aziza avval o‘zi urinib ko‘rsin — mustaqil yechilgan bitta masala ko‘chirilgan o‘nta masaladan foydaliroq.\n\nYechim:\n1) Shartdan ma‘lum: umumiy son va bo‘lingan qismlar soni\n2) Har bir qism = umumiy ÷ qismlar soni\n3) Hisoblash: natijani yozamiz\n4) Tekshirish: qism × qismlar soni = umumiy bo‘lishi kerak\n\nAgar javob mos kelmasa — 2-qadamga qayting.',
  },
  {
    match: /matematika|misol|masala/i,
    content:
      'Matematika bo‘yicha yordam beraman. Aziza hozir "Kasrlar" mavzusida qiynalmoqda (62%).\n\nNima qila olaman:\n• Uy vazifasini soddalashtirish\n• Mavzuni bosqichma-bosqich tushuntirish\n• Uyda o‘ynash mumkin bo‘lgan mashq taklif qilish\n\nQaysi biri kerak?',
    terms: ['kasr', 'surat', 'maxraj'],
  },
  {
    match: /ingliz|english|so'z/i,
    content:
      'Ingliz tili — Azizaning kuchli tomoni (91%). So‘z boyligini mustahkamlash uchun:\n\n• Kartochka usuli: bir tomonda inglizcha, ikkinchisida o‘zbekcha\n• Har kuni 10 daqiqa, ertasi kuni albatta takrorlash\n• Yangi so‘zni uy jihozlariga yopishtirib qo‘yish\n\nUnit 6 so‘zlari bo‘yicha mashq tuzib beraymi?',
  },
  {
    match: /tabiat|o'simlik|biolog/i,
    content:
      'Tabiatshunoslikda "O‘simliklar" mavzusi bo‘yicha natija 58% — atamalarni eslab qolishda qiyinchilik bor.\n\nEng samarali usul — kitob emas, jonli misol:\n1) Uydagi gulni stolga qo‘ying\n2) Har bir qismni barmoq bilan ko‘rsatib nomlang\n3) "Bu qism nima qiladi?" deb so‘rang — o‘zi javob topsin\n4) Keyin daftarga chizsin\n\nBu mavzu uchun soddalashtirilgan variant tayyorlaymi?',
    terms: ['ildiz', 'poya', 'barg', 'fotosintez'],
  },
]

const AI_FALLBACK =
  'Savolingizni tushundim. Quyidagilar bo‘yicha yordam bera olaman:\n\n• Uy vazifasini soddalashtirish\n• Mavzuni bosqichma-bosqich tushuntirish\n• Yechim namunasini ko‘rsatish (tekshirish uchun)\n• Aziza uchun uyda bajariladigan mashq taklif qilish\n\nQaysi biri kerak?'

export function aiReply(message: string): { content: string; terms?: string[] } {
  const found = AI_REPLIES.find((r) => r.match.test(message))
  return found ? { content: found.content, terms: found.terms } : { content: AI_FALLBACK }
}

/** Uy vazifasi ekranidagi 3 ta AI tugmasi natijasi */
export function aiHomeworkResult(homeworkId: string, mode: 'SIMPLIFY' | 'EXPLAIN' | 'SOLVE') {
  const hw = homework.find((h) => h.id === homeworkId)
  const title = hw?.title ?? 'Uy vazifasi'

  if (mode === 'SIMPLIFY') {
    return {
      mode,
      content: `"${title}" — soddalashtirilgan variant:\n\n• Topshiriqlar soni kamaytirildi, eng muhimi qoldirildi\n• Har bir qadam oldiga namuna qo‘shildi\n• Murakkab atamalar oddiy so‘zlar bilan tushuntirildi\n\nMaqsad — kamroq material, lekin to‘liq tushunish.`,
      steps: [
        'Shartni birga ovoz chiqarib o‘qing',
        'Namunani ko‘rib chiqing — har qadamda "nega shunday?" deb so‘rang',
        'Birinchi topshiriqni birga bajaring',
        'Qolganini mustaqil bajarsin, siz faqat tekshiring',
      ],
    }
  }

  if (mode === 'EXPLAIN') {
    return {
      mode,
      content: `"${title}" ni Azizaga qanday tushuntirish kerak:\n\n1-qadam. Shartni ikki marta o‘qing. "Nima berilgan? Nima topish kerak?" — ikkalasini yozib oling.\n\n2-qadam. Mavzu bo‘yicha qoidani eslang. Darslikdagi namunaga qarash — ko‘chirish emas, o‘rganish.\n\n3-qadam. Birinchi topshiriqni birga bajaring, siz faqat savol bering.\n\n4-qadam. Qolganini o‘zi bajarsin. Tugagach, javobni shart bilan solishtiring.\n\nJavobni aytib bermang — savol bering: "keyingi qadam nima bo‘lishi mumkin?"`,
      steps: undefined,
    }
  }

  return {
    mode,
    warning:
      'Bu yechim faqat tekshirish uchun. Farzandingiz avval o‘zi urinib ko‘rsin — mustaqil yechilgan bitta topshiriq ko‘chirilgan o‘ntadan foydaliroq.',
    content: `"${title}" — yechim namunasi:\n\n1) Shartdan ma‘lum bo‘lgan ma‘lumotlarni ajratamiz\n2) Kerakli qoida yoki formulani qo‘llaymiz\n3) Har bir qadamni izohlab yozamiz\n4) Javobni shart bilan tekshiramiz — mantiqan to‘g‘ri kelishi kerak\n\nAgar Aziza boshqa javob olgan bo‘lsa, qayerda farq qilganini birga toping — xatoni topish ham o‘rganishdir.`,
    steps: undefined,
  }
}

export const initialAiThread: AiMessage[] = [
  { id: 'ai-0', author: 'AI', content: aiGreeting, createdAt: at(10, 0) },
]
