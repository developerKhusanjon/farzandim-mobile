import type { ReactNode } from 'react'
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { colors, layout, spacing } from '@/theme'
import { IconButton } from './button'
import { Txt } from './primitives'

/**
 * Ekran konteyneri: fon, xavfsiz maydon va gorizontal padding.
 * `scroll` — kontent uzun bo'lsa; `padded` — yon bo'shliq kerak bo'lsa.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  /** Pastki tab bar ostida kontent qolmasligi uchun qo'shimcha bo'shliq */
  tabBarSpacing = false,
  style,
  contentStyle,
}: {
  children: ReactNode
  scroll?: boolean
  padded?: boolean
  tabBarSpacing?: boolean
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}) {
  const insets = useSafeAreaInsets()
  const paddingBottom = (tabBarSpacing ? layout.tabBarHeight + insets.bottom : insets.bottom) + spacing.lg

  const inner = (
    <View
      style={[
        padded ? { paddingHorizontal: layout.screenPadding } : null,
        { paddingBottom },
        contentStyle,
      ]}
    >
      {children}
    </View>
  )

  if (!scroll) {
    return <View style={[{ flex: 1, backgroundColor: colors.bg }, style]}>{inner}</View>
  }

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.bg }, style]}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  )
}

/** Ichki ekran sarlavhasi: ortga tugmasi + nom + ixtiyoriy o'ng element */
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
  style,
}: {
  title: string
  subtitle?: string
  right?: ReactNode
  onBack?: () => void
  style?: StyleProp<ViewStyle>
}) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          paddingTop: insets.top + spacing.sm,
          paddingBottom: spacing.md,
          paddingHorizontal: layout.screenPadding,
          backgroundColor: colors.bg,
        },
        style,
      ]}
    >
      <IconButton
        icon="chevron-left"
        size={36}
        background={colors.transparent}
        color={colors.text}
        onPress={onBack ?? (() => router.back())}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt variant="h2" numberOfLines={1}>
          {title}
        </Txt>
        {subtitle ? (
          <Txt variant="caption" numberOfLines={1}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {right}
    </View>
  )
}

/** Bo'lim sarlavhasi: nom + o'ngda "Barchasi" havolasi */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}: {
  title: string
  actionLabel?: string
  onAction?: () => void
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        },
        style,
      ]}
    >
      <Txt variant="h3">{title}</Txt>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Txt variant="smallMedium" color={colors.brand}>
            {actionLabel}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  )
}
