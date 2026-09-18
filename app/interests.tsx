import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EmptyState, ScreenHeader } from '@/ui'
import { InterestsSection } from '@/features/progress/interests-section'
import { colors, layout, spacing } from '@/theme'
import { useActiveChild } from '@/store/session'

/** Qiziqishlar va qobiliyatlar (mockup №6) */
export default function InterestsScreen() {
  const insets = useSafeAreaInsets()
  const child = useActiveChild()

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Qiziqishlar va qobiliyatlar"
        subtitle={child ? `${child.firstName} ${child.lastName}` : undefined}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
        }}
      >
        {child ? <InterestsSection childId={child.id} /> : <EmptyState title="Farzand tanlanmagan" />}
      </ScrollView>
    </View>
  )
}
