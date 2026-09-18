import { ScrollView, useWindowDimensions, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Badge,
  Card,
  DonutRing,
  Icon,
  IconTile,
  LineChart,
  NoteCard,
  ProgressBar,
  ScreenHeader,
  SectionHeader,
  Skeleton,
  Txt,
} from '@/ui'
import { accent, colors, layout, radius, spacing } from '@/theme'
import { useSubjectDetail } from '@/api/queries'
import { useActiveChild } from '@/store/session'

function scoreTone(score: number) {
  if (score >= 85) return 'green' as const
  if (score >= 70) return 'blue' as const
  if (score >= 60) return 'amber' as const
  return 'red' as const
}

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const child = useActiveChild()
  const { data, isLoading } = useSubjectDetail(child?.id, id)

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Fan" />
        <View style={{ paddingHorizontal: layout.screenPadding, gap: spacing.md }}>
          <Skeleton height={150} style={{ borderRadius: radius.card }} />
          <Skeleton height={220} style={{ borderRadius: radius.card }} />
        </View>
      </View>
    )
  }

  const chartWidth = width - layout.screenPadding * 2 - spacing.base * 2

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={data.name} subtitle={data.teacherName} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.base,
        }}
      >
        {/* Umumiy natija */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
            <DonutRing value={data.score} size={96} colorKey={data.colorKey} />
            <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
              <IconTile subjectId={data.subjectId} colorKey={data.colorKey} size={36} />
              <Txt variant="bodyMedium">Joriy natija</Txt>
              <Txt variant="small" color={data.delta >= 0 ? colors.success : colors.danger}>
                {data.delta > 0 ? '+' : ''}
                {data.delta}% oldingi davrga nisbatan
              </Txt>
            </View>
          </View>
        </Card>

        {/* Kuchli / e'tibor kerak */}
        <Card>
          <SectionHeader title="Tahlil" />
          {data.strengths.length ? (
            <View style={{ gap: spacing.sm, marginBottom: spacing.base }}>
              <Txt variant="smallMedium" color={colors.success}>
                Yaxshi o'zlashtirilgan
              </Txt>
              {data.strengths.map((item) => (
                <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Icon name="check-circle" size={16} color={colors.success} />
                  <Txt variant="small">{item}</Txt>
                </View>
              ))}
            </View>
          ) : null}

          {data.needsWork.length ? (
            <View style={{ gap: spacing.sm }}>
              <Txt variant="smallMedium" color={colors.warning}>
                E'tibor kerak
              </Txt>
              {data.needsWork.map((item) => (
                <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Icon name="alert-triangle" size={16} color={colors.warning} />
                  <Txt variant="small">{item}</Txt>
                </View>
              ))}
            </View>
          ) : null}

          {data.teacherComment ? (
            <NoteCard tone="blue" icon="message-circle" title="O'qituvchi izohi" style={{ marginTop: spacing.base }}>
              {data.teacherComment}
            </NoteCard>
          ) : null}
        </Card>

        {/* Mavzular bo'yicha */}
        <Card>
          <SectionHeader title="Mavzular bo'yicha" />
          <View style={{ gap: spacing.md }}>
            {data.byTopic.map((topic) => (
              <View key={topic.topicId} style={{ gap: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                  <Txt variant="small" style={{ flex: 1 }} numberOfLines={1}>
                    {topic.title}
                  </Txt>
                  <Txt variant="smallMedium" color={accent(scoreTone(topic.score)).main}>
                    {topic.score}%
                  </Txt>
                </View>
                <ProgressBar value={topic.score} colorKey={scoreTone(topic.score)} height={6} />
              </View>
            ))}
          </View>
        </Card>

        {/* Dinamika */}
        <Card>
          <SectionHeader title="Dinamika" />
          <LineChart data={data.trend} width={chartWidth} height={150} colorKey={data.colorKey} />
        </Card>

        {/* So'nggi baholar */}
        <Card padded={false}>
          <View style={{ padding: spacing.base, paddingBottom: 0 }}>
            <SectionHeader title="So'nggi baholar" />
          </View>
          {data.recentGrades.map((grade, index) => (
            <View
              key={grade.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: 12,
                paddingHorizontal: spacing.base,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.border,
              }}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt variant="bodyMedium" numberOfLines={1}>
                  {grade.topic ?? grade.type}
                </Txt>
                <Txt variant="tiny">
                  {grade.type} · {grade.date}
                </Txt>
              </View>
              <Badge label={String(grade.value)} colorKey={scoreTone(grade.value)} />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  )
}
