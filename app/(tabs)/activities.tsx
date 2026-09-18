import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  IconTile,
  NoteCard,
  SegmentedControl,
  Skeleton,
  Txt,
} from '@/ui'
import { accent, colors, layout, radius, spacing } from '@/theme'
import { useHomework, useRecommendations } from '@/api/queries'
import { CognitiveCard } from '@/features/recommendations/cognitive-card'
import { useActiveChild, useIsStandalone } from '@/store/session'
import type { Homework } from '@/api/types'

type Tab = 'homework' | 'recommendations'
type Scope = 'today' | 'yesterday' | 'all'

const STATUS_META = {
  DONE: { label: 'Bajarildi', color: 'green' as const },
  PENDING: { label: 'Kutilmoqda', color: 'blue' as const },
  MISSED: { label: 'Bajarilmagan', color: 'red' as const },
}

/** Uy vazifasi qatori (mockup №7) */
function HomeworkRow({ item }: { item: Homework }) {
  const meta = STATUS_META[item.status]
  return (
    <Card onPress={() => router.push(`/homework/${item.id}`)}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
        <IconTile subjectId={item.subjectId} colorKey={item.colorKey} size={40} />
        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Txt variant="bodySemibold" style={{ flex: 1 }} numberOfLines={1}>
              {item.subjectName}
            </Txt>
            <Badge label={meta.label} colorKey={meta.color} size="sm" />
          </View>
          <Txt variant="small" numberOfLines={2}>
            {item.title}
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="clock" size={12} color={colors.textMuted} />
              <Txt variant="tiny">{item.estimatedMinutes} daqiqa</Txt>
            </View>
            {item.adaptedVariant ? (
              <Badge label="Siz uchun moslashtirilgan" colorKey="purple" size="sm" icon="sparkles" />
            ) : null}
          </View>
        </View>
      </View>
    </Card>
  )
}

export default function ActivitiesScreen() {
  const insets = useSafeAreaInsets()
  const child = useActiveChild()
  const standalone = useIsStandalone()
  const [tab, setTab] = useState<Tab>('homework')
  const [scope, setScope] = useState<Scope>('today')

  const { data: homework = [], isLoading: hwLoading } = useHomework(child?.id, scope)
  const { data: tasks = [], isLoading: tasksLoading } = useRecommendations(child?.id)

  if (standalone || !child) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + spacing.xl }}>
        <EmptyState
          icon="clipboard-check"
          title="Maktab ulanmagan"
          description="Uy vazifalari maktab orqali ulangandan keyin ko'rinadi."
          action={<Button label="AI yordamchini ochish" icon="sparkles" onPress={() => router.push('/ai')} />}
        />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: layout.screenPadding,
          gap: spacing.base,
        }}
      >
        <Txt variant="h1">Vazifalar</Txt>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { value: 'homework', label: 'Uy vazifalari' },
            { value: 'recommendations', label: 'AI tavsiyalar' },
          ]}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingTop: spacing.base,
          paddingBottom: layout.tabBarHeight + insets.bottom + spacing.xl,
          gap: spacing.md,
        }}
      >
        {tab === 'homework' ? (
          <>
            <SegmentedControl
              variant="chip"
              value={scope}
              onChange={setScope}
              options={[
                { value: 'today', label: 'Bugungi' },
                { value: 'yesterday', label: 'Kechagi' },
                { value: 'all', label: 'Barchasi' },
              ]}
            />

            {hwLoading ? (
              [0, 1, 2].map((i) => (
                <Skeleton key={i} height={110} style={{ borderRadius: radius.card }} />
              ))
            ) : homework.length === 0 ? (
              <Card>
                <EmptyState icon="clipboard-check" title="Vazifa yo'q" />
              </Card>
            ) : (
              homework.map((item) => <HomeworkRow key={item.id} item={item} />)
            )}

            {/* AI yordamchi kartasi (mockup №7 pastki bloki) */}
            <NoteCard tone="purple" icon="sparkles" title="AI yordamchi">
              <View style={{ gap: spacing.md }}>
                <Txt variant="small">
                  Uy vazifalarini soddalashtirish, tushuntirish yoki yechimini topishda yordam
                  beramiz.
                </Txt>
                <Button
                  label="Yordam so'rash"
                  size="sm"
                  onPress={() => router.push('/ai')}
                  style={{
                    backgroundColor: accent('purple').main,
                    borderColor: accent('purple').main,
                  }}
                />
              </View>
            </NoteCard>
          </>
        ) : (
          <>
            <NoteCard tone="teal" icon="sparkles" title="Bu tavsiyalar qanday tuzilgan">
              AI farzandingizning baholari, mavzular bo'yicha natijalari, ko'nikma baholashlari va
              qiziqishlarini birga tahlil qiladi. Har bir mashq aniq bir zaif tomonga yoki kuchli
              tomonni rivojlantirishga qaratilgan.
            </NoteCard>

            {tasksLoading
              ? [0, 1].map((i) => (
                  <Skeleton key={i} height={220} style={{ borderRadius: radius.card }} />
                ))
              : tasks.map((task) => <CognitiveCard key={task.id} task={task} />)}
          </>
        )}
      </ScrollView>
    </View>
  )
}
