import { useState } from 'react'
import { View } from 'react-native'
import { Badge, Button, Card, IconTile, NoteCard, Txt } from '@/ui'
import { accent, colors, radius, spacing } from '@/theme'
import { useSetRecommendationStatus } from '@/api/queries'
import type { CognitiveTask } from '@/api/types'

/** ⭐ AI tavsiya qilgan kognitiv rivojlantiruvchi topshiriq */
export function CognitiveCard({ task }: { task: CognitiveTask }) {
  const tone = accent(task.colorKey)
  const setStatus = useSetRecommendationStatus()
  const [expanded, setExpanded] = useState(false)

  const statusMeta =
    task.status === 'DONE'
      ? { label: 'Bajarildi', color: 'green' as const }
      : task.status === 'IN_PROGRESS'
        ? { label: 'Bajarilmoqda', color: 'blue' as const }
        : { label: 'Yangi taklif', color: 'amber' as const }

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <IconTile name="sparkles" colorKey={task.colorKey} size={40} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodySemibold" numberOfLines={2}>
            {task.title}
          </Txt>
          <Txt variant="caption">
            {task.areaLabel} · {task.durationMinutes} daqiqa
          </Txt>
        </View>
        <Badge label={statusMeta.label} colorKey={statusMeta.color} size="sm" />
      </View>

      <Txt variant="small" style={{ marginTop: spacing.md }}>
        {task.description}
      </Txt>

      {/* Nega aynan shu bola uchun — eng muhim qism */}
      <NoteCard tone="amber" icon="lightbulb" title="Nega aynan shu mashq" style={{ marginTop: spacing.md }}>
        {task.rationale}
      </NoteCard>

      {expanded ? (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <Txt variant="smallMedium" color={colors.text}>
            Qanday bajarish
          </Txt>
          {task.steps.map((step, i) => (
            <View key={step} style={{ flexDirection: 'row', gap: spacing.sm }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: radius.pill,
                  backgroundColor: tone.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Txt variant="tiny" color={tone.main}>
                  {i + 1}
                </Txt>
              </View>
              <Txt variant="small" style={{ flex: 1 }}>
                {step}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.base }}>
        <Button
          label={expanded ? 'Yopish' : 'Qadamlarni ko‘rish'}
          variant="secondary"
          size="sm"
          onPress={() => setExpanded((v) => !v)}
        />
        {task.status !== 'DONE' ? (
          <Button
            label={task.status === 'SUGGESTED' ? 'Boshlash' : 'Bajarildi'}
            size="sm"
            onPress={() =>
              setStatus.mutate({
                id: task.id,
                status: task.status === 'SUGGESTED' ? 'IN_PROGRESS' : 'DONE',
              })
            }
          />
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
        <Badge
          label={task.withParent ? 'Ota-ona bilan' : 'Mustaqil'}
          colorKey={task.withParent ? 'purple' : 'teal'}
          size="sm"
        />
        <Badge
          label={
            task.difficulty === 'EASY' ? 'Oson' : task.difficulty === 'HARD' ? 'Qiyin' : "O'rtacha"
          }
          colorKey={task.difficulty === 'EASY' ? 'green' : task.difficulty === 'HARD' ? 'amber' : 'blue'}
          size="sm"
        />
      </View>
    </Card>
  )
}
