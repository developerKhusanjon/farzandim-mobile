import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { Badge, Card, IconTile, SectionHeader, Skeleton, Txt } from '@/ui'
import { colors, radius, spacing } from '@/theme'
import { useSchedule } from '@/api/queries'

const DAY_NAMES = ['', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']

/**
 * Bosh sahifadagi Dars jadvali bloki.
 * Ota-ona farzandining bugungi darslarini bir qarashda ko'rishi mumkin.
 */
export function HomeSchedulePreview() {
  const { data: schedule = [], isLoading } = useSchedule()

  const currentDayIndex = new Date().getDay()
  // Agar yakshanba (0) yoki shanba (6) bo'lsa, dushanba (1) ko'rsatamiz
  const targetDay = currentDayIndex >= 1 && currentDayIndex <= 5 ? currentDayIndex : 1
  const todayLessons = schedule.filter((s) => s.dayOfWeek === targetDay)
  const dayName = DAY_NAMES[targetDay] || 'Bugungi'

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader
        title="Dars jadvali"
        actionLabel="Barchasi"
        onAction={() => router.push('/school/schedule')}
      />

      <Card padded={false}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing.base,
            paddingTop: spacing.md,
            paddingBottom: spacing.xs,
          }}
        >
          <Txt variant="caption" color={colors.textSecondary}>
            {dayName.toUpperCase()} KUNI DARS REJASI
          </Txt>
          <Badge label={`${todayLessons.length} ta dars`} colorKey="amber" size="sm" />
        </View>

        {isLoading ? (
          <View style={{ padding: spacing.base, gap: spacing.md }}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={48} style={{ borderRadius: radius.md }} />
            ))}
          </View>
        ) : todayLessons.length === 0 ? (
          <View style={{ padding: spacing.lg, alignItems: 'center' }}>
            <Txt variant="body" color={colors.textMuted}>
              Bugun darslar mavjud emas
            </Txt>
          </View>
        ) : (
          todayLessons.slice(0, 4).map((lesson, index) => (
            <Pressable
              key={lesson.id}
              onPress={() => router.push('/school/schedule')}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: 12,
                paddingHorizontal: spacing.base,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: pressed ? colors.subtle : colors.transparent,
              })}
            >
              {/* Vaqt ko'rsatkichi */}
              <View style={{ alignItems: 'center', width: 50 }}>
                <Txt variant="smallMedium" color={colors.text}>
                  {lesson.startTime}
                </Txt>
                <Txt variant="tiny" color={colors.textMuted}>
                  {lesson.endTime}
                </Txt>
              </View>

              <View style={{ width: 1, height: 32, backgroundColor: colors.border }} />

              <IconTile subjectId={lesson.subjectId} colorKey={lesson.colorKey} size={36} />

              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt variant="bodySemibold" numberOfLines={1} color={colors.text}>
                  {lesson.subjectName}
                </Txt>
                <Txt variant="caption" numberOfLines={1} color={colors.textSecondary}>
                  {lesson.teacherName} · {lesson.room}-xona
                </Txt>
              </View>
            </Pressable>
          ))
        )}
      </Card>
    </View>
  )
}
