import { useState } from 'react'
import { View } from 'react-native'
import { Badge, Card, IconTile, NoteCard, ProgressBar, SegmentedControl, Skeleton, Txt } from '@/ui'
import { accent, colors, radius, spacing } from '@/theme'
import { useAbilities, useInterestAdvice, useInterests } from '@/api/queries'

type Mode = 'interests' | 'abilities'

/** Mockup №6 — Qiziqishlar va qobiliyatlar + AI tavsiyasi */
export function InterestsSection({ childId }: { childId: string }) {
  const [mode, setMode] = useState<Mode>('interests')
  const { data: interests = [], isLoading: interestsLoading } = useInterests(childId)
  const { data: abilities = [], isLoading: abilitiesLoading } = useAbilities(childId)
  const { data: advice } = useInterestAdvice(childId)

  const loading = mode === 'interests' ? interestsLoading : abilitiesLoading
  const items =
    mode === 'interests'
      ? interests.map((i) => ({
          id: i.id,
          label: i.label,
          description: i.description,
          level: i.level,
          colorKey: i.colorKey,
          iconKey: i.iconKey,
          badge: i.source === 'AI' ? 'AI' : i.source === 'TEACHER' ? "O'qituvchi" : 'Ota-ona',
        }))
      : abilities.map((a) => ({
          id: a.id,
          label: a.label,
          description: a.description,
          level: a.level,
          colorKey: a.colorKey,
          iconKey: a.iconKey,
          badge: undefined,
        }))

  return (
    <View style={{ gap: spacing.lg }}>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: 'interests', label: 'Qiziqishlar' },
          { value: 'abilities', label: 'Qobiliyatlar' },
        ]}
      />

      {loading ? (
        <View style={{ gap: spacing.md }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={76} style={{ borderRadius: radius.card }} />
          ))}
        </View>
      ) : (
        <View style={{ gap: spacing.md }}>
          {items.map((item) => {
            const tone = accent(item.colorKey)
            return (
              <Card key={item.id}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <IconTile name={item.iconKey} colorKey={item.colorKey} size={44} />
                  <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Txt variant="bodySemibold" style={{ flex: 1 }} numberOfLines={1}>
                        {item.label}
                      </Txt>
                      <Txt variant="bodySemibold" color={tone.main}>
                        {item.level}%
                      </Txt>
                    </View>
                    <Txt variant="tiny" numberOfLines={2}>
                      {item.description}
                    </Txt>
                    <ProgressBar
                      value={item.level}
                      colorKey={item.colorKey}
                      height={5}
                      style={{ marginTop: 2 }}
                    />
                  </View>
                </View>
                {item.badge ? (
                  <View style={{ marginTop: spacing.md }}>
                    <Badge
                      label={item.badge}
                      colorKey={item.badge === 'AI' ? 'teal' : 'blue'}
                      size="sm"
                    />
                  </View>
                ) : null}
              </Card>
            )
          })}
        </View>
      )}

      {/* AI tavsiyasi (mockupdagi robot kartasi) */}
      {advice ? (
        <View style={{ gap: spacing.md }}>
          <Txt variant="h3">Tavsiyalar</Txt>
          <NoteCard tone="purple" icon="sparkles" title="AI tahlili asosida">
            <Txt variant="small" color={colors.textSecondary}>
              {advice.advice}
            </Txt>
          </NoteCard>
        </View>
      ) : null}
    </View>
  )
}
