import { View } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg'
import { Button, Logo, LogoMark, Txt } from '@/ui'
import { colors, fonts, gradients, layout, spacing } from '@/theme'
import { useSession } from '@/store/session'

/**
 * Onboarding (mockup №1).
 * Brend kompozitsiyasi: yumshoq gradient fon, dekorativ barglar va logo.
 */
function BrandArt({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Defs>
        <SvgGradient id="halo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#DCEBFF" stopOpacity={0.9} />
          <Stop offset="1" stopColor="#DFF6E6" stopOpacity={0.9} />
        </SvgGradient>
        <SvgGradient id="leafA" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#8FE2AC" />
          <Stop offset="1" stopColor="#35C06A" />
        </SvgGradient>
        <SvgGradient id="leafB" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#7FB0FF" />
          <Stop offset="1" stopColor="#2F6BFF" />
        </SvgGradient>
      </Defs>

      <Circle cx="130" cy="130" r="118" fill="url(#halo)" />

      {/* Dekorativ barglar — brend belgisining kattalashtirilgan aks-sadosi */}
      <Path d="M36 96 A34 34 0 0 1 80 52 A34 34 0 0 1 36 96 Z" fill="url(#leafA)" opacity={0.55} />
      <Path
        d="M186 214 A38 38 0 0 1 234 166 A38 38 0 0 1 186 214 Z"
        fill="url(#leafB)"
        opacity={0.35}
      />
      <Path d="M206 74 A26 26 0 0 1 240 40 A26 26 0 0 1 206 74 Z" fill="url(#leafA)" opacity={0.4} />
    </Svg>
  )
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets()
  const completeOnboarding = useSession((s) => s.completeOnboarding)

  const start = () => {
    completeOnboarding()
    router.push('/(auth)/login')
  }

  return (
    <LinearGradient colors={gradients.auth} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: layout.screenPadding,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ alignItems: 'center', marginTop: spacing['2xl'] }}>
          <Logo size="lg" withTagline />
        </View>

        <View style={{ alignItems: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <BrandArt />
            <View style={{ position: 'absolute' }}>
              <LogoMark size={96} />
            </View>
          </View>
        </View>

        <View style={{ width: '100%', alignItems: 'center', gap: spacing.xl }}>
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <Txt
              align="center"
              style={{
                fontFamily: fonts.displayBold,
                fontSize: 24,
                lineHeight: 32,
                color: colors.ink,
              }}
            >
              {'Har bir bola\no‘z imkoniyatini topadi!'}
            </Txt>
            <Txt variant="small" align="center" style={{ maxWidth: 280 }}>
              Farzandingizning ta'lim yo'lidagi eng yaxshi yordamchisi — o'zlashtirish, qiziqishlar
              va AI maslahatlari bir joyda.
            </Txt>
          </View>

          <View style={{ width: '100%', gap: spacing.md }}>
            <Button label="Boshlash" onPress={start} size="lg" fullWidth />
            <Button
              label="Tizimga kirish"
              variant="ghost"
              onPress={start}
              size="md"
              fullWidth
              style={{ borderColor: colors.transparent }}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}
