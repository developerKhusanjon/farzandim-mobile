/**
 * Farzandim — mobil dizayn tokenlari.
 *
 * Manba: docs/01-design-system.md — web bilan AYNAN bir xil ranglar.
 * Faqat mobilga xos o'lchamlar (radius, tegish maydoni, tab bar) farq qiladi.
 */

export const colors = {
  /* Brend */
  brand: '#2F6BFF',
  brandDark: '#1E5BEF',
  brandSoft: '#EAF1FF',
  green: '#33C15E',
  greenSoft: '#E8F8EE',

  /* Ink / navy */
  ink: '#12294B',
  navy: '#0F2440',

  /* Matn */
  text: '#12294B',
  textSecondary: '#5B6B85',
  textMuted: '#93A1B8',
  textOnDark: '#FFFFFF',
  textOnDarkDim: 'rgba(255,255,255,0.78)',

  /* Yuza */
  bg: '#F4F8FF',
  card: '#FFFFFF',
  subtle: '#F7FAFF',
  border: '#E6EDF8',
  borderStrong: '#D5E0F2',

  /* Semantik */
  success: '#22B24E',
  successSoft: '#E8F8EE',
  warning: '#F5A623',
  warningSoft: '#FEF6E7',
  danger: '#EF5A5A',
  dangerSoft: '#FDEEEE',
  info: '#2F6BFF',
  infoSoft: '#EAF1FF',

  /* Shaffof qatlamlar */
  overlay: 'rgba(18,41,75,0.28)',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const

/** Fan va kategoriya aksentlari — web'dagi ACCENTS bilan bir xil */
export const accents = {
  blue: { main: '#2F6BFF', soft: '#EAF1FF' },
  green: { main: '#33C15E', soft: '#E8F8EE' },
  amber: { main: '#F5A623', soft: '#FEF6E7' },
  purple: { main: '#8B7CF6', soft: '#F0EDFE' },
  pink: { main: '#F472B6', soft: '#FDEEF6' },
  teal: { main: '#2DC7C0', soft: '#E4F8F7' },
  red: { main: '#EF5A5A', soft: '#FDEEEE' },
} as const

export type AccentKey = keyof typeof accents

export function accent(key: AccentKey | string | undefined) {
  return accents[(key as AccentKey) in accents ? (key as AccentKey) : 'blue']
}

/** Natijaga qarab rang — docs/02-data-model.md dagi qoida bilan bir xil */
export function scoreAccent(score: number): AccentKey {
  if (score >= 85) return 'green'
  if (score >= 70) return 'blue'
  if (score >= 60) return 'amber'
  return 'red'
}

/** Gradientlar — `expo-linear-gradient` uchun rang massivlari */
export const gradients = {
  brand: ['#2F6BFF', '#33C15E'] as const,
  blue: ['#4F8BFF', '#1E6BF1'] as const,
  green: ['#55D97C', '#22B24E'] as const,
  /** Bosh sahifadagi yashil banner */
  banner: ['#5BD98A', '#2FB86B'] as const,
  /** AI kartalari */
  ai: ['#8B7CF6', '#6D5DF0'] as const,
  /** Kirish ekranining orqa foni */
  auth: ['#EFF6FF', '#F4F8FF', '#EAF8F0'] as const,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  card: 16,
  panel: 20,
  xl: 24,
  pill: 999,
} as const

/**
 * Soyalar. iOS `shadow*`, Android `elevation` — ikkalasi ham beriladi.
 * Web'dagi `0 2px 12px rgba(16,40,80,.06)` ning mobil ekvivalenti.
 */
export const shadows = {
  card: {
    shadowColor: '#10284F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  pop: {
    shadowColor: '#10284F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 12,
    elevation: 4,
  },
  tabBar: {
    shadowColor: '#10284F',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 12,
  },
} as const

/**
 * Shriftlar. `Poppins` — sarlavha, `Inter` — matn (web bilan bir xil juftlik).
 * Fayl nomlari `expo-font` bilan yuklanadigan kalitlar.
 */
export const fonts = {
  display: 'Poppins_600SemiBold',
  displayBold: 'Poppins_700Bold',
  displayMedium: 'Poppins_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const

/** Tayyor matn uslublari — komponentlarda shu nomlar bilan ishlatiladi */
export const text = {
  display: { fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 34, color: colors.text },
  h1: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.text },
  h2: { fontFamily: fonts.display, fontSize: 18, lineHeight: 24, color: colors.text },
  h3: { fontFamily: fonts.display, fontSize: 16, lineHeight: 22, color: colors.text },
  bodyLg: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.text },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 21, color: colors.text },
  bodySemibold: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
  },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  smallMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  tiny: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15, color: colors.textMuted },
  /** Katta metrikalar — donut markazi, stat raqamlari */
  metric: { fontFamily: fonts.display, fontSize: 24, lineHeight: 28, color: colors.text },
  metricLg: { fontFamily: fonts.displayBold, fontSize: 32, lineHeight: 38, color: colors.text },
} as const

/** Layout konstantalari */
export const layout = {
  screenPadding: 16,
  cardPadding: 16,
  /** Minimal tegish maydoni (Apple HIG: 44pt) */
  touchTarget: 44,
  tabBarHeight: 60,
} as const

/** Animatsiya davomiyligi (ms) */
export const motion = {
  fast: 150,
  base: 220,
  slow: 320,
  chart: 900,
} as const
