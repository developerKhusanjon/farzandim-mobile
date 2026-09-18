import { ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Card, Divider, Icon, LogoMark, NoteCard, RowLink, ScreenHeader, Txt } from '@/ui'
import { colors, gradients, layout, radius, spacing } from '@/theme'
import { useSchool } from '@/api/queries'

/**
 * "Maktabim" — faqat ko'rish rejimi.
 * Ota-ona ilovasida hech qanday qo'shish/tahrirlash amali yo'q.
 */
export default function SchoolScreen() {
  const insets = useSafeAreaInsets()
  const { data: school } = useSchool()

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Maktabim" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.base,
        }}
      >
        <LinearGradient
          colors={gradients.blue}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: radius.panel, padding: spacing.lg, gap: spacing.md }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoMark size={30} />
          </View>
          <View>
            <Txt variant="h2" color={colors.white}>
              {school?.name ?? '—'}
            </Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Icon name="home" size={13} color={colors.textOnDarkDim} />
              <Txt variant="small" color={colors.textOnDarkDim}>
                {school?.address ?? ''}
              </Txt>
            </View>
          </View>
        </LinearGradient>

        <Card padded={false}>
          <RowLink
            icon="users"
            label="O'qituvchilar"
            colorKey="green"
            onPress={() => router.push('/school/teachers')}
          />
          <Divider />
          <RowLink
            icon="calendar-days"
            label="Dars jadvali"
            colorKey="amber"
            onPress={() => router.push('/school/schedule')}
          />
          <Divider />
          <RowLink icon="phone" label="Maktab telefoni" value={school?.phone} colorKey="blue" />
          <Divider />
          <RowLink
            icon="calendar"
            label="O'quv yili"
            value={school?.academicYear}
            colorKey="purple"
          />
        </Card>

        <NoteCard tone="blue" icon="lightbulb">
          Bu bo'lim faqat ko'rish uchun. Ma'lumotlarni maktab administratori Farzandim CRM orqali
          boshqaradi.
        </NoteCard>
      </ScrollView>
    </View>
  )
}
