import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { Badge, Card, Icon, ProgressBar, SectionHeader, Skeleton, Txt } from '@/ui'
import { accent, colors, radius, spacing } from '@/theme'
import { useCharacter, useStrengths } from '@/api/queries'

interface HomeCharacterPreviewProps {
  childId?: string
}

/**
 * Bosh sahifadagi "Intellekt va xarakter" ko'rinishi.
 * Farzandning shaxsiyati, aqliy salohiyati va kuchli tomonlarini
 * ota-ona oson tushunadigan shaklda ifodalaydi.
 */
export function HomeCharacterPreview({ childId }: HomeCharacterPreviewProps) {
  const { data: groups = [], isLoading } = useCharacter(childId)
  const { data: sw } = useStrengths(childId)

  if (!childId) return null

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader
        title="Intellekt va xarakter"
        actionLabel="Barchasi"
        onAction={() => router.push('/character')}
      />

      <Card
        padded={false}
        onPress={() => router.push('/character')}
      >
        <View style={{ padding: spacing.base, gap: spacing.md }}>
          {/* Yuqori xulosa qatori */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  backgroundColor: accent('purple').soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="brain" size={20} color={accent('purple').main} />
              </View>
              <View>
                <Txt variant="bodySemibold" color={colors.text}>
                  Shaxsiy ko'nikmalar
                </Txt>
                <Txt variant="caption" color={colors.textSecondary}>
                  Psixologik va aqliy tahlil
                </Txt>
              </View>
            </View>

            <Badge label="AI & O'qituvchi" colorKey="purple" size="sm" />
          </View>

          {isLoading ? (
            <View style={{ gap: spacing.sm }}>
              {[0, 1].map((i) => (
                <Skeleton key={i} height={40} style={{ borderRadius: radius.sm }} />
              ))}
            </View>
          ) : (
            <View style={{ gap: spacing.md }}>
              {/* Asosiy 3 toifa darajalari */}
              {groups.slice(0, 3).map((group) => {
                const tone = accent(group.colorKey)
                return (
                  <View key={group.category} style={{ gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Txt variant="smallMedium" color={colors.text}>
                        {group.label}
                      </Txt>
                      <Txt variant="smallMedium" color={tone.main} style={{ fontFamily: 'Inter_600SemiBold' }}>
                        {group.score}%
                      </Txt>
                    </View>
                    <ProgressBar value={group.score} colorKey={group.colorKey} height={6} />
                  </View>
                )
              })}

              {/* Qisqa izoh yoki kuchli tomon */}
              {sw?.summary ? (
                <View
                  style={{
                    backgroundColor: colors.bg,
                    borderRadius: radius.md,
                    padding: spacing.md,
                    marginTop: 2,
                  }}
                >
                  <Txt variant="caption" color={colors.textSecondary} numberOfLines={2}>
                    💡 {sw.summary}
                  </Txt>
                </View>
              ) : null}
            </View>
          )}

          {/* Pastki o'tish tugmasi */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingTop: spacing.xs,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            <Txt variant="caption" color={accent('purple').main} style={{ fontFamily: 'Inter_600SemiBold' }}>
              To‘liq xarakter tahlilini ko‘rish
            </Txt>
            <Icon name="chevron-right" size={14} color={accent('purple').main} />
          </View>
        </View>
      </Card>
    </View>
  )
}
