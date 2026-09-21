import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { Card, Icon, LogoMark, Txt } from '@/ui'
import { accent, colors, fonts, radius, spacing } from '@/theme'
import type { Child } from '@/api/types'

interface HomeAiBriefProps {
  child?: Child
}

const PRESET_QUESTIONS = [
  {
    id: 'q1',
    text: 'Bugungi darslar qanday o‘tdi?',
    icon: 'message-circle' as const,
    colorKey: 'purple' as const,
  },
  {
    id: 'q2',
    text: 'Bugun farzandimga qanday dalda beray?',
    icon: 'heart' as const,
    colorKey: 'pink' as const,
  },
  {
    id: 'q3',
    text: 'Qaysi fandan yordam kerak?',
    icon: 'alert-triangle' as const,
    colorKey: 'amber' as const,
  },
  {
    id: 'q4',
    text: 'Qobiliyatini qanday oshiramiz?',
    icon: 'sparkles' as const,
    colorKey: 'teal' as const,
  },
]

/**
 * AI Kundalik Xulosasi va Tayyor Savol-Tugmalar bloki.
 * Keksa ota-onalarga matn yozish shart emas — tayyor tugmani
 * bir bosish orqali sun'iy intellekt javobini olishadi.
 */
export function HomeAiBrief({ child }: { child?: Child }) {
  const childName = child?.firstName ?? 'Farzandingiz'

  const openAiWithPrompt = (prompt: string) => {
    router.push({
      pathname: '/ai',
      params: { prompt },
    })
  }

  return (
    <Card
      style={{
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: accent('purple').soft,
      }}
    >
      <View style={{ gap: spacing.md }}>
        {/* Sarlavha qismi */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: radius.pill,
                backgroundColor: accent('purple').soft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogoMark size={20} />
            </View>
            <View>
              <Txt variant="bodySemibold" color={colors.text}>
                Bugungi AI xulosasi
              </Txt>
              <Txt variant="caption" color={colors.textMuted}>
                {childName} uchun maxsus tahlil
              </Txt>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/ai')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: radius.pill,
              backgroundColor: pressed ? accent('purple').soft : colors.bg,
            })}
          >
            <Txt variant="caption" color={accent('purple').main} style={{ fontFamily: fonts.bodySemibold }}>
              AI yordamchi
            </Txt>
            <Icon name="chevron-right" size={14} color={accent('purple').main} />
          </Pressable>
        </View>

        {/* AI tahliliy xabari (Samimiy va ota-onaga dalda beruvchi) */}
        <View
          style={{
            backgroundColor: colors.bg,
            borderRadius: radius.md,
            padding: spacing.md,
            borderLeftWidth: 3,
            borderLeftColor: accent('purple').main,
          }}
        >
          <Txt variant="body" color={colors.text} style={{ lineHeight: 22 }}>
            {child?.academicScore && child.academicScore >= 80
              ? `🌟 ${childName} bugun darslarda juda faol va qunt bilan qatnashdi. Mavzularni tez o‘zlashtirmoqda. Kechki ovqat paytida uning mustaqil intilishlarini maqtab qo‘ying!`
              : `📖 ${childName} bugun matematika darsida yangi mavzuni o‘rgandi. Uy vazifasini bajarishda unga biroz qo‘llab-quvvatlash va xotirjam yondashuv kerak bo‘ladi.`}
          </Txt>
        </View>

        {/* Tayyor tavsiya savol-tugmalari */}
        <View style={{ gap: spacing.xs, marginTop: 2 }}>
          <Txt variant="caption" color={colors.textSecondary} style={{ fontFamily: fonts.bodySemibold }}>
            TAYYOR SAVOLLAR (Yozish shart emas, bosing):
          </Txt>
          <View style={{ gap: spacing.sm, marginTop: 4 }}>
            {PRESET_QUESTIONS.map((q) => {
              const tone = accent(q.colorKey)
              return (
                <Pressable
                  key={q.id}
                  onPress={() => openAiWithPrompt(q.text)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    backgroundColor: pressed ? tone.soft : colors.card,
                    borderWidth: 1,
                    borderColor: pressed ? tone.main : colors.border,
                    borderRadius: radius.md,
                    paddingVertical: 10,
                    paddingHorizontal: spacing.md,
                  })}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: radius.sm,
                      backgroundColor: tone.soft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={q.icon} size={15} color={tone.main} />
                  </View>
                  <Txt variant="smallMedium" color={colors.text} style={{ flex: 1 }} numberOfLines={1}>
                    {q.text}
                  </Txt>
                  <Icon name="arrow-right" size={14} color={colors.textMuted} />
                </Pressable>
              )
            })}
          </View>
        </View>
      </View>
    </Card>
  )
}
