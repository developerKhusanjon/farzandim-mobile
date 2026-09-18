import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, Badge, Card, DonutRing, EmptyState, Txt } from '@/ui'
import { CharacterSection } from '@/features/progress/character-section'
import { InterestsSection } from '@/features/progress/interests-section'
import { SubjectsSection } from '@/features/progress/subjects-section'
import { SegmentedControl } from '@/ui'
import { colors, layout, spacing } from '@/theme'
import { useActiveChild, useIsStandalone } from '@/store/session'

type Tab = 'subjects' | 'character' | 'interests'

const TABS: { value: Tab; label: string }[] = [
  { value: 'subjects', label: 'Fanlar' },
  { value: 'character', label: 'Xarakter' },
  { value: 'interests', label: 'Qiziqishlar' },
]

export default function ProgressScreen() {
  const insets = useSafeAreaInsets()
  const child = useActiveChild()
  const standalone = useIsStandalone()
  const [tab, setTab] = useState<Tab>('subjects')

  if (standalone || !child) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + spacing.xl }}>
        <EmptyState
          icon="graduation-cap"
          title="Maktab ulanmagan"
          description="O'zlashtirish ma'lumotlari maktab orqali ulangandan keyin ko'rinadi. Hozircha AI yordamchidan foydalanishingiz mumkin."
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + spacing.sm, paddingHorizontal: layout.screenPadding }}>
        <Txt variant="h1">O'zlashtirish</Txt>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingTop: spacing.base,
          paddingBottom: layout.tabBarHeight + insets.bottom + spacing.xl,
          gap: spacing.lg,
        }}
      >
        {/* O'quvchi sarlavhasi + uchta asosiy ko'rsatkich (mockup №4) */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar
              uri={child.avatarUrl}
              firstName={child.firstName}
              lastName={child.lastName}
              size="xl"
            />
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              <Txt variant="h2" numberOfLines={1}>
                {child.firstName} {child.lastName}
              </Txt>
              <Txt variant="caption">
                {child.gradeLevel}-sinf, {child.groupName}
              </Txt>
              <Badge label="Faol" colorKey="green" size="sm" />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: spacing.lg,
              paddingTop: spacing.base,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            {[
              { value: child.academicScore, delta: child.academicDelta, label: "O'zlashtirish", key: 'blue' as const },
              { value: child.activityScore, delta: child.activityDelta, label: 'Faollik', key: 'green' as const },
              { value: child.attendanceRate, delta: child.attendanceDelta, label: 'Davomat', key: 'teal' as const },
            ].map((stat) => (
              <View key={stat.label} style={{ alignItems: 'center', gap: 6 }}>
                <DonutRing value={stat.value} size={76} colorKey={stat.key} />
                <Txt variant="tiny">{stat.label}</Txt>
                <Txt
                  variant="tiny"
                  color={stat.delta >= 0 ? colors.success : colors.danger}
                >
                  {stat.delta > 0 ? '+' : ''}
                  {stat.delta}%
                </Txt>
              </View>
            ))}
          </View>
        </Card>

        <SegmentedControl value={tab} options={TABS} onChange={setTab} />

        {tab === 'subjects' ? <SubjectsSection childId={child.id} /> : null}
        {tab === 'character' ? <CharacterSection childId={child.id} /> : null}
        {tab === 'interests' ? <InterestsSection childId={child.id} /> : null}
      </ScrollView>
    </View>
  )
}
