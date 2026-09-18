import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, Icon, IconTile, NoteCard, ScreenHeader, SectionHeader, Skeleton, Txt } from '@/ui'
import { colors, layout, radius, spacing } from '@/theme'
import { useLesson } from '@/api/queries'

/** Dars xulosasi + o'zlashtirilishi kerak bo'lgan terminlar */
export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { data, isLoading } = useLesson(id)
  const [openTerm, setOpenTerm] = useState<string | null>(null)

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Dars xulosasi" />
        <View style={{ paddingHorizontal: layout.screenPadding, gap: spacing.md }}>
          <Skeleton height={120} style={{ borderRadius: radius.card }} />
          <Skeleton height={200} style={{ borderRadius: radius.card }} />
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Dars xulosasi" subtitle={`${data.subjectName} · ${data.date}`} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.base,
        }}
      >
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <IconTile subjectId={data.subjectId} colorKey={data.colorKey} size={44} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt variant="h3" numberOfLines={1}>{data.topic}</Txt>
              <Txt variant="caption">{data.teacherName}</Txt>
            </View>
          </View>
          <Txt variant="small" style={{ marginTop: spacing.base, lineHeight: 22 }}>
            {data.summary}
          </Txt>
        </Card>

        {/* Terminlar — bosilganda ta'rifi ochiladi */}
        <View>
          <SectionHeader title="O'rganish kerak bo'lgan terminlar" />
          <Card padded={false}>
            {data.terms.map((term, index) => {
              const open = openTerm === term.term
              return (
                <Pressable
                  key={term.term}
                  onPress={() => setOpenTerm(open ? null : term.term)}
                  style={({ pressed }) => ({
                    paddingVertical: 14,
                    paddingHorizontal: spacing.base,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: colors.border,
                    backgroundColor: pressed ? colors.subtle : colors.transparent,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <Txt variant="bodyMedium" style={{ flex: 1 }}>{term.term}</Txt>
                    <Icon name={open ? 'chevron-left' : 'chevron-right'} size={16} color={colors.textMuted} />
                  </View>
                  {open ? (
                    <Txt variant="small" style={{ marginTop: spacing.sm }}>{term.definition}</Txt>
                  ) : null}
                </Pressable>
              )
            })}
          </Card>
        </View>

        <NoteCard tone="teal" icon="sparkles" title="Farzandingiz bilan takrorlang">
          Har bir terminni so'rang va o'z so'zi bilan tushuntirib bersin. Boshqaga tushuntira olish —
          haqiqiy tushunganlikning eng yaxshi belgisi.
        </NoteCard>
      </ScrollView>
    </View>
  )
}
