/**
 * Grafik primitivlar — barchasi `react-native-svg` bilan qo'lda chizilgan.
 * Web'dagi DonutRing / ProgressBar bilan bir xil ko'rinadi.
 */
import { useMemo } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Line as SvgLine } from 'react-native-svg'
import { accent, colors, radius, type AccentKey } from '@/theme'
import { Txt } from './primitives'

/* -------------------------------- DonutRing ------------------------------- */

export function DonutRing({
  value,
  size = 88,
  thickness,
  colorKey = 'blue',
  label,
  caption,
  style,
}: {
  value: number
  size?: number
  thickness?: number
  colorKey?: AccentKey
  /** Markazdagi matn — berilmasa foiz ko'rsatiladi */
  label?: string
  caption?: string
  style?: StyleProp<ViewStyle>
}) {
  const tone = accent(colorKey)
  const stroke = thickness ?? Math.max(6, Math.round(size * 0.11))
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, value))
  const gradientId = `donut-${colorKey}-${size}`

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={tone.main} stopOpacity={0.75} />
            <Stop offset="1" stopColor={tone.main} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          fill="none"
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Txt
          variant="metric"
          style={{ fontSize: Math.max(14, Math.round(size * 0.24)), lineHeight: Math.round(size * 0.3) }}
        >
          {label ?? `${Math.round(clamped)}%`}
        </Txt>
        {caption ? (
          <Txt variant="tiny" style={{ fontSize: Math.max(9, Math.round(size * 0.11)) }}>
            {caption}
          </Txt>
        ) : null}
      </View>
    </View>
  )
}

/* ------------------------------- ProgressBar ------------------------------ */

export function ProgressBar({
  value,
  colorKey = 'blue',
  height = 8,
  style,
}: {
  value: number
  colorKey?: AccentKey
  height?: number
  style?: StyleProp<ViewStyle>
}) {
  const tone = accent(colorKey)
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <View
      style={[
        { height, borderRadius: radius.pill, backgroundColor: colors.subtle, overflow: 'hidden' },
        style,
      ]}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: '100%',
          borderRadius: radius.pill,
          backgroundColor: tone.main,
        }}
      />
    </View>
  )
}

/**
 * Fan qatori: [rangli nuqta] [nom] ....... [progress] [foiz] [delta]
 * Mockupdagi "Fanlar bo'yicha natija" bloki.
 */
export function SubjectRow({
  label,
  value,
  colorKey = 'blue',
  delta,
  onPress,
}: {
  label: string
  value: number
  colorKey?: AccentKey
  delta?: number
  onPress?: () => void
}) {
  const tone = accent(colorKey)
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} onTouchEnd={onPress}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tone.main }} />
      <Txt variant="small" color={colors.text} style={{ width: 96 }} numberOfLines={1}>
        {label}
      </Txt>
      <ProgressBar value={value} colorKey={colorKey} height={6} style={{ flex: 1 }} />
      <Txt variant="smallMedium" color={colors.text} style={{ width: 34, textAlign: 'right' }}>
        {Math.round(value)}%
      </Txt>
      {typeof delta === 'number' ? (
        <Txt
          variant="tiny"
          color={delta >= 0 ? colors.success : colors.danger}
          style={{ width: 30, textAlign: 'right' }}
        >
          {delta > 0 ? '+' : ''}
          {delta}%
        </Txt>
      ) : null}
    </View>
  )
}

/* -------------------------------- LineChart ------------------------------- */

/** Katmull-Rom asosidagi silliq egri chiziq — nuqtalar orasidan o'tadi */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let d = `M ${points[0]!.x} ${points[0]!.y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function LineChart({
  data,
  width,
  height = 150,
  colorKey = 'blue',
  /** Qaysi nuqta ustida qiymat pufagi ko'rsatilsin */
  highlightIndex,
}: {
  data: { label: string; value: number }[]
  width: number
  height?: number
  colorKey?: AccentKey
  highlightIndex?: number
}) {
  const tone = accent(colorKey)
  const padX = 8
  const padTop = 26
  const padBottom = 22

  const { points, path, min, max } = useMemo(() => {
    const values = data.map((d) => d.value)
    const rawMin = Math.min(...values)
    const rawMax = Math.max(...values)
    // Chiziq chetlarga yopishmasligi uchun diapazonni biroz kengaytiramiz
    const lo = Math.max(0, Math.floor((rawMin - 6) / 5) * 5)
    const hi = Math.min(100, Math.ceil((rawMax + 6) / 5) * 5)
    const span = Math.max(1, hi - lo)
    const innerW = width - padX * 2
    const innerH = height - padTop - padBottom
    const step = data.length > 1 ? innerW / (data.length - 1) : 0
    const pts = data.map((d, i) => ({
      x: padX + i * step,
      y: padTop + innerH * (1 - (d.value - lo) / span),
    }))
    return { points: pts, path: smoothPath(pts), min: lo, max: hi }
  }, [data, width, height])

  const hi = highlightIndex ?? data.length - 1
  const highlighted = points[hi]

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Gorizontal to'r chiziqlari */}
        {[0, 0.5, 1].map((t) => (
          <SvgLine
            key={t}
            x1={0}
            x2={width}
            y1={padTop + (height - padTop - padBottom) * t}
            y2={padTop + (height - padTop - padBottom) * t}
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}

        <Path d={path} stroke={tone.main} strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === hi ? 5 : 3.5}
            fill={colors.white}
            stroke={i === hi ? tone.main : accent('green').main}
            strokeWidth={2.5}
          />
        ))}
      </Svg>

      {/* Qiymat pufagi (mockupdagi "84%" yorlig'i) */}
      {highlighted ? (
        <View
          style={{
            position: 'absolute',
            left: Math.min(Math.max(highlighted.x - 22, 0), width - 44),
            top: Math.max(highlighted.y - 30, 0),
            backgroundColor: tone.main,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: radius.sm,
          }}
        >
          <Txt variant="tiny" color={colors.white}>
            {data[hi]?.value}%
          </Txt>
        </View>
      ) : null}

      {/* Y o'qi chekka qiymatlari */}
      <View style={{ position: 'absolute', left: 0, top: padTop - 8 }}>
        <Txt variant="tiny">{max}</Txt>
      </View>
      <View style={{ position: 'absolute', left: 0, bottom: padBottom - 6 }}>
        <Txt variant="tiny">{min}</Txt>
      </View>

      {/* X o'qi yorliqlari */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: padX,
          right: padX,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {data.map((d) => (
          <Txt key={d.label} variant="tiny">
            {d.label}
          </Txt>
        ))}
      </View>
    </View>
  )
}
