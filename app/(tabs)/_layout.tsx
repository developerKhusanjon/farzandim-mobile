import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, fonts, layout, shadows } from '@/theme'
import { Icon, type IconKey } from '@/ui'

/**
 * Pastki navigatsiya — ota-ona ilovasining asosiy 5 bo'limi.
 * docs/04-mobile-tz.md § 4 dagi kelishilgan tuzilma.
 */
const TABS: { name: string; title: string; icon: IconKey }[] = [
  { name: 'index', title: 'Bosh sahifa', icon: 'home' },
  { name: 'progress', title: "O'zlash", icon: 'trending-up' },
  { name: 'activities', title: 'Vazifalar', icon: 'clipboard-check' },
  { name: 'messages', title: 'Xabarlar', icon: 'message-circle' },
  { name: 'profile', title: 'Profil', icon: 'user' },
]

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
        tabBarStyle: {
          height: layout.tabBarHeight + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom || 8,
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          ...shadows.tabBar,
        },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              // `color` React Native'da OpaqueColorValue ham bo'lishi mumkin —
              // lucide faqat satr qabul qiladi, shuning uchun aniq rang beramiz
              <Icon
                name={tab.icon}
                size={22}
                color={focused ? colors.brand : colors.textMuted}
                strokeWidth={focused ? 2.3 : 1.9}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
