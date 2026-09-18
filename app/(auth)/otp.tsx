import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Field, IconButton, NoteCard, Txt } from '@/ui'
import { colors, fonts, gradients, layout, spacing } from '@/theme'
import { useSession } from '@/store/session'

/**
 * Mustaqil foydalanuvchi kirishi: email yoki telefon + SMS kod.
 * Bunday foydalanuvchi maktabga bog'lanmagan — faqat AI bo'limlari ochiq.
 */
export default function OtpScreen() {
  const insets = useSafeAreaInsets()
  const requestOtp = useSession((s) => s.requestOtp)
  const verifyOtp = useSession((s) => s.verifyOtp)

  const [step, setStep] = useState<'contact' | 'code'>('contact')
  const [contact, setContact] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendCode = async () => {
    if (contact.trim().length < 5) {
      setError('Email yoki telefon raqamini to‘liq kiriting')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await requestOtp(contact.trim())
      setStep('code')
    } finally {
      setLoading(false)
    }
  }

  const confirm = async () => {
    if (code.trim().length < 4) {
      setError('Kod 4 xonali bo‘lishi kerak')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await verifyOtp(contact.trim(), code.trim())
    } catch {
      setError('Kod noto‘g‘ri')
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
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.xl,
            paddingHorizontal: layout.screenPadding,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <IconButton
            icon="chevron-left"
            background={colors.transparent}
            color={colors.text}
            onPress={() => (step === 'code' ? setStep('contact') : router.back())}
            style={{ marginLeft: -8 }}
          />

          <View style={{ marginTop: spacing.xl, gap: spacing.xs }}>
            <Txt style={{ fontFamily: fonts.displayBold, fontSize: 24, color: colors.ink }}>
              {step === 'contact' ? 'Email yoki telefon' : 'Tasdiqlash kodi'}
            </Txt>
            <Txt variant="small" style={{ maxWidth: 300 }}>
              {step === 'contact'
                ? 'Kirish uchun raqam yoki email kiriting — tasdiqlash kodi yuboriladi'
                : `${contact} manziliga yuborilgan 4 xonali kodni kiriting`}
            </Txt>
          </View>

          <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
            {step === 'contact' ? (
              <Field
                icon="mail"
                placeholder="+998 90 123 45 67 yoki email"
                value={contact}
                onChangeText={setContact}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            ) : (
              <Field
                icon="lock"
                placeholder="1234"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={4}
              />
            )}

            {error ? (
              <NoteCard tone="red" icon="alert-triangle">
                {error}
              </NoteCard>
            ) : null}

            <Button
              label={step === 'contact' ? 'Kod yuborish' : 'Tasdiqlash'}
              onPress={() => void (step === 'contact' ? sendCode() : confirm())}
              loading={loading}
              size="lg"
              fullWidth
            />

            {step === 'code' ? (
              <Button
                label="Kodni qayta yuborish"
                variant="ghost"
                fullWidth
                onPress={() => void sendCode()}
              />
            ) : null}
          </View>

          <View style={{ flex: 1 }} />

          <NoteCard tone="teal" icon="sparkles" title="Nima ochiladi">
            Maktabga ulanmagan foydalanuvchi uchun AI yordamchi ishlaydi: uy vazifasini
            soddalashtirish, tushuntirish va umumiy ta'lim maslahatlari. O'zlashtirish va maktab
            xabarlari esa maktab ulangandan keyin ko'rinadi.
          </NoteCard>

          {step === 'code' ? (
            <NoteCard tone="blue" icon="lightbulb" style={{ marginTop: spacing.md }}>
              Demo rejim: istalgan 4 xonali kod ishlaydi.
            </NoteCard>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}
