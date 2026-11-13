import { useEffect, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Badge, Card, Icon, IconButton, IconTile, LogoMark, ScreenHeader, Txt } from '@/ui'
import { accent, colors, fonts, layout, radius, spacing } from '@/theme'
import { useSendAiMessage } from '@/api/queries'
import { errorMessage } from '@/api/http'
import { useActiveChild } from '@/store/session'
import { aiGreeting, aiSubjectChips } from '@/mocks/data'
import type { AiMessage } from '@/api/types'

const QUICK_PROMPTS = [
  { id: 'p1', text: 'Bugungi darslar qanday o‘tdi?', icon: 'message-circle' as const, colorKey: 'purple' as const },
  { id: 'p2', text: 'Bugun farzandimga qanday dalda beray?', icon: 'heart' as const, colorKey: 'pink' as const },
  { id: 'p3', text: 'Qaysi fandan yordam kerak?', icon: 'alert-triangle' as const, colorKey: 'amber' as const },
  { id: 'p4', text: 'Qobiliyatini qanday oshiramiz?', icon: 'sparkles' as const, colorKey: 'teal' as const },
  { id: 'p5', text: 'Uy vazifasini soddalashtirib ber', icon: 'book-open' as const, colorKey: 'blue' as const },
]

/**
 * AI yordamchi — ota-onalar uchun klaviaturasiz,
 * tayyor savol tugmalari orqali ishlaydigan aqlli yordamchi.
 */
export default function AiScreen() {
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const send = useSendAiMessage()
  const child = useActiveChild()
  const params = useLocalSearchParams<{ prompt?: string }>()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: 'greeting', author: 'AI', content: aiGreeting, createdAt: new Date().toISOString() },
  ])
  const initialPromptHandled = useRef(false)

  const submit = async (text: string) => {
    const content = text.trim()
    if (!content || send.isPending) return
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, author: 'USER', content, createdAt: new Date().toISOString() },
    ])
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
    try {
      const reply = await send.mutateAsync({ content, childId: child?.id })
      setMessages((prev) => [...prev, reply])
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
    } catch (e) {
      // xato holatida fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          author: 'AI',
          // Sababini aytamiz: AI o'chiq, tarifda yo'q, limit tugagan yoki internet yo'q
          content: `Kechirasiz, javob olinmadi: ${errorMessage(e)}`,
          createdAt: new Date().toISOString(),
        },
      ])
    }
  }

  // Agar sahifaga prompt parametri bilan kirilsa, avtomatik savol yuboriladi
  useEffect(() => {
    if (params.prompt && !initialPromptHandled.current) {
      initialPromptHandled.current = true
      void submit(params.prompt)
    }
  }, [params.prompt])

  const showChips = messages.length === 1

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="AI yordamchi" subtitle="Ota-onalar uchun aqlli maslahatchi" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: layout.screenPadding,
            paddingBottom: spacing.lg,
            gap: spacing.md,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Xabarlar ro'yxati */}
          {messages.map((message) => {
            const isAi = message.author === 'AI'
            return (
              <View
                key={message.id}
                style={{
                  flexDirection: isAi ? 'row' : 'row-reverse',
                  alignItems: 'flex-end',
                  gap: spacing.sm,
                }}
              >
                {isAi ? (
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: radius.pill,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LogoMark size={20} />
                  </View>
                ) : null}

                <View style={{ maxWidth: '84%', gap: spacing.sm }}>
                  <View
                    style={{
                      paddingHorizontal: spacing.base,
                      paddingVertical: spacing.md,
                      borderRadius: radius.panel,
                      borderTopLeftRadius: isAi ? 6 : radius.panel,
                      borderTopRightRadius: isAi ? radius.panel : 6,
                      backgroundColor: isAi ? colors.card : colors.brand,
                      borderWidth: isAi ? 1 : 0,
                      borderColor: colors.border,
                    }}
                  >
                    <Txt
                      variant="body"
                      color={isAi ? colors.text : colors.white}
                      style={{ lineHeight: 22 }}
                    >
                      {message.content}
                    </Txt>
                  </View>

                  {message.terms?.length ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {message.terms.map((term) => (
                        <Badge key={term} label={term} colorKey="blue" size="sm" />
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            )
          })}

          {send.isPending ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.pill,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogoMark size={20} />
              </View>
              <View
                style={{
                  paddingHorizontal: spacing.base,
                  paddingVertical: spacing.md,
                  borderRadius: radius.panel,
                  borderTopLeftRadius: 6,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Txt variant="body" color={colors.textMuted}>
                  AI tahlil qilmoqda...
                </Txt>
              </View>
            </View>
          ) : null}

          {/* Dastlabki fan chiplari */}
          {showChips && !send.isPending ? (
            <Card style={{ marginLeft: 44 }} padded={false}>
              <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: 4 }}>
                <Txt variant="caption" color={colors.textSecondary} style={{ fontFamily: fonts.bodySemibold }}>
                  FAN BO‘YICHA YORDAM SO‘RASH:
                </Txt>
              </View>
              {aiSubjectChips.map((chip, index) => (
                <Pressable
                  key={chip.id}
                  onPress={() => void submit(`${chip.label} darsi bo‘yicha yordam kerak`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.md,
                    paddingVertical: 12,
                    paddingHorizontal: spacing.base,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: colors.border,
                    backgroundColor: pressed ? colors.subtle : colors.transparent,
                  })}
                >
                  <IconTile name={chip.iconKey} colorKey={chip.colorKey} size={32} />
                  <Txt variant="bodySemibold">{chip.label}</Txt>
                </Pressable>
              ))}
            </Card>
          ) : null}
        </ScrollView>

        {/* Tayyor tavsiya savol-tugmalari (Klaviaturasiz muloqot uchun) */}
        <View
          style={{
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingVertical: spacing.sm,
          }}
        >
          <View style={{ paddingHorizontal: layout.screenPadding, paddingBottom: 6 }}>
            <Txt variant="caption" color={colors.textSecondary} style={{ fontFamily: fonts.bodySemibold }}>
              TAYYOR SAVOLLARNI BOSING:
            </Txt>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: layout.screenPadding,
              gap: spacing.sm,
            }}
          >
            {QUICK_PROMPTS.map((qp) => {
              const tone = accent(qp.colorKey)
              return (
                <Pressable
                  key={qp.id}
                  disabled={send.isPending}
                  onPress={() => void submit(qp.text)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: radius.pill,
                    backgroundColor: pressed ? tone.soft : colors.bg,
                    borderWidth: 1,
                    borderColor: pressed ? tone.main : colors.border,
                  })}
                >
                  <Icon name={qp.icon} size={14} color={tone.main} />
                  <Txt variant="smallMedium" color={colors.text}>
                    {qp.text}
                  </Txt>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        {/* Ixtiyoriy yozish maydoni */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: spacing.sm,
            paddingHorizontal: layout.screenPadding,
            paddingTop: spacing.sm,
            paddingBottom: insets.bottom + spacing.sm,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Yoki savolingizni yozing..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              flex: 1,
              minHeight: 44,
              maxHeight: 110,
              paddingHorizontal: spacing.base,
              paddingTop: 12,
              paddingBottom: 12,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bg,
              fontFamily: fonts.body,
              fontSize: 15,
              color: colors.text,
            }}
          />
          <IconButton
            icon="send"
            size={44}
            background={input.trim() ? colors.brand : colors.border}
            color={colors.white}
            disabled={!input.trim() || send.isPending}
            onPress={() => void submit(input)}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
