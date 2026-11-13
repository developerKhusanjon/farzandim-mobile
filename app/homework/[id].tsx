import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Badge,
  Button,
  Card,
  Icon,
  IconTile,
  NoteCard,
  ScreenHeader,
  Skeleton,
  Txt,
} from '@/ui'
import { accent, colors, layout, radius, spacing } from '@/theme'
import { useAiHomework, useHomeworkItem, useSetHomeworkStatus } from '@/api/queries'
import { errorMessage } from '@/api/http'
import { useActiveChild } from '@/store/session'
import type { AiHomeworkMode, AiHomeworkResult } from '@/api/types'

const STATUS_META = {
  DONE: { label: 'Bajarildi', color: 'green' as const },
  PENDING: { label: 'Kutilmoqda', color: 'blue' as const },
  MISSED: { label: 'Bajarilmagan', color: 'red' as const },
}

/** ⭐ AI yordamchining uchta rejimi — docs/04-mobile-tz.md § 5.6 */
const AI_MODES: { mode: AiHomeworkMode; label: string; icon: 'wand-2' | 'lightbulb' | 'check-circle'; color: 'purple' | 'blue' | 'teal' }[] = [
  { mode: 'SIMPLIFY', label: 'Soddalashtir', icon: 'wand-2', color: 'purple' },
  { mode: 'EXPLAIN', label: 'Tushuntir', icon: 'lightbulb', color: 'blue' },
  { mode: 'SOLVE', label: 'Yechib ber', icon: 'check-circle', color: 'teal' },
]

