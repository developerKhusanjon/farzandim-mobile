import { useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Badge, Card, IconButton, IconTile, LogoMark, ScreenHeader, Txt } from '@/ui'
import { colors, fonts, layout, radius, spacing } from '@/theme'
import { useSendAiMessage } from '@/api/queries'
import { aiGreeting, aiSubjectChips } from '@/mocks/data'
import type { AiMessage } from '@/api/types'

/** AI yordamchi chat (mockup №8) */
export default function AiScreen() {
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const send = useSendAiMessage()

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: 'greeting', author: 'AI', content: aiGreeting, createdAt: new Date().toISOString() },
  ])

  const submit = async (text: string) => {
    const content = text.trim()
    if (!content || send.isPending) return
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, author: 'USER', content, createdAt: new Date().toISOString() },
    ])
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
    const reply = await send.mutateAsync(content)
    setMessages((prev) => [...prev, reply])
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
  }

  const showChips = messages.length === 1

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="AI yordamchi" subtitle="Farzandim AI" />

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
                      width: 34,
                      height: 34,
                      borderRadius: radius.pill,
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LogoMark size={19} />
                  </View>
                ) : null}

                <View style={{ maxWidth: '82%', gap: spacing.sm }}>
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
                      variant="small"
                      color={isAi ? colors.text : colors.white}
                      style={{ lineHeight: 21 }}
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
                  width: 34,
                  height: 34,
                  borderRadius: radius.pill,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LogoMark size={19} />
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
                <Txt variant="small" color={colors.textMuted}>
                  Yozmoqda...
                </Txt>
              </View>
            </View>
          ) : null}

          {/* Fan chiplari (mockup №8) */}
          {showChips && !send.isPending ? (
            <Card style={{ marginLeft: 42 }} padded={false}>
              {aiSubjectChips.map((chip, index) => (
                <Pressable
                  key={chip.id}
                  onPress={() => void submit(`${chip.label} bo'yicha yordam kerak`)}
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
                  <Txt variant="bodyMedium">{chip.label}</Txt>
                </Pressable>
              ))}
            </Card>
          ) : null}
        </ScrollView>

        {/* Kiritish maydoni */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: spacing.sm,
            paddingHorizontal: layout.screenPadding,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Savolingizni yozing..."
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
