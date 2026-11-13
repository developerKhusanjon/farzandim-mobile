import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, EmptyState, IconTile, ScreenHeader, SegmentedControl, Skeleton, Txt } from '@/ui'
import { colors, layout, radius, spacing } from '@/theme'
import { useSchedule } from '@/api/queries'
import { useActiveChild } from '@/store/session'

const DAYS = [
  { value: '1', label: 'Du' },
  { value: '2', label: 'Se' },
  { value: '3', label: 'Ch' },
  { value: '4', label: 'Pa' },
  { value: '5', label: 'Ju' },
]

/** Dars jadvali — faqat ko'rish */
export default function ScheduleScreen() {
  const insets = useSafeAreaInsets()
  const todayIndex = new Date().getDay()
  const [day, setDay] = useState(String(todayIndex >= 1 && todayIndex <= 5 ? todayIndex : 1))
  const childId = useActiveChild()?.id
  const { data: schedule = [], isLoading } = useSchedule(childId)

  const items = schedule.filter((s) => String(s.dayOfWeek) === day)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Dars jadvali" />

      <View style={{ paddingHorizontal: layout.screenPadding, paddingBottom: spacing.md }}>
        <SegmentedControl value={day} options={DAYS} onChange={setDay} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.md,
        }}
      >
        {isLoading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} height={68} style={{ borderRadius: radius.card }} />)
        ) : items.length === 0 ? (
          <Card>
            <EmptyState icon="calendar-days" title="Bu kunda dars yo'q" />
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ alignItems: 'center', width: 46 }}>
                  <Txt variant="smallMedium" color={colors.text}>
                    {item.startTime}
                  </Txt>
                  <Txt variant="tiny">{item.endTime}</Txt>
                </View>
                <View style={{ width: 1, height: 36, backgroundColor: colors.border }} />
                <IconTile subjectId={item.subjectId} colorKey={item.colorKey} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt variant="bodyMedium" numberOfLines={1}>
                    {item.subjectName}
                  </Txt>
                  <Txt variant="caption" numberOfLines={1}>
                    {item.room ? `${item.teacherName} · ${item.room}-xona` : item.teacherName}
                  </Txt>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  )
}
