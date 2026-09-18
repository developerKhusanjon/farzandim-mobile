import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EmptyState, ScreenHeader } from '@/ui'
import { CharacterSection } from '@/features/progress/character-section'
import { colors, layout, spacing } from '@/theme'
import { useActiveChild } from '@/store/session'

/** Intellekt · xulq-atvor · kuchli va zaif tomonlar (Profil orqali ochiladi) */
export default function CharacterScreen() {
  const insets = useSafeAreaInsets()
  const child = useActiveChild()

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Intellekt va xarakter"
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
        {child ? <CharacterSection childId={child.id} /> : <EmptyState title="Farzand tanlanmagan" />}
      </ScrollView>
    </View>
  )
}
