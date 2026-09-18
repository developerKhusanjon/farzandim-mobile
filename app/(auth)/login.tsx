import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Checkbox, Field, Logo, NoteCard, Txt } from '@/ui'
import { colors, fonts, gradients, layout, spacing } from '@/theme'
import { useSession } from '@/store/session'

/**
 * Kirish (mockup №2).
 * Ikki yo'l: maktab bergan login+parol, yoki email/telefon + SMS kod
 * (mustaqil foydalanuvchi) — docs/04-mobile-tz.md § 5.1
 */
export default function LoginScreen() {
  const insets = useSafeAreaInsets()
  const loginWithPassword = useSession((s) => s.loginWithPassword)

  const [login, setLogin] = useState('emma.karimova')
  const [password, setPassword] = useState('demo1234')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    setLoading(true)
    try {
      await loginWithPassword(login, password)
      // Navigatsiya `Stack.Protected` orqali avtomatik bo'ladi
    } catch {
      setError("Login yoki parol noto'g'ri")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={gradients.auth} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + spacing['2xl'],
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: layout.screenPadding,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Logo size="md" />

          <View style={{ marginTop: spacing['2xl'], gap: spacing.xs }}>
            <Txt style={{ fontFamily: fonts.displayBold, fontSize: 26, color: colors.ink }}>
              Xush kelibsiz!
            </Txt>
            <Txt variant="small" style={{ maxWidth: 300 }}>
              Farzandingizning ta'lim yo'lidagi eng yaxshi yordamchisi
            </Txt>
          </View>

          <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
            <Field
              icon="phone"
              placeholder="Telefon raqami yoki email"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Field
              icon="lock"
              placeholder="Parol"
              value={password}
              onChangeText={setPassword}
              secure
              autoCapitalize="none"
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: spacing.xs,
              }}
            >
              <Checkbox checked={remember} onChange={setRemember} label="Meni eslab qolish" />
              <Pressable hitSlop={8}>
                <Txt variant="smallMedium" color={colors.brand}>
                  Parolni unutdingizmi?
                </Txt>
              </Pressable>
            </View>

            {error ? (
              <NoteCard tone="red" icon="alert-triangle">
                {error}
              </NoteCard>
            ) : null}

            <Button
              label="Kirish"
              onPress={() => void submit()}
              loading={loading}
              size="lg"
              fullWidth
              style={{ marginTop: spacing.xs }}
            />
          </View>

          {/* Mustaqil foydalanuvchi yo'li */}
          <View style={{ marginTop: spacing.xl, alignItems: 'center', gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, width: '100%' }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Txt variant="caption">Yoki</Txt>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            <Button
              label="Email yoki telefon bilan kirish"
              variant="secondary"
              icon="mail"
              size="lg"
              fullWidth
              onPress={() => router.push('/(auth)/otp')}
            />

            <Txt variant="caption" align="center" style={{ maxWidth: 300 }}>
              Maktabga ulanmagan bo'lsangiz ham AI yordamchidan foydalana olasiz
            </Txt>
          </View>

          <View style={{ flex: 1 }} />

          <NoteCard tone="blue" icon="lightbulb" title="Demo rejim" style={{ marginTop: spacing.xl }}>
            Istalgan parol bilan kiring — ma'lumotlar namunaviy.
          </NoteCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}
