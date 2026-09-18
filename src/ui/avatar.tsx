import { View, type StyleProp, type ViewStyle } from 'react-native'
import { Image } from 'expo-image'
import { accents, colors, fonts, radius } from '@/theme'
import { Txt } from './primitives'

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 84 } as const
export type AvatarSize = keyof typeof SIZES

/** Ism bo'yicha barqaror rang — bir odam doim bir xil rangda ko'rinadi */
const TONES = Object.values(accents)

function toneFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return TONES[hash % TONES.length]!
}

export function Avatar({
  uri,
  firstName,
  lastName,
  size = 'md',
  ring,
  style,
}: {
  uri?: string
  firstName: string
  lastName?: string
  size?: AvatarSize
  /** Oq halqa — rangli fon ustida turganda */
  ring?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const dimension = SIZES[size]
  const seed = `${firstName}${lastName ?? ''}`
  const tone = toneFor(seed)
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <View
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: radius.pill,
          backgroundColor: tone.soft,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        ring ? { borderWidth: 2, borderColor: colors.white } : null,
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <Txt
          variant="bodySemibold"
          color={tone.main}
          style={{ fontFamily: fonts.display, fontSize: Math.round(dimension * 0.38) }}
        >
          {initials}
        </Txt>
      )}
    </View>
  )
}
