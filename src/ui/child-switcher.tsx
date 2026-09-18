import { Modal, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, radius, shadows, spacing } from '@/theme'
import { useSession } from '@/store/session'
import { Avatar } from './avatar'
import { Icon } from './icon'
import { Badge, Divider, Txt } from './primitives'

/**
 * Farzand almashtirish oynasi.
 * Ota-onaning bir nechta farzandi bo'lsa — ikki bosishda almashadi
 * (docs/04-mobile-tz.md § Qabul qilish mezonlari).
 */
export function ChildSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets()
  const children = useSession((s) => s.children)
  const activeChildId = useSession((s) => s.activeChildId)
  const setActiveChild = useSession((s) => s.setActiveChild)

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: colors.overlay }} onPress={onClose} />
      <View
        style={{
          backgroundColor: colors.card,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.lg,
          paddingHorizontal: spacing.base,
          ...shadows.pop,
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: radius.pill,
            backgroundColor: colors.borderStrong,
            marginBottom: spacing.base,
          }}
        />
        <Txt variant="h3" style={{ marginBottom: spacing.md }}>
          Farzandni tanlang
        </Txt>

        {children.map((child, index) => {
          const active = child.id === activeChildId
          return (
            <View key={child.id}>
              {index > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => {
                  setActiveChild(child.id)
                  onClose()
                }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  paddingVertical: spacing.md,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Avatar uri={child.avatarUrl} firstName={child.firstName} lastName={child.lastName} size="lg" />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Txt variant="bodySemibold">
                    {child.firstName} {child.lastName}
                  </Txt>
                  <Txt variant="caption">
                    {child.gradeLevel}-sinf, {child.groupName}
                  </Txt>
                </View>
                <Badge
                  label={`${child.academicScore}%`}
                  colorKey={child.academicScore >= 80 ? 'green' : 'amber'}
                  size="sm"
                />
                {active ? <Icon name="check" size={20} color={colors.brand} /> : null}
              </Pressable>
            </View>
          )
        })}
      </View>
    </Modal>
  )
}
