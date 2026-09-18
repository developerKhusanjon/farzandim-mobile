import { useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { router } from 'expo-router'
import { Card, IconTile, Icon, LineChart, ProgressBar, SectionHeader, SegmentedControl, Skeleton, Txt } from '@/ui'
import { colors, layout, spacing } from '@/theme'
import { useProgressTrend, useSubjects } from '@/api/queries'
import type { TrendPeriod } from '@/api/types'

const PERIODS: { value: TrendPeriod; label: string }[] = [
  { value: 'WEEK', label: 'Haftalik' },
  { value: 'MONTH', label: 'Oylik' },
  { value: 'YEAR', label: 'Yillik' },
]

/** Mockup №5 — dinamika grafigi + fanlar bo'yicha natija */
export function SubjectsSection({ childId }: { childId: string }) {
  const { width } = useWindowDimensions()
  const [period, setPeriod] = useState<TrendPeriod>('WEEK')
  const { data: trend, isLoading: trendLoading } = useProgressTrend(childId, period)
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects(childId)

  const chartWidth = width - layout.screenPadding * 2 - spacing.base * 2

  return (
    <View style={{ gap: spacing.lg }}>
      <SegmentedControl value={period} options={PERIODS} onChange={setPeriod} />

      <Card>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.md,
          }}
        >
          <Icon name="chevron-left" size={18} color={colors.textMuted} />
          <Txt variant="smallMedium" color={colors.text}>
            {trend?.rangeLabel ?? '—'}
          </Txt>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </View>

        {trendLoading || !trend ? (
          <Skeleton height={150} />
        ) : (
          <LineChart data={trend.points} width={chartWidth} height={160} colorKey="blue" />
        )}
      </Card>

      <View>
        <SectionHeader title="Fanlar bo'yicha" />
        <Card padded={false}>
          {subjectsLoading ? (
            <View style={{ padding: spacing.base, gap: spacing.md }}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} height={40} />
              ))}
            </View>
          ) : (
            subjects.map((subject, index) => (
              <View
                key={subject.subjectId}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  paddingVertical: 12,
                  paddingHorizontal: spacing.base,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: colors.border,
                }}
                onTouchEnd={() => router.push(`/subject/${subject.subjectId}`)}
              >
                <IconTile subjectId={subject.subjectId} colorKey={subject.colorKey} size={36} />
                <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Txt variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
                      {subject.name}
                    </Txt>
                    <Txt variant="smallMedium" color={colors.text}>
                      {subject.score}%
                    </Txt>
                    <Txt
                      variant="tiny"
                      color={subject.delta >= 0 ? colors.success : colors.danger}
                      style={{ width: 30, textAlign: 'right' }}
                    >
                      {subject.delta > 0 ? '+' : ''}
                      {subject.delta}%
                    </Txt>
                  </View>
                  <ProgressBar value={subject.score} colorKey={subject.colorKey} height={6} />
                </View>
                <Icon name="chevron-right" size={16} color={colors.textMuted} />
              </View>
            ))
          )}
        </Card>
      </View>
    </View>
  )
}
