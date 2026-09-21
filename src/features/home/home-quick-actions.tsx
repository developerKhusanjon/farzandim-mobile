import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { Card, Icon, type IconKey, Txt } from '@/ui'
import { accent, colors, radius, spacing } from '@/theme'
import type { AccentKey } from '@/theme'

interface QuickActionItem {
  id: string
  title: string
  subtitle: string
  icon: IconKey
  colorKey: AccentKey
  route: string
}

const ACTIONS: QuickActionItem[] = [
  {
    id: 'schedule',
    title: 'Dars jadvali',
    subtitle: 'Bugungi darslar',
    icon: 'calendar-days',
    colorKey: 'amber',
    route: '/school/schedule',
  },
  {
    id: 'character',
    title: 'Intellekt & xarakter',
    subtitle: 'Kuchli tomonlari',
    icon: 'brain',
    colorKey: 'purple',
    route: '/character',
  },
  {
    id: 'interests',
    title: 'Qiziqishlar',
    subtitle: 'Iqtidor & to‘garak',
    icon: 'star',
    colorKey: 'blue',
    route: '/interests',
  },
  {
    id: 'recommendations',
    title: 'AI tavsiyalari',
    subtitle: 'Kognitiv mashqlar',
    icon: 'sparkles',
    colorKey: 'teal',
    route: '/recommendations',
  },
]

/**
 * Keksa ota-onalar va barcha foydalanuvchilar uchun
 * asosiy 4 bo'limga oson va to'g'ridan-to'g'ri o'tish bloki.
 */
export function HomeQuickActions() {
  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        {ACTIONS.slice(0, 2).map((item) => (
          <ActionTile key={item.id} item={item} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        {ACTIONS.slice(2, 4).map((item) => (
          <ActionTile key={item.id} item={item} />
        ))}
      </View>
    </View>
  )
}

function ActionTile({ item }: { item: QuickActionItem }) {
  const tone = accent(item.colorKey)

  return (
    <Card
      style={{
        flex: 1,
        padding: spacing.md,
      }}
      padded={false}
      onPress={() => router.push(item.route as any)}
    >
      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.md,
              backgroundColor: tone.soft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={item.icon} size={22} color={tone.main} strokeWidth={2.2} />
          </View>
          <Icon name="arrow-right" size={16} color={colors.textMuted} />
        </View>

        <View style={{ gap: 2, marginTop: 2 }}>
          <Txt variant="bodySemibold" numberOfLines={1} color={colors.text}>
            {item.title}
          </Txt>
          <Txt variant="caption" numberOfLines={1} color={colors.textSecondary}>
            {item.subtitle}
          </Txt>
        </View>
      </View>
    </Card>
  )
}
