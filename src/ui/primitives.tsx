/**
 * Asosiy vizual primitivlar: matn, karta, badge, chip, ajratgich, skelet.
 * Barchasi `src/theme` tokenlaridan oziqlanadi — rang yoki o'lcham
 * to'g'ridan-to'g'ri yozilmaydi.
 */
import type { ReactNode } from 'react'
import {
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { accent, colors, radius, shadows, spacing, text as textStyles, type AccentKey } from '@/theme'
import { Icon, type IconKey } from './icon'

/* ---------------------------------- Matn ---------------------------------- */

type TextVariant = keyof typeof textStyles

export function Txt({
  variant = 'body',
  color,
  align,
  style,
  numberOfLines,
  children,
}: {
  variant?: TextVariant
  color?: string
  align?: TextStyle['textAlign']
  style?: StyleProp<TextStyle>
  numberOfLines?: number
  children: ReactNode
}) {
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[textStyles[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
    >
      {children}
    </RNText>
  )
}

/* ---------------------------------- Karta --------------------------------- */

export function Card({
  children,
  style,
  onPress,
  padded = true,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  padded?: boolean
}) {
  const content = (
    <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>
  )
  if (!onPress) return content
  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : null)}>
      {content}
    </Pressable>
  )
}

/** Karta sarlavhasi: chapda nom, o'ngda ixtiyoriy harakat */
export function CardHeader({
  title,
  subtitle,
  action,
  style,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[styles.cardHeader, style]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt variant="h3">{title}</Txt>
        {subtitle ? (
          <Txt variant="caption" style={{ marginTop: 2 }}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {action}
    </View>
  )
}

/* -------------------------------- Badge/Chip ------------------------------ */

export function Badge({
  label,
  colorKey = 'blue',
  icon,
  size = 'md',
  solid = false,
}: {
  label: string
  colorKey?: AccentKey
  icon?: IconKey
  size?: 'sm' | 'md'
  solid?: boolean
}) {
  const tone = accent(colorKey)
  const small = size === 'sm'
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: small ? 8 : 10,
        height: small ? 22 : 26,
        borderRadius: radius.pill,
        backgroundColor: solid ? tone.main : tone.soft,
      }}
    >
      {icon ? <Icon name={icon} size={small ? 11 : 13} color={solid ? colors.white : tone.main} /> : null}
      <RNText
        style={{
          fontFamily: textStyles.caption.fontFamily,
          fontSize: small ? 11 : 12,
          color: solid ? colors.white : tone.main,
        }}
      >
        {label}
      </RNText>
    </View>
  )
}

/** O'sish/pasayish ko'rsatkichi: +5% / −2% */
export function Delta({ value, size = 12 }: { value: number; size?: number }) {
  const positive = value > 0
  const neutral = value === 0
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {!neutral ? (
        <Icon
          name={positive ? 'trending-up' : 'trending-down'}
          size={size}
          color={positive ? colors.success : colors.danger}
        />
      ) : null}
      <RNText
        style={{
          fontFamily: textStyles.caption.fontFamily,
          fontSize: size,
          color: neutral ? colors.textMuted : positive ? colors.success : colors.danger,
        }}
      >
        {positive ? '+' : ''}
        {value}%
      </RNText>
    </View>
  )
}

/* ------------------------------ Ajratgich/holat --------------------------- */

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: colors.border }, style]} />
}

export function Skeleton({
  width,
  height = 16,
  style,
}: {
  width?: number | `${number}%`
  height?: number
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View
      style={[
        { width: width ?? '100%', height, borderRadius: radius.sm, backgroundColor: colors.subtle },
        style,
      ]}
    />
  )
}

export function EmptyState({
  icon = 'book-open',
  title,
  description,
  action,
}: {
  icon?: IconKey
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing['2xl'], gap: spacing.md }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.pill,
          backgroundColor: colors.subtle,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={26} color={colors.textMuted} />
      </View>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Txt variant="h3">{title}</Txt>
        {description ? (
          <Txt variant="small" align="center" style={{ maxWidth: 260 }}>
            {description}
          </Txt>
        ) : null}
      </View>
      {action}
    </View>
  )
}

/**
 * Rangli maslahat bloki — mockupdagi sariq "Ajoyib!" kartasi va
 * AI tavsiyalari shu komponent bilan chiziladi.
 */
export function NoteCard({
  tone = 'amber',
  icon = 'lightbulb',
  title,
  children,
  style,
}: {
  tone?: AccentKey
  icon?: IconKey
  title?: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  const palette = accent(tone)
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: spacing.md,
          padding: spacing.md,
          borderRadius: radius.md,
          backgroundColor: palette.soft,
        },
        style,
      ]}
    >
      <Icon name={icon} size={18} color={palette.main} />
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        {title ? (
          <RNText
            style={{
              fontFamily: textStyles.bodySemibold.fontFamily,
              fontSize: 13,
              color: palette.main,
            }}
          >
            {title}
          </RNText>
        ) : null}
        {typeof children === 'string' ? (
          <Txt variant="small" color={colors.textSecondary}>
            {children}
          </Txt>
        ) : (
          children
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardPadded: {
    padding: spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
})
