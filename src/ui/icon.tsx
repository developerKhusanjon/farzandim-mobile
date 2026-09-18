/**
 * Ikonka qatlami — `lucide-react-native` ustidan yupqa o'ram.
 * Ma'lumotdagi `iconKey` satrlari shu yerda komponentga bog'lanadi,
 * shunda ekranlarda `switch` yozish shart emas.
 */
import { View, type ViewStyle } from 'react-native'
import {
  Activity,
  AlertTriangle,
  Award,
  Bell,
  BookOpen,
  Brain,
  Calculator,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Code,
  Eye,
  EyeOff,
  FlaskConical,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Languages,
  Lightbulb,
  Lock,
  type LucideIcon,
  Mail,
  Megaphone,
  MessageCircle,
  Palette,
  Phone,
  Search,
  Send,
  Settings,
  Shapes,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wand2,
  X,
} from 'lucide-react-native'
import { accent, colors, radius, type AccentKey } from '@/theme'

const ICONS = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  award: Award,
  bell: Bell,
  'book-open': BookOpen,
  brain: Brain,
  calculator: Calculator,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  check: Check,
  'check-circle': CheckCircle2,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'clipboard-check': ClipboardCheck,
  clock: Clock,
  code: Code,
  eye: Eye,
  'eye-off': EyeOff,
  'flask-conical': FlaskConical,
  gift: Gift,
  'graduation-cap': GraduationCap,
  heart: Heart,
  home: Home,
  languages: Languages,
  lightbulb: Lightbulb,
  lock: Lock,
  mail: Mail,
  megaphone: Megaphone,
  'message-circle': MessageCircle,
  palette: Palette,
  phone: Phone,
  search: Search,
  send: Send,
  settings: Settings,
  shapes: Shapes,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  user: User,
  users: Users,
  'wand-2': Wand2,
  x: X,
} satisfies Record<string, LucideIcon>

export type IconKey = keyof typeof ICONS

export function Icon({
  name,
  size = 20,
  color = colors.textSecondary,
  strokeWidth = 1.9,
}: {
  name: IconKey | string
  size?: number
  color?: string
  strokeWidth?: number
}) {
  const Component = ICONS[name as IconKey] ?? BookOpen
  return <Component size={size} color={color} strokeWidth={strokeWidth} />
}

/** Fan ID'si bo'yicha barqaror ikonka — mock ma'lumot bilan mos */
const BY_SUBJECT: Record<string, IconKey> = {
  'sub-1': 'calculator',
  'sub-2': 'languages',
  'sub-3': 'flask-conical',
  'sub-4': 'code',
  'sub-5': 'book-open',
}

/**
 * Rangli kvadrat ichidagi ikonka — mockupdagi fan plitkasi.
 * Ro'yxatlarda, kartalarda va sarlavhalarda ishlatiladi.
 */
export function IconTile({
  name,
  subjectId,
  colorKey = 'blue',
  size = 40,
  style,
}: {
  name?: IconKey | string
  subjectId?: string
  colorKey?: AccentKey
  size?: number
  style?: ViewStyle
}) {
  const tone = accent(colorKey)
  const key = name ?? (subjectId ? BY_SUBJECT[subjectId] : undefined) ?? 'book-open'
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size <= 32 ? radius.sm : radius.md,
          backgroundColor: tone.soft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Icon name={key} size={Math.round(size * 0.48)} color={tone.main} />
    </View>
  )
}