export default function HomeworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const { data: hw, isLoading } = useHomeworkItem(id)
  const setStatus = useSetHomeworkStatus()
  const ai = useAiHomework()
  const child = useActiveChild()

  const [activeMode, setActiveMode] = useState<AiHomeworkMode | null>(null)
  const [result, setResult] = useState<AiHomeworkResult | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)

  const runAi = async (mode: AiHomeworkMode) => {
    if (!id) return
    setActiveMode(mode)
    setResult(null)
    setAiError(null)
    try {
      setResult(await ai.mutateAsync({ homeworkId: id, mode }))
    } catch (e) {
      setAiError(errorMessage(e))
    }
  }

  if (isLoading || !hw) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Uy vazifasi" />
        <View style={{ paddingHorizontal: layout.screenPadding, gap: spacing.md }}>
          <Skeleton height={120} style={{ borderRadius: radius.card }} />
          <Skeleton height={200} style={{ borderRadius: radius.card }} />
        </View>
      </View>
    )
  }

  const meta = STATUS_META[hw.status]

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={hw.subjectName} subtitle={hw.teacherName} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.base,
        }}
      >
        {/* Vazifa matni */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <IconTile subjectId={hw.subjectId} colorKey={hw.colorKey} size={44} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt variant="h3" numberOfLines={2}>
                {hw.title}
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 }}>
                <Icon name="clock" size={12} color={colors.textMuted} />
                <Txt variant="tiny">{hw.estimatedMinutes} daqiqa</Txt>
                <Badge label={meta.label} colorKey={meta.color} size="sm" />
              </View>
            </View>
          </View>

          <Txt variant="small" style={{ marginTop: spacing.base, lineHeight: 22 }}>
            {hw.description}
          </Txt>
        </Card>

        {/* O'qituvchi aynan shu o'quvchi uchun moslashtirgan variant */}
        {hw.adaptedVariant ? (
          <Card style={{ borderColor: accent('purple').main + '40' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <IconTile name="sparkles" colorKey="purple" size={40} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt variant="bodySemibold">Siz uchun moslashtirilgan variant</Txt>
                <Txt variant="tiny">O'qituvchi tasdiqlagan · AI tayyorlagan</Txt>
              </View>
            </View>

            <NoteCard tone="amber" icon="alert-triangle" style={{ marginTop: spacing.md }}>
              {hw.adaptedVariant.reason}
            </NoteCard>

            <Txt variant="small" style={{ marginTop: spacing.md, lineHeight: 22 }}>
              {hw.adaptedVariant.description}
            </Txt>

            <View style={{ marginTop: spacing.base, gap: spacing.sm }}>
              <Txt variant="smallMedium" color={colors.text}>
                Ota-ona uchun qadamlar
              </Txt>
              {hw.adaptedVariant.stepByStep.map((step, i) => (
                <View key={step} style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: radius.pill,
                      backgroundColor: accent('purple').soft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Txt variant="tiny" color={accent('purple').main}>
                      {i + 1}
                    </Txt>
                  </View>
                  <Txt variant="small" style={{ flex: 1 }}>
                    {step}
                  </Txt>
                </View>
              ))}
            </View>

            <NoteCard tone="purple" icon="lightbulb" style={{ marginTop: spacing.base }}>
              {hw.adaptedVariant.parentHint}
            </NoteCard>
          </Card>
        ) : null}

        {/* O'qituvchi izohi */}
        {hw.parentHint ? (
          <NoteCard tone="amber" icon="lightbulb" title="Ota-onaga maslahat">
            {hw.parentHint}
          </NoteCard>
        ) : null}

        {/* ⭐ AI yordamchi — uchta rejim */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <IconTile name="sparkles" colorKey="purple" size={40} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt variant="h3">AI yordamchi</Txt>
              <Txt variant="caption">Tushunmadingizmi? Quyidagilardan birini tanlang</Txt>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.base }}>
            {AI_MODES.map((item) => {
              const tone = accent(item.color)
              const active = activeMode === item.mode
              return (
                <Pressable
                  key={item.mode}
                  onPress={() => void runAi(item.mode)}
                  style={({ pressed }) => ({
                    flex: 1,
                    alignItems: 'center',
                    gap: 6,
                    paddingVertical: spacing.md,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: active ? tone.main : colors.border,
                    backgroundColor: active ? tone.soft : colors.card,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Icon name={item.icon} size={20} color={tone.main} />
                  <Txt variant="tiny" color={active ? tone.main : colors.textSecondary} align="center">
                    {item.label}
                  </Txt>
                </Pressable>
              )
            })}
          </View>

          {/* Natija */}
          {ai.isPending ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                marginTop: spacing.base,
                padding: spacing.base,
                borderRadius: radius.md,
                backgroundColor: colors.subtle,
              }}
            >
              <ActivityIndicator color={colors.brand} />
              <Txt variant="small">AI tayyorlamoqda...</Txt>
            </View>
          ) : aiError ? (
            <NoteCard tone="red" icon="alert-triangle" style={{ marginTop: spacing.base }}>
              {aiError}
            </NoteCard>
          ) : result ? (
            <View style={{ marginTop: spacing.base, gap: spacing.md }}>
              {result.warning ? (
                <NoteCard tone="red" icon="alert-triangle" title="Diqqat">
                  {result.warning}
                </NoteCard>
              ) : null}

              <View style={{ padding: spacing.base, borderRadius: radius.md, backgroundColor: colors.subtle }}>
                <Txt variant="small" style={{ lineHeight: 22 }}>
                  {result.content}
                </Txt>
              </View>

              {result.steps?.length ? (
                <View style={{ gap: spacing.sm }}>
                  <Txt variant="smallMedium" color={colors.text}>
                    Qadamlar
                  </Txt>
                  {result.steps.map((step, i) => (
                    <View key={step} style={{ flexDirection: 'row', gap: spacing.sm }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: radius.pill,
                          backgroundColor: colors.brandSoft,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Txt variant="tiny" color={colors.brand}>
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
            </View>
          ) : null}
        </Card>

        {/* Bajarilganini belgilash */}
        <Button
          label={hw.status === 'DONE' ? 'Bajarildi ✓' : 'Bajarildi deb belgilash'}
          variant={hw.status === 'DONE' ? 'secondary' : 'success'}
          fullWidth
          size="lg"
          loading={setStatus.isPending}
          onPress={() =>
            child &&
              setStatus.mutate({
                id: hw.id,
                status: hw.status === 'DONE' ? 'PENDING' : 'DONE',
                childId: child.id,
              })
          }
        />
      </ScrollView>
    </View>
  )
}
