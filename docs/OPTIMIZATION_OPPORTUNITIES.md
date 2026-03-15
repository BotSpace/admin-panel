# Loyiha Optimallashtirish Imkoniyatlari

Bu hujjat admin-panel loyihasidagi optimallashtirish mumkin bo'lgan joylarni va tavsiyalarni o'z ichiga oladi.

---

## 1. Performance (Ishlash) Optimallashtirishlari

### 1.1 React.memo yo'qligi — ro'yxat/grid bolalari

Ro'yxatda ko'p marta render bo'ladigan komponentlar `React.memo` bilan o'rash kerak:

| Fayl | Tavsiya |
|------|---------|
| `src/features/home/components/bot-card.tsx` | `BotCard` — asosiy sahifada ro'yxatda render bo'ladi |
| `src/features/templates/components/template-card.tsx` | Template kartalari gridda |
| `src/features/templates/components/withdrawal-list.tsx` | Withdrawal ro'yxat elementlari |
| `src/features/billing/payment-history-table.tsx` | Jadval qatorlari memoize qilinishi mumkin |

### 1.2 Dynamic Import / Code Splitting yo'qligi

Og'ir komponentlar statik import qilingan. `next/dynamic` ishlatish tavsiya etiladi:

| Fayl | Sabab |
|------|-------|
| `src/features/bot/plans/components/confetti-animation.tsx` | `@lottiefiles/react-lottie-player` va JSON — faqat plans sahifasida kerak |
| `src/shared/components/common/visitor-chart.tsx` | `recharts` — faqat bot detail sahifasida |
| `src/app/[lang]/market/page.tsx` | ~940 qator — route-level splitting uchun yaxshi nomzod |

**Tavsiya:** `next/dynamic` bilan `ssr: false` ishlatish (confetti, chartlar, market sahifasi uchun).

### 1.3 useCallback / useMemo bo'shliqlari

| Fayl | Muammo |
|------|--------|
| `src/app/[lang]/page.tsx` | `handleCreateNewProject` har renderda qayta yaratiladi |
| `src/features/home/components/bot-card.tsx` | `deleteBot` va boshqa handlerlar har renderda qayta yaratiladi |
| `src/app/[lang]/bot/[id]/send-message/send-new-message/page.tsx` | `getStatusIcon` (97–105 qatorlar) har renderda qayta yaratiladi |

**Tavsiya:** Memoized bolalarga uzatiladigan funksiyalarni `useCallback` bilan o'rash.

### 1.4 Inline object/function props

| Fayl | Muammo |
|------|--------|
| `src/app/[lang]/page.tsx` | `button={<CreateNewProjectButton />}` har renderda yangi element yaratadi |
| `src/shared/config/navigations.ts` | `BotPageNavigation(id)` har chaqiruvda yangi massiv qaytaradi |

**Tavsiya:** `useMemo` yoki barqaror referens ishlatish.

---

## 2. Bundle Hajmi Optimallashtirishlari

### 2.1 Ishlatilmagan dependencies

| Paket | Holat |
|-------|-------|
| `emoji-picker-react` (package.json:44) | Hech qayerda ishlatilmaydi — xavfsiz o'chirish mumkin |
| `radix-ui` (package.json:53) | Faqat `label.tsx`da — `@radix-ui/react-label`ga o'tkazish mumkin |

### 2.2 Takroriy Toast kutubxonalari ✅ (Bajarildi)

~~**react-hot-toast** — layout.tsx, ko'p feature komponentlarda~~
~~**sonner** — create-withdrawal-dialog.tsx, withdrawal-list.tsx~~

**Bajarildi:** Barcha toast xabarlari **sonner** ga standartlashtirildi, `react-hot-toast` o'chirildi.

### 2.3 Recharts import strategiyasi

`src/shared/components/ui/chart.tsx` (4-qator):
```ts
import * as RechartsPrimitive from "recharts"
```
Butun kutubxonani olib keladi.

**Tavsiya:** Faqat kerakli qismlarni import qilish (masalan, `ResponsiveContainer`, `Tooltip`) — tree-shaking yaxshilanishi uchun.

### 2.4 Lucide Icons

Har bir komponentda alohida import — tree-shaking uchun yaxshi. O'zgartirish shart emas.

---

## 3. Kod Sifati Yaxshilanishlari

### 3.1 Takroriy kod — Monitoring sahifalari ✅ (Bajarildi)

~~`src/app/[lang]/monitoring/page.tsx` va `src/app/[lang]/bot/[id]/monitoring/page.tsx` bir xil funksiyalarni o'z ichiga oladi~~

**Bajarildi:**
- `src/features/monitoring/utils/transform-monitoring-data.ts` — `formatDateForDisplay`, `formatTimeForDisplay`, `transformMonitoringData`
- `src/features/monitoring/components/monitoring-skeleton.tsx` — umumiy loading skeleton
- `src/features/monitoring/components/monitoring-error.tsx` — umumiy error holati

