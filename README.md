# Farzandim — mobil ilova (ota-onalar uchun)

React Native + Expo SDK 57 + TypeScript.

To'liq TZ: [`docs/04-mobile-tz.md`](../docs/04-mobile-tz.md)

## Ishga tushirish

Standart holatda ilova **haqiqiy mobile-backend** bilan ishlaydi (`.env.development`:
`http://localhost:8082/api/v1`). Avval backend'ni ishga tushiring
(`../farzandim-backend/README.md`), keyin:

```bash
npm install
npm run ios        # iOS simulyatorda
npm run android    # Android emulyatorda (.env.local da 10.0.2.2 — .env.example)
npm start          # QR kod bilan (Expo Go)
```

Metro **8088** portda: standart 8081 school-backend bilan to'qnashadi.
Telefon yoki Android emulyator uchun manzil — `.env.example` da.

Backend'siz, namunaviy ma'lumot bilan:

```bash
npm run start:mock
```

```bash
npm run typecheck
```

## Demo kirish (mock rejimi)

`npm run start:mock` rejimida istalgan parol ishlaydi:

- **Login + parol** → maktabga ulangan ota-ona (to'liq ilova)
- **Email yoki telefon** → mustaqil foydalanuvchi (faqat AI yordamchi)

## Tuzilma

```
app/                      Expo Router — fayl asosidagi navigatsiya
├── (auth)/               welcome · login · otp
├── (tabs)/               index · progress · activities · messages · profile
├── subject/[id]          Fan tafsiloti
├── homework/[id]         Uy vazifasi + AI (3 rejim)          ⭐
├── lesson/[id]           Dars xulosasi + terminlar
├── character             Intellekt · xulq · kuchli/zaif       ⭐
├── interests             Qiziqishlar va qobiliyatlar          ⭐
├── recommendations       AI kognitiv topshiriqlar             ⭐
├── ai                    AI yordamchi chat
└── school/               Maktabim · O'qituvchilar · Jadval (faqat ko'rish)

src/
├── theme/                Rang, shrift, radius, soya tokenlari (web bilan bir xil)
├── ui/                   Dizayn tizimi komponentlari
├── features/             Ekran bo'limlari (progress, recommendations)
├── api/                  HTTP klient + TanStack Query hooklari + tiplar
├── mocks/                Mock ma'lumot + yo'l bo'yicha "server"
└── store/                Sessiya (zustand + SecureStore)
```

## Uchta asosiy talab qayerda

| Talab | Ekran |
|---|---|
| **AI soddalashtirish** — qiynalayotgan o'quvchi uchun | `app/homework/[id].tsx` — "Soddalashtir / Tushuntir / Yechib ber" + o'qituvchi biriktirgan **moslashtirilgan variant** |
| **Intellekt · qiziqish · xulq · kuchli/zaif tomonlar** | `app/(tabs)/progress.tsx` → "Xarakter" segmenti va `app/character.tsx` |
| **AI kognitiv rivojlantiruvchi topshiriqlar** | `app/(tabs)/activities.tsx` → "AI tavsiyalar" va `app/recommendations.tsx` |

Har bir kognitiv topshiriq **"nega aynan shu mashq"** izohi bilan keladi — aniq raqamga
tayanadi (masalan "Diqqat barqarorligi 64%"), shuning uchun ota-ona tavsiyaga ishonadi.

## Backend bilan ishlash

- **Kirish:** login + parol (`otaona1` … `otaona30` / `parol123` — dev seed) yoki telefon/email
  + 6 xonali SMS kod. Dev backend SMS yubormaydi — kod ekranda ko'rsatiladi.
  Noma'lum raqam OTP bilan kirsa — maktabga bog'lanmagan mustaqil ota-ona (faqat AI).
- **Sessiya:** access (15 daqiqa) va refresh token SecureStore'da; ilova qayta ochilganda
  tiklanadi, 401'da bitta umumiy refresh (`src/api/http.ts`). Chiqishda refresh token
  backend'da bekor qilinadi.
- Login'dan keyin `GET /auth/me`, `/parent/children`, `/parent/school` yuklanadi.
- Qiziqishlar bo'yicha AI maslahati (`/students/{id}/interest-advice`) hozircha faqat mock'da —
  backend'da endpoint yo'q.

## Mock rejim

`EXPO_PUBLIC_USE_MOCK=true` (yoki `EXPO_PUBLIC_API_URL` berilmagan) bo'lsa so'rovlar
`src/mocks/router.ts` ga boradi. Mock javoblari backend shakliga moslangan.

## Dizayn

Tokenlar `src/theme/index.ts` da — ranglar web CRM bilan **aynan bir xil**
([`docs/01-design-system.md`](../docs/01-design-system.md)).

NativeWind o'rniga tipizatsiyalangan tema + `StyleSheet` ishlatilgan: build zanjiriga
qo'shimcha vosita qo'shilmaydi va RN/web CSS farqlari kutilmagan natija bermaydi.

Grafiklar (donut, progress, chiziqli) `react-native-svg` bilan qo'lda chizilgan —
tashqi grafik kutubxonasi yo'q.

## Maketdan farqlar (kelishilgan)

1. **Admin funksiyalari olib tashlandi** — "+ Yangi o'qituvchi" / "+ Yangi o'quvchi"
   ota-ona ilovasida bo'lmaydi. Maktab bo'limi faqat ko'rish rejimida.
2. **Google/Apple kirish yo'q** — maktab login+paroli yoki email/telefon + SMS kod.
3. **5 ta tab** (maketdagi 4 emas) — uy vazifalari kundalik bo'lim, alohida turadi.
