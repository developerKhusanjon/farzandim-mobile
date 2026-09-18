import type { ReactNode } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { accent, colors, fonts, radius, shadows, spacing, type AccentKey } from '@/theme'
import { Icon, type IconKey } from './icon'

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const HEIGHTS: Record<Size, number> = { sm: 36, md: 44, lg: 52 }
const FONT_SIZES: Record<Size, number> = { sm: 13, md: 15, lg: 16 }

function palette(variant: Variant) {
  switch (variant) {
    case 'primary':
      return { bg: colors.brand, fg: colors.white, border: colors.brand }
    case 'success':
      return { bg: colors.green, fg: colors.white, border: colors.green }
    case 'danger':
      return { bg: colors.danger, fg: colors.white, border: colors.danger }
    case 'secondary':
      return { bg: colors.card, fg: colors.text, border: colors.border }
    case 'soft':
      return { bg: colors.brandSoft, fg: colors.brand, border: colors.transparent }
    case 'ghost':
      return { bg: colors.transparent, fg: colors.textSecondary, border: colors.transparent }
  }
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  disabled,
  fullWidth = false,
  style,
}: {
  label: string
  onPress?: () => void
  variant?: Variant
  size?: Size
  icon?: IconKey
  iconRight?: IconKey
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const tone = palette(variant)
  const isDisabled = disabled || loading

  return (
    <Pressable
      onPress={() => {
        if (isDisabled) return
        // Muhim harakatlarda yengil haptik javob (docs/01-design-system.md)
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress?.()
      }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHTS[size],
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
          backgroundColor: tone.bg,
          borderColor: tone.border,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isDisabled ? 0.5 : 1,
        },
        variant === 'primary' && !isDisabled ? shadows.button : null,
        pressed && !isDisabled ? { transform: [{ scale: 0.985 }] } : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={tone.fg} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 18} color={tone.fg} /> : null}
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: FONT_SIZES[size], color: tone.fg }}>
            {label}
          </Text>
          {iconRight ? (
            <Icon name={iconRight} size={size === 'sm' ? 16 : 18} color={tone.fg} />
          ) : null}
        </>
      )}
    </Pressable>
  )
}

/** Faqat ikonkali dumaloq tugma — sarlavhalarda va chat kiritish maydonida */
export function IconButton({
  icon,
  onPress,
  size = 40,
  color = colors.textSecondary,
  background = colors.subtle,
  disabled,
  style,
}: {
  icon: IconKey
  onPress?: () => void
  size?: number
  color?: string
  background?: string
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) {
  return (
    <Pressable
      onPress={() => {
        if (disabled) return
        onPress?.()
      }}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} color={color} />
    </Pressable>
  )
}

/** Ro'yxat qatori: chapda ikonka, o'ngda chevron (Profil, Maktab bo'limlari) */
export function RowLink({
  icon,
  label,
  value,
  colorKey = 'blue',
  onPress,
  right,
}: {
  icon: IconKey
  label: string
  value?: string
  colorKey?: AccentKey
  onPress?: () => void
  right?: ReactNode
}) {
  const tone = accent(colorKey)
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? { backgroundColor: colors.subtle } : null]}
    >
      <View style={[styles.rowIcon, { backgroundColor: tone.soft }]}>
        <Icon name={icon} size={18} color={tone.main} />
      </View>
      <Text style={{ flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text }}>
        {label}
      </Text>
      {value ? (
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMuted }}>
          {value}
        </Text>
      ) : null}
      {right ?? <Icon name="chevron-right" size={18} color={colors.textMuted} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.base,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
