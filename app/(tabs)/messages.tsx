import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Card, EmptyState, IconTile, SegmentedControl, Skeleton, Txt } from '@/ui'
import { colors, layout, radius, spacing } from '@/theme'
import { useMarkMessageRead, useMessages } from '@/api/queries'
import type { Message, MessageCategory } from '@/api/types'

type Filter = 'all' | 'education' | 'reminder' | 'system'

const FILTER_MAP: Record<Filter, MessageCategory[] | null> = {
  all: null,
  education: ['LESSON_SUMMARY', 'GRADE', 'ATTENDANCE', 'LESSON', 'TEACHER'],
  reminder: ['HOMEWORK'],
  system: ['ANNOUNCEMENT', 'AI', 'GENERAL', 'SCHOOL', 'SYSTEM'],
}

function timeLabel(iso: string) {
  const date = new Date(iso)
  const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000)
  if (diffMinutes < 60) return `${Math.max(1, diffMinutes)} d`
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function MessageRow({ item }: { item: Message }) {
  const markRead = useMarkMessageRead()

  const open = () => {
    if (!item.isRead) markRead.mutate(item.id)
    if (item.link?.screen === 'lesson') router.push(`/lesson/${item.link.id}`)
    else if (item.link?.screen === 'homework') router.push(`/homework/${item.link.id}`)
    else if (item.link?.screen === 'subject') router.push(`/subject/${item.link.id}`)
  }

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        padding: spacing.base,
        backgroundColor: pressed ? colors.subtle : colors.transparent,
      })}
    >
      <IconTile name={item.iconKey} colorKey={item.colorKey} size={40} />
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Txt variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
            {item.title}
          </Txt>
          <Txt variant="tiny">{timeLabel(item.sentAt)}</Txt>
        </View>
        <Txt variant="small" numberOfLines={2}>
          {item.body}
        </Txt>
      </View>
      {!item.isRead ? (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: radius.pill,
            backgroundColor: colors.brand,
            marginTop: 6,
          }}
        />
      ) : null}
    </Pressable>
  )
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets()
  const [filter, setFilter] = useState<Filter>('all')
  const { data: messages = [], isLoading } = useMessages()

  const allowed = FILTER_MAP[filter]
  const visible = allowed ? messages.filter((m) => allowed.includes(m.category)) : messages

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: layout.screenPadding,
          gap: spacing.base,
        }}
      >
        <Txt variant="h1">Xabarlar</Txt>
        <SegmentedControl
          variant="chip"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Hammasi' },
            { value: 'education', label: "Ta'lim" },
            { value: 'reminder', label: 'Eslatma' },
            { value: 'system', label: 'Tizim' },
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
        }}
      >
        <Card padded={false}>
          {isLoading ? (
            <View style={{ padding: spacing.base, gap: spacing.md }}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} height={56} />
              ))}
            </View>
          ) : visible.length === 0 ? (
            <EmptyState icon="message-circle" title="Xabarlar yo'q" />
          ) : (
            visible.map((item, index) => (
              <View key={item.id}>
                {index > 0 ? <View style={{ height: 1, backgroundColor: colors.border }} /> : null}
                <MessageRow item={item} />
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  )
}
