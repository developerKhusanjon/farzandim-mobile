import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EmptyState, NoteCard, ScreenHeader, Skeleton } from '@/ui'
import { CognitiveCard } from '@/features/recommendations/cognitive-card'
import { colors, layout, radius, spacing } from '@/theme'
import { useRecommendations } from '@/api/queries'
import { useActiveChild } from '@/store/session'

/** ⭐ AI tavsiya qilgan kognitiv rivojlantiruvchi topshiriqlar */
export default function RecommendationsScreen() {
  const insets = useSafeAreaInsets()
  const child = useActiveChild()
  const { data: tasks = [], isLoading } = useRecommendations(child?.id)

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="AI tavsiyalari"
        subtitle={child ? `${child.firstName} ${child.lastName}` : undefined}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.md,
        }}
      >
        <NoteCard tone="teal" icon="sparkles" title="Bu tavsiyalar qanday tuzilgan">
          AI farzandingizning baholari, mavzular bo'yicha natijalari, ko'nikma baholashlari va
          qiziqishlarini birga tahlil qiladi. Har bir mashq aniq bir zaif tomonga yoki kuchli
          tomonni rivojlantirishga qaratilgan.
        </NoteCard>

        {isLoading ? (
          [0, 1].map((i) => <Skeleton key={i} height={220} style={{ borderRadius: radius.card }} />)
        ) : tasks.length === 0 ? (
          <EmptyState icon="sparkles" title="Tavsiyalar yo'q" />
        ) : (
          tasks.map((task) => <CognitiveCard key={task.id} task={task} />)
        )}
      </ScrollView>
    </View>
  )
}
