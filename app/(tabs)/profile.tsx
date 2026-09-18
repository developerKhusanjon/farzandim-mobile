import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, Badge, Button, Card, ChildSwitcher, Divider, Icon, RowLink, Txt } from '@/ui'
import { colors, layout, spacing } from '@/theme'
import { useActiveChild, useIsStandalone, useSession } from '@/store/session'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const parent = useSession((s) => s.user)
  const school = useSession((s) => s.school)
  const children = useSession((s) => s.children)
  const logout = useSession((s) => s.logout)
  const child = useActiveChild()
  const standalone = useIsStandalone()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ paddingTop: insets.top + spacing.sm, paddingHorizontal: layout.screenPadding }}>
          <Txt variant="h1">Profil</Txt>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: layout.screenPadding,
            paddingTop: spacing.base,
            paddingBottom: layout.tabBarHeight + insets.bottom + spacing.xl,
            gap: spacing.base,
          }}
        >
          {/* Ota-ona */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Avatar
                uri={parent?.avatarUrl}
                firstName={parent?.firstName ?? 'F'}
                lastName={parent?.lastName}
                size="xl"
              />
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Txt variant="h2" numberOfLines={1}>
                  {parent?.firstName} {parent?.lastName}
                </Txt>
                <Txt variant="caption">{parent?.phone ?? parent?.email}</Txt>
                <Badge
                  label={standalone ? 'Mustaqil foydalanuvchi' : 'Ota-ona'}
                  colorKey={standalone ? 'amber' : 'blue'}
                  size="sm"
                />
              </View>
            </View>
          </Card>

          {/* Farzand */}
          {child ? (
            <Card padded={false}>
              <View style={{ padding: spacing.base }}>
                <Txt variant="caption" style={{ marginBottom: spacing.md }}>
                  FARZANDIM
                </Txt>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Avatar
                    uri={child.avatarUrl}
                    firstName={child.firstName}
                    lastName={child.lastName}
                    size="lg"
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodySemibold">
                      {child.firstName} {child.lastName}
                    </Txt>
                    <Txt variant="caption">
                      {child.gradeLevel}-sinf, {child.groupName}
                    </Txt>
                  </View>
                  {children.length > 1 ? (
                    <Button
                      label="Almashtirish"
                      variant="soft"
                      size="sm"
                      onPress={() => setSwitcherOpen(true)}
                    />
                  ) : null}
                </View>
              </View>
            </Card>
          ) : null}

          {/* Maktabim — faqat ko'rish rejimida */}
          {!standalone && school ? (
            <Card padded={false}>
              <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.base }}>
                <Txt variant="caption">MAKTABIM</Txt>
              </View>
              <RowLink
                icon="graduation-cap"
                label={school.name}
                value={school.address}
                colorKey="blue"
                onPress={() => router.push('/school')}
              />
              <Divider />
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
            </Card>
          ) : null}

          {/* Tahlil bo'limlari */}
          {!standalone ? (
            <Card padded={false}>
              <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.base }}>
                <Txt variant="caption">TAHLIL</Txt>
              </View>
              <RowLink
                icon="brain"
                label="Intellekt va xarakter"
                colorKey="purple"
                onPress={() => router.push('/character')}
              />
              <Divider />
              <RowLink
                icon="star"
                label="Qiziqishlar va qobiliyatlar"
                colorKey="amber"
                onPress={() => router.push('/interests')}
              />
              <Divider />
              <RowLink
                icon="sparkles"
                label="AI tavsiyalari"
                colorKey="teal"
                onPress={() => router.push('/recommendations')}
              />
            </Card>
          ) : null}

          {/* Sozlamalar */}
          <Card padded={false}>
            <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.base }}>
              <Txt variant="caption">SOZLAMALAR</Txt>
            </View>
            <RowLink icon="bell" label="Bildirishnomalar" colorKey="blue" onPress={() => {}} />
            <Divider />
            <RowLink icon="languages" label="Til" value="O'zbekcha" colorKey="green" onPress={() => {}} />
            <Divider />
            <RowLink icon="lock" label="Xavfsizlik" colorKey="teal" onPress={() => {}} />
            <Divider />
            <RowLink icon="message-circle" label="Yordam va qo'llab-quvvatlash" colorKey="purple" onPress={() => {}} />
          </Card>

          <Button
            label="Chiqish"
            variant="secondary"
            icon="x"
            fullWidth
            onPress={() => void logout()}
            style={{ borderColor: colors.dangerSoft }}
          />

          <View style={{ alignItems: 'center', gap: 4, marginTop: spacing.md }}>
            <Icon name="sparkles" size={16} color={colors.textMuted} />
            <Txt variant="tiny">Farzandim · 1.0.0</Txt>
          </View>
        </ScrollView>
      </View>

      <ChildSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </>
  )
}
