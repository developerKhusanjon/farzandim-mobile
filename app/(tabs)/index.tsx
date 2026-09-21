import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Avatar,
  Badge,
  Button,
  Card,
  ChildSwitcher,
  Delta,
  Icon,
  IconButton,
  IconTile,
  LogoMark,
  NoteCard,
  SectionHeader,
  Skeleton,
  Txt,
} from '@/ui'
import { accent, colors, fonts, gradients, layout, radius, spacing } from '@/theme'
import { useDashboard } from '@/api/queries'
import { useActiveChild, useSession } from '@/store/session'
import { HomeQuickActions } from '@/features/home/home-quick-actions'
import { HomeAiBrief } from '@/features/home/home-ai-brief'
import { HomeSchedulePreview } from '@/features/home/home-schedule-preview'
import { HomeCharacterPreview } from '@/features/home/home-character-preview'
import { HomeInterestsPreview } from '@/features/home/home-interests-preview'

/** Bosh sahifadagi kichik ko'rsatkich kartasi */
function MiniStat({
  label,
  value,
  colorKey,
  icon,
  delta,
}: {
  label: string
  value: string
  colorKey: Parameters<typeof accent>[0]
  icon: 'trending-up' | 'star' | 'alert-triangle'
  delta?: number
}) {
  const tone = accent(colorKey)
  return (
    <Card style={{ flex: 1 }} padded={false}>
      <View style={{ padding: spacing.md, gap: 6 }}>
        <Txt variant="tiny" numberOfLines={1}>
          {label}
        </Txt>
        <Txt style={{ fontFamily: fonts.display, fontSize: 20, color: colors.text }}>{value}</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {typeof delta === 'number' ? (
            <Delta value={delta} size={11} />
          ) : (
            <Icon name={icon} size={13} color={tone.main} />
          )}
        </View>
      </View>
    </Card>
  )
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const parent = useSession((s) => s.user)
  const children = useSession((s) => s.children)
  const child = useActiveChild()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  const { data, isLoading } = useDashboard(child?.id)
  const unread = data?.unreadMessages ?? 0

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        {/* Sarlavha: Ota-ona profili + bildirishnoma */}
        <View
          style={{
            paddingTop: insets.top + spacing.sm,
            paddingHorizontal: layout.screenPadding,
            paddingBottom: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar
              uri={parent?.avatarUrl}
              firstName={parent?.firstName ?? 'F'}
              lastName={parent?.lastName}
              size="md"
            />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt variant="bodySemibold" numberOfLines={1}>
                {parent?.firstName} {parent?.lastName}
              </Txt>
              <Txt variant="caption">Ota-ona</Txt>
            </View>
            <View>
              <IconButton
                icon="bell"
                size={40}
                background={colors.card}
                color={colors.text}
                onPress={() => router.push('/(tabs)/messages')}
              />
              {unread > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    width: 9,
                    height: 9,
                    borderRadius: radius.pill,
                    backgroundColor: colors.danger,
                    borderWidth: 1.5,
                    borderColor: colors.card,
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.sm }}
        >
          <View style={{ paddingHorizontal: layout.screenPadding, gap: spacing.base }}>
            {/* Brend banner */}
            <LinearGradient
              colors={gradients.banner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: radius.panel,
                padding: spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              <Txt
                style={{
                  flex: 1,
                  fontFamily: fonts.display,
                  fontSize: 16,
                  lineHeight: 23,
                  color: colors.white,
                }}
              >
                Farzandingizning kelajagi — bizning birgalikdagi maqsadimiz!
              </Txt>
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
            </LinearGradient>

            {/* Farzand tanlash kartasi */}
            {child ? (
              <Card onPress={() => setSwitcherOpen(true)} padded={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                    padding: spacing.md,
                  }}
                >
                  <Avatar
                    uri={child.avatarUrl}
                    firstName={child.firstName}
                    lastName={child.lastName}
                    size="lg"
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodySemibold" numberOfLines={1}>
                      {child.firstName} {child.lastName}
                    </Txt>
                    <Txt variant="caption">
                      {child.gradeLevel}-sinf, {child.groupName}
                    </Txt>
                  </View>
                  {child.atSchool ? <Badge label="Maktabda" colorKey="green" size="sm" /> : null}
                  {children.length > 1 ? (
                    <Icon name="chevron-right" size={18} color={colors.textMuted} />
                  ) : null}
                </View>
              </Card>
            ) : null}

            {/* 3 ta qisqa ko'rsatkich */}
            {isLoading || !child ? (
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} height={84} style={{ flex: 1, borderRadius: radius.card }} />
                ))}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <MiniStat
                  label="O'zlashtirish"
                  value={`${child.academicScore}%`}
                  colorKey="blue"
                  icon="trending-up"
                  delta={child.academicDelta}
                />
                <MiniStat
                  label="Qiziqishlar"
                  value={`${child.interestsCount} ta`}
                  colorKey="amber"
                  icon="star"
                />
                <MiniStat
                  label="Kamchiliklar"
                  value={`${child.weaknessesCount} ta`}
                  colorKey="red"
                  icon="alert-triangle"
                />
              </View>
            )}

            {/* Asosiy 4 ta bo'limga tezkor kirish (Keksa ota-onalar uchun juda qulay) */}
            <HomeQuickActions />

            {/* Bugungi AI Xulosasi va Klaviaturasiz Tayyor Savollar */}
            <HomeAiBrief child={child} />
          </View>

          {/* Dars jadvali — Bosh sahifadagi to'g'ridan-to'g'ri ko'rinish */}
          <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.lg }}>
            <HomeSchedulePreview />
          </View>

          {/* Bugungi vazifalar */}
          <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.lg }}>
            <SectionHeader
              title="Bugungi vazifalar"
              actionLabel="Barchasi"
              onAction={() => router.push('/(tabs)/activities')}
            />
            <Card padded={false}>
              {isLoading ? (
                <View style={{ padding: spacing.base, gap: spacing.md }}>
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} height={44} />
                  ))}
                </View>
              ) : (
                (data?.tasks ?? []).map((task, index) => (
                  <Pressable
                    key={task.id}
                    onPress={() => router.push('/(tabs)/activities')}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      paddingVertical: 12,
                      paddingHorizontal: spacing.base,
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderTopColor: colors.border,
                      backgroundColor: pressed ? colors.subtle : colors.transparent,
                    })}
                  >
                    <IconTile subjectId={task.subjectId} colorKey={task.colorKey} size={36} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt variant="bodySemibold" numberOfLines={1} color={colors.text}>
                        {task.subjectName}
                      </Txt>
                      <Txt variant="caption">
                        {task.time} · {task.label}
                      </Txt>
                    </View>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: radius.pill,
                        borderWidth: task.done ? 0 : 1.5,
                        borderColor: colors.borderStrong,
                        backgroundColor: task.done ? colors.success : colors.transparent,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {task.done ? (
                        <Icon name="check" size={14} color={colors.white} strokeWidth={3} />
                      ) : null}
                    </View>
                  </Pressable>
                ))
              )}
            </Card>
          </View>

          {/* Intellekt va xarakter — Bosh sahifadagi to'g'ridan-to'g'ri ko'rinish */}
          <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.lg }}>
            <HomeCharacterPreview childId={child?.id} />
          </View>

          {/* Qiziqishlar va qobiliyatlar — Bosh sahifadagi to'g'ridan-to'g'ri ko'rinish */}
          <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.lg }}>
            <HomeInterestsPreview childId={child?.id} />
          </View>

          {/* So'nggi dars xulosasi */}
          {data?.lastLesson ? (
            <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.lg }}>
              <SectionHeader title="So'nggi dars xulosasi" />
              <Card onPress={() => router.push(`/lesson/${data.lastLesson!.id}`)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <IconTile
                    subjectId={data.lastLesson.subjectId}
                    colorKey={data.lastLesson.colorKey}
                    size={40}
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodySemibold" numberOfLines={1}>
                      {data.lastLesson.subjectName}
                    </Txt>
                    <Txt variant="caption" numberOfLines={1}>
                      {data.lastLesson.topic}
                    </Txt>
                  </View>
                  <Icon name="chevron-right" size={18} color={colors.textMuted} />
                </View>
                <Txt variant="small" numberOfLines={2} style={{ marginTop: spacing.md }}>
                  {data.lastLesson.summary}
                </Txt>
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md }}
                >
                  {data.lastLesson.terms.slice(0, 3).map((t) => (
                    <Badge key={t.term} label={t.term} colorKey="blue" size="sm" />
                  ))}
                </View>
              </Card>
            </View>
          ) : null}

          {/* AI Tavsiyalari & Kognitiv Rivojlantirish bloki */}
          <View style={{ paddingHorizontal: layout.screenPadding, marginTop: spacing.lg }}>
            <NoteCard tone="purple" icon="sparkles" title="AI bilan o‘rganish">
              <View style={{ gap: spacing.md }}>
                <Txt variant="small">
                  Farzandingizning darslari, tushunmagan mavzulari va qiziqishlari bo‘yicha AI
                  maxsus mashqlar tayyorlagan.
                </Txt>
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <Button
                    label="Tavsiya mashqlar"
                    size="sm"
                    variant="primary"
                    onPress={() => router.push('/recommendations')}
                    style={{ flex: 1, backgroundColor: accent('purple').main, borderColor: accent('purple').main }}
                  />
                  <Button
                    label="AI maslahat"
                    size="sm"
                    variant="soft"
                    onPress={() => router.push('/ai')}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </NoteCard>
          </View>

          <View style={{ height: layout.tabBarHeight + insets.bottom + spacing.lg }} />
        </ScrollView>
      </View>

      <ChildSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </>
  )
}
