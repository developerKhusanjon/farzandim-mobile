import { View } from 'react-native'
import { router } from 'expo-router'
import { Badge, Card, Icon, IconTile, SectionHeader, Skeleton, Txt } from '@/ui'
import { accent, colors, radius, spacing } from '@/theme'
import { useAbilities, useInterestAdvice, useInterests } from '@/api/queries'

interface HomeInterestsPreviewProps {
  childId?: string
}

/**
 * Bosh sahifadagi "Qiziqishlar va qobiliyatlar" ko'rinishi.
 * Farzandning to'garaklari, sevimli mashg'ulotlari va iqtidorini
 * ota-onaga oson va tushunarli tarzda ko'rsatadi.
 */
export function HomeInterestsPreview({ childId }: HomeInterestsPreviewProps) {
  const { data: interests = [], isLoading: interestsLoading } = useInterests(childId)
  const { data: abilities = [], isLoading: abilitiesLoading } = useAbilities(childId)
  const { data: advice } = useInterestAdvice(childId)

  if (!childId) return null
  const isLoading = interestsLoading || abilitiesLoading

  const topInterests = interests.slice(0, 3)

  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeader
        title="Qiziqishlar va qobiliyatlar"
        actionLabel="Barchasi"
        onAction={() => router.push('/interests')}
      />

      <Card
        padded={false}
        onPress={() => router.push('/interests')}
      >
        <View style={{ padding: spacing.base, gap: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  backgroundColor: accent('blue').soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="star" size={20} color={accent('blue').main} />
              </View>
              <View>
                <Txt variant="bodySemibold" color={colors.text}>
                  Iqtidor va to‘garaklar
                </Txt>
                <Txt variant="caption" color={colors.textSecondary}>
                  {interests.length} ta qiziqish aniqlangan
                </Txt>
              </View>
            </View>

            <Badge label="To‘garaklar" colorKey="blue" size="sm" />
          </View>

          {isLoading ? (
            <View style={{ gap: spacing.sm }}>
              {[0, 1].map((i) => (
                <Skeleton key={i} height={46} style={{ borderRadius: radius.sm }} />
              ))}
            </View>
          ) : (
            <View style={{ gap: spacing.sm }}>
              {topInterests.map((interest) => {
                const tone = accent(interest.colorKey)
                return (
                  <View
                    key={interest.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      paddingVertical: 6,
                    }}
                  >
                    <IconTile name={interest.iconKey} colorKey={interest.colorKey} size={36} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt variant="bodySemibold" numberOfLines={1} color={colors.text}>
                        {interest.label}
                      </Txt>
                      <Txt variant="caption" numberOfLines={1} color={colors.textSecondary}>
                        {interest.description}
                      </Txt>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: radius.pill,
                        backgroundColor: tone.soft,
                      }}
                    >
                      <Txt variant="caption" color={tone.main} style={{ fontFamily: 'Inter_600SemiBold' }}>
                        {interest.level}%
                      </Txt>
                    </View>
                  </View>
                )
              })}

              {advice?.advice ? (
                <View
                  style={{
                    backgroundColor: colors.bg,
                    borderRadius: radius.md,
                    padding: spacing.md,
                    marginTop: 4,
                  }}
                >
                  <Txt variant="caption" color={colors.textSecondary} numberOfLines={2}>
                    ✨ AI maslahati: {advice.advice}
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
            <Txt variant="caption" color={accent('blue').main} style={{ fontFamily: 'Inter_600SemiBold' }}>
              Barcha qiziqish va qobiliyatlarni ko‘rish
            </Txt>
            <Icon name="chevron-right" size={14} color={accent('blue').main} />
          </View>
        </View>
      </Card>
    </View>
  )
}