### 3.2 Bug — Noto'g'ri Hook ishlatilishi

`src/features/home/components/bot-card.tsx` (223–227 qatorlar):

```tsx
// NOTO'G'RI — useState side effect uchun emas
useState(() => {
  if (open) {
    fetchLogs();
  }
});
```

**To'g'ri yechim:**
```tsx
useEffect(() => {
  if (open) fetchLogs();
}, [open]);
```

### 3.3 Ishlatilmagan o'zgaruvchilar

| Fayl | O'zgaruvchilar |
|------|----------------|
| `src/app/[lang]/monitoring/page.tsx` (144, 147–152) | `_projectedCost`, `_lastUpdated` |
| `src/app/[lang]/bot/[id]/monitoring/page.tsx` (148) | `_projectedCost` |
| `src/features/home/components/bot-card.tsx` (35) | `_isLoading` |

### 3.4 BotCard — O'lik/komment qilingan kod

`src/features/home/components/bot-card.tsx` (128–160 qatorlar): Komment blok `reloadBot`, `toggleBotStatus`, `FileText`ga murojaat qiladi, lekin funksiyalar `_reloadBot`, `_toggleBotStatus` deb nomlangan va `FileText` import qilinmagan.

**Tavsiya:** Komment blokni o'chirish yoki tuzatib qayta yoqish.

### 3.5 Market sahifasi — Mock ma'lumotlar

`src/app/[lang]/market/page.tsx` (39–134+): Katta inline `categories` va `templates` massivlari.

**Tavsiya:** `src/features/market/mock-data.ts`ga ko'chirish yoki API dan olish.

---

## 4. API / Ma'lumot Olish Optimallashtirishlari

### 4.1 React Query konfiguratsiyasi

- `staleTime: 5min`, `gcTime: 10min`, `refetchOnWindowFocus: false` — maqul
- `use-react-query-action.ts` (86-qator): `staleTime: 1000 * 60 * 5` — barcha ishlatishlar uchun ataylab ekanligini tekshirish kerak

### 4.2 Parallel Querylar

`template-submissions/new/page.tsx` va `template-submissions/[id]/edit/page.tsx` — `categoriesData` va `featuresData` parallel fetch qilinadi. Yaxshi.

---

## 5. Build / Kompilatsiya Optimallashtirishlari

### 5.1 Next.js Config

**Tavsiya:** lucide-react uchun `modularizeImports` qo'shish (bundle tahlili katta bo'lsa):

```ts
modularizeImports: {
  'lucide-react': {
    transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}'
  }
}
```

### 5.2 Image Domains

`next.config.ts` (73–79): `images.domains` deprecated — `images.remotePatterns`ga o'tkazish tavsiya etiladi.

---

## 6. Boshqa Optimallashtirish Imkoniyatlari

### 6.1 Lottie Confetti

`src/features/bot/plans/components/confetti-animation.tsx` — `Confetti.json` statik yuklanadi. Confetti ko'rsatilganda komponent va JSONni `next/dynamic` bilan yuklash.

### 6.2 Zustand Store

`src/shared/store/chat-message.ts` — Store kattalashsa, re-renderlarni cheklash uchun selectorlar qo'shish.

---

## 7. Prioritlar Matritsasi

| Prioritet | Kategoriya | Harakat |
|-----------|------------|---------|
| **Yuqori** | Bug | `bot-card.tsx` LogsModalda `useState` → `useEffect` tuzatish |
| **Yuqori** | Bundle | `emoji-picker-react` o'chirish; toast kutubxonalarini birlashtirish |
| **Yuqori** | Takroriy kod | Umumiy monitoring transform/skeleton logikasini ajratish |
| **O'rta** | Performance | BotCard, TemplateCard uchun `React.memo`; confetti uchun dynamic import |
| **O'rta** | Bundle | chart.tsxda `import * as RechartsPrimitive`ni named importga almashtirish |
| **O'rta** | Kod sifati | bot-card, monitoring sahifalaridagi o'lik kod va ishlatilmagan o'zgaruvchilarni o'chirish |
| **Past** | Performance | Ro'yxat bolalari uchun handlerlarda `useCallback` qo'shish |
| **Past** | Build | lucide-react uchun `modularizeImports` (kerak bo'lsa) |

---

## 8. Qisqacha Xulosa

1. **Bug:** `bot-card.tsx`da `useState` o'rniga `useEffect` ishlatish kerak
2. **Bundle:** Ishlatilmagan paketlarni o'chirish, toast kutubxonalarini birlashtirish
3. **Performance:** `React.memo`, `useCallback`, `next/dynamic` qo'llash
4. **Kod sifati:** Takroriy kodni ajratish, o'lik kodni tozalash
5. **Build:** Next.js config optimallashtirishlari
