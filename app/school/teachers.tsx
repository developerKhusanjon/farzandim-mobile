import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, Badge, Card, EmptyState, Icon, ScreenHeader, SearchField, Skeleton, Txt } from '@/ui'
import { colors, layout, radius, spacing } from '@/theme'
import { useTeachers } from '@/api/queries'

/** O'qituvchilar — faqat ko'rish (ota-ona ilovasida qo'shish tugmasi yo'q) */
export default function TeachersScreen() {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const { data: teachers = [], isLoading } = useTeachers()

  const visible = query
    ? teachers.filter((t) =>
        `${t.firstName} ${t.lastName} ${t.subjectName}`.toLowerCase().includes(query.toLowerCase()),
      )
    : teachers

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="O'qituvchilar" subtitle={`${teachers.length} nafar`} />

      <View style={{ paddingHorizontal: layout.screenPadding, paddingBottom: spacing.md }}>
        <SearchField value={query} onChangeText={setQuery} placeholder="O'qituvchi qidirish..." />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing['2xl'],
          gap: spacing.md,
        }}
      >
        {isLoading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} height={80} style={{ borderRadius: radius.card }} />)
        ) : visible.length === 0 ? (
          <Card>
            <EmptyState icon="users" title="Topilmadi" />
          </Card>
        ) : (
          visible.map((teacher) => (
            <Card key={teacher.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Avatar
                  uri={teacher.avatarUrl}
                  firstName={teacher.firstName}
                  lastName={teacher.lastName}
                  size="lg"
                />
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <Txt variant="bodySemibold" numberOfLines={1}>
                    {teacher.firstName} {teacher.lastName}
                  </Txt>
                  <Txt variant="caption" numberOfLines={1}>
                    {teacher.subjectName} · {teacher.groups.join(', ')}
                  </Txt>
                  {teacher.phone ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name="phone" size={12} color={colors.textMuted} />
                      <Txt variant="tiny">{teacher.phone}</Txt>
                    </View>
                  ) : null}
                </View>
                <Badge label="Faol" colorKey="green" size="sm" />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  )
}
