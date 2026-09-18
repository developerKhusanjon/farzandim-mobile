import { useState } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { colors, fonts, radius, shadows, spacing } from '@/theme'
import { Icon, type IconKey } from './icon'
import { Txt } from './primitives'

/* ---------------------------- SegmentedControl ---------------------------- */

/**
 * Mockupdagi ikki xil segment:
 * - `pill`  — ko'k to'ldirilgan (Haftalik/Oylik/Yillik, Qiziqishlar/Qobiliyatlar)
 * - `chip`  — oq fonli chiplar (Bugungi/Kechagi/Barchasi, Hammasi/Ta'lim/...)
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  variant = 'pill',
  style,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  variant?: 'pill' | 'chip'
  style?: StyleProp<ViewStyle>
}) {
  if (variant === 'chip') {
    return (
      <View style={[{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }, style]}>
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
            >
              <Txt
                variant="smallMedium"
                color={active ? colors.white : colors.textSecondary}
              >
                {opt.label}
              </Txt>
            </Pressable>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[styles.segment, style]}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segmentItem, active ? styles.segmentItemActive : null]}
          >
            <Txt variant="smallMedium" color={active ? colors.white : colors.textSecondary}>
              {opt.label}
            </Txt>
          </Pressable>
        )
      })}
    </View>
  )
}

/* ---------------------------------- Input --------------------------------- */

export function Field({
  icon,
  secure,
  style,
  ...props
}: TextInputProps & { icon?: IconKey; secure?: boolean; style?: StyleProp<ViewStyle> }) {
  const [hidden, setHidden] = useState(Boolean(secure))

  return (
    <View style={[styles.field, style]}>
      {icon ? <Icon name={icon} size={18} color={colors.textMuted} /> : null}
      <TextInput
        {...props}
        secureTextEntry={hidden}
        placeholderTextColor={colors.textMuted}
        style={styles.fieldInput}
      />
      {secure ? (
        <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10}>
          <Icon name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  )
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
  style,
}: {
  value: string
  onChangeText: (v: string) => void
  placeholder?: string
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[styles.field, { backgroundColor: colors.card }, style]}>
      <Icon name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.fieldInput}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Icon name="x" size={16} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  )
}

/* --------------------------------- Checkbox ------------------------------- */

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
      hitSlop={6}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          borderWidth: 1.5,
          borderColor: checked ? colors.brand : colors.borderStrong,
          backgroundColor: checked ? colors.brand : colors.transparent,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? <Icon name="check" size={13} color={colors.white} strokeWidth={3} /> : null}
      </View>
      {label ? <Txt variant="small">{label}</Txt> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.subtle,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.brand,
    ...shadows.card,
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  chipIdle: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 52,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  fieldInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
})
