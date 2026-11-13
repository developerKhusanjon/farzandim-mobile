import { View } from 'react-native'
import { router } from 'expo-router'
import {
  Badge,
  Button,
  Card,
  Icon,
  NoteCard,
  ProgressBar,
  SectionHeader,
  Skeleton,
  Txt,
} from '@/ui'
import { accent, colors, radius, spacing } from '@/theme'
import { useCharacter, useStrengths } from '@/api/queries'
import type { CharacterGroup } from '@/api/types'

/**
 * ⭐ Ota-onaga farzandining intellekti, xulq-atvori, ijtimoiy va ijodiy
 * ko'nikmalari hamda kuchli/zaif tomonlarini ko'rsatadi.
 * Har bir raqam ostida ota-ona tushunadigan izoh bor — quruq foiz emas.
 */
function CharacterCard({ group }: { group: CharacterGroup }) {
  // Backend: AI_ANALYSIS; mock: AI. Qolganlari — o'qituvchi topshirig'i yoki kuzatuvi
  const isAi = group.source === 'AI' || group.source === 'AI_ANALYSIS'
  const tone = accent(group.colorKey)

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
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
          <Txt variant="bodySemibold" color={tone.main}>
            {group.score}
          </Txt>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="h3" numberOfLines={1}>
            {group.label}
          </Txt>
          <Txt variant="caption">
            {isAi ? 'AI tahlili' : "O'qituvchi kuzatuvi"}
          </Txt>
        </View>
        <Badge
          label={isAi ? 'AI' : "O'qituvchi"}
          colorKey={isAi ? 'teal' : 'blue'}
          size="sm"
        />
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.base }}>
        {group.traits.map((trait) => (
          <View key={trait.key} style={{ gap: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Txt variant="smallMedium" color={colors.text} style={{ flex: 1 }}>
                {trait.label}
              </Txt>
              <Txt variant="smallMedium" color={tone.main}>
                {trait.score}%
              </Txt>
            </View>
            <ProgressBar
              value={trait.score}
              colorKey={trait.score >= 80 ? 'green' : trait.score >= 65 ? 'blue' : 'amber'}
              height={5}
            />
            <Txt variant="tiny">{trait.description}</Txt>
          </View>
        ))}
      </View>

      <NoteCard tone={group.colorKey} icon="lightbulb" style={{ marginTop: spacing.base }}>
        {group.summary}
      </NoteCard>
    </Card>
  )
}

export function CharacterSection({ childId }: { childId: string }) {
  const { data: groups = [], isLoading } = useCharacter(childId)
  const { data: sw } = useStrengths(childId)

  if (isLoading) {
    return (
      <View style={{ gap: spacing.base }}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={180} style={{ borderRadius: radius.card }} />
        ))}
      </View>
    )
  }

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Kuchli va zaif tomonlar — eng muhim blok, yuqorida turadi */}
      {sw ? (
        <View style={{ gap: spacing.md }}>
          <SectionHeader title="Kuchli va zaif tomonlar" />

          <Card>
            <Txt variant="small" style={{ marginBottom: spacing.base }}>
              {sw.summary}
            </Txt>

            <View style={{ gap: spacing.md }}>
              <Txt variant="smallMedium" color={colors.success}>
                Kuchli tomonlar
              </Txt>
              {sw.strengths.map((item) => (
                <View key={item.title} style={{ flexDirection: 'row', gap: spacing.md }}>
                  <Icon name="check-circle" size={18} color={accent(item.colorKey).main} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodyMedium">{item.title}</Txt>
                    <Txt variant="tiny">{item.detail}</Txt>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.base }} />

            <View style={{ gap: spacing.md }}>
              <Txt variant="smallMedium" color={colors.warning}>
                Ustida ishlash kerak
              </Txt>
              {sw.weaknesses.map((item) => (
                <View key={item.title} style={{ flexDirection: 'row', gap: spacing.md }}>
                  <Icon name="alert-triangle" size={18} color={accent(item.colorKey).main} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodyMedium">{item.title}</Txt>
                    <Txt variant="tiny">{item.detail}</Txt>
                  </View>
                </View>
              ))}
            </View>

            <Button
              label="AI tavsiya qilgan mashqlarni ko'rish"
              variant="soft"
              icon="sparkles"
              fullWidth
              size="sm"
              style={{ marginTop: spacing.base }}
              onPress={() => router.push('/recommendations')}
            />
          </Card>
        </View>
      ) : null}

      {/* Toifalar bo'yicha batafsil */}
      <View style={{ gap: spacing.md }}>
        <SectionHeader title="Batafsil tahlil" />
        {groups.map((group) => (
          <CharacterCard key={group.category} group={group} />
        ))}
      </View>
    </View>
  )
}
