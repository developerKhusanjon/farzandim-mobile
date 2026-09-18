import { View, type StyleProp, type ViewStyle } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { colors, fonts } from '@/theme'
import { Txt } from './primitives'

/** Farzandim belgisi — web'dagi logo.svg bilan bir xil ikki bargli mark */
export function LogoMark({ size = 32, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="fz-blue" x1="30" y1="60" x2="96" y2="4" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#5A93FF" />
            <Stop offset="1" stopColor="#0F62F2" />
          </LinearGradient>
          <LinearGradient
            id="fz-green"
            x1="34"
            y1="100"
            x2="98"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#63E08A" />
            <Stop offset="1" stopColor="#1FAE4B" />
          </LinearGradient>
          <LinearGradient id="fz-light" x1="2" y1="58" x2="36" y2="22" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#95ECB0" />
            <Stop offset="1" stopColor="#4FD37E" />
          </LinearGradient>
        </Defs>
        <Path d="M2 56 A25 25 0 0 1 34 24 A25 25 0 0 1 2 56 Z" fill="url(#fz-light)" />
        <Path d="M40 58 A45 45 0 0 1 98 0 A45 45 0 0 1 40 58 Z" fill="url(#fz-blue)" />
        <Path d="M38 100 A45 45 0 0 1 96 42 A45 45 0 0 1 38 100 Z" fill="url(#fz-green)" />
      </Svg>
    </View>
  )
}

export function Logo({
  size = 'md',
  withTagline = false,
  style,
}: {
  size?: 'sm' | 'md' | 'lg'
  withTagline?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const markSize = size === 'lg' ? 44 : size === 'sm' ? 24 : 32
  const fontSize = size === 'lg' ? 30 : size === 'sm' ? 18 : 22

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10 }, style]}>
      <LogoMark size={markSize} />
      <View>
        <Txt style={{ fontFamily: fonts.displayBold, fontSize, color: colors.ink, lineHeight: fontSize * 1.2 }}>
          Farzandim
        </Txt>
        {withTagline ? (
          <Txt variant="caption" style={{ marginTop: 2 }}>
            Better learning. Brighter future.
          </Txt>
        ) : null}
      </View>
    </View>
  )
}
