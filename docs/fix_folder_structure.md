Tahlil natijasi — folder structure xatolari:

---

# Folder structure xatolari

## 1. App ichida ko‘p business logic

**Muammo:** `app/` faqat routing uchun bo‘lishi kerak, lekin ko‘p sahifalarda to‘liq logic yozilgan.

| Fayl                                   | Qatorlar | Muammo                                |
| -------------------------------------- | -------- | ------------------------------------- |
| `app/.../bot/[id]/plans/page.tsx`      | ~200     | To‘liq plans logikasi app ichida      |
| `app/.../bot/[id]/messages/page.tsx`   | ~390     | Chat/messages logikasi app ichida     |
| `app/.../bot/[id]/monitoring/page.tsx` | ~235     | Monitoring logikasi app ichida        |
| `app/.../monitoring/page.tsx`          | ~227     | Global monitoring ham app ichida      |
| `app/.../bot/[id]/web-app/page.tsx`    | ~155     | Web App ko‘rsatma sahifasi app ichida |

**Tavsiya:** Bu logikani `features/bot/plans`, `features/bot/messages`, `features/bot/web-app` va hokazolarga ko‘chiring. App faqat import va render qilsin.

---

## 2. Monitoring kodining takrorlanishi

**Muammo:** `formatDateForDisplay`, `formatTimeForDisplay`, `transformMonitoringData` ikki joyda bir xil:

- `app/[lang]/monitoring/page.tsx` (15–117 qatorlar)
- `app/[lang]/bot/[id]/monitoring/page.tsx` (16–118 qatorlar)

**Tavsiya:** Bu funksiyalarni `features/monitoring/` ga (masalan, `utils.ts` yoki `transform.ts`) chiqaring va ikkala page ham shu yerdan import qilsin.

---

## 3. App dan import qilish (anti-pattern)

```tsx
// app/.../bot/[id]/collection/page.tsx
import SharedCollection from "@/app/[lang]/shared-collection/page";
```

**Muammo:** `app/` dan page import qilish odatda noto‘g‘ri. App faqat route’lar uchun, business logic esa `features/` yoki `shared/` da bo‘lishi kerak.

**Tavsiya:** `SharedCollection` komponentini `features/bot/collection/` yoki `features/collection/` ga ko‘chiring va shu yerdan import qiling.

---

## 4. Bo‘sh / noto‘g‘ri shared-collection

**Muammo:** `shared-collection/page.tsx` faqat bo‘sh `<div></div>` qaytaradi. `collection/page.tsx` esa shu bo‘sh komponentni import qiladi — sahifa ishlamaydi.

---

## 5. Typo: `emty-release`

**Fayl:** `app/.../bot/[id]/release/emty-release.tsx`

**Muammo:** `emty` → `empty` bo‘lishi kerak.

---

## 6. API URL: `relase`

```tsx
// versions-section.tsx
url: "/relase?project=[id]";
```

**Muammo:** `relase` → `release` bo‘lishi kerak (agar backend haqiqatan ham `relase` ishlatmasa).

---

## 7. Eski fayl saqlanib qolgan

**Fayl:** `app/.../bot/[id]/send-message/page.old.tsx`

**Muammo:** `.old` fayllar versiya nazoratida bo‘lmasligi yaxshiroq. Kerak bo‘lsa git history’da qoladi.

**Tavsiya:** O‘chirib tashlang yoki refactor tugagach olib tashlang.

---

## 8. package.json typo

```json
"name": "botmather"
```

**Muammo:** `botmather` → `botmother` bo‘lishi kerak.

---

## 9. `files` route’lari noaniq

**Mavjud route’lar:**

- `app/[lang]/files/` — global files (project_id siz)
- `app/[lang]/bot/[id]/files/` — bot-specific files (project_id bilan)

**Muammo:** Navigationsda ikkalasi ham bor, lekin ularning maqsadi va farqi aniq emas. `FilesMainPage` `project_id` optional qilib yozilgan — bu ikkala route uchun ham ishlaydi, lekin UX va maqsad aniq emas.

---

## 10. `shared` vs `features` types aralashuvi

**Hozirgi holat:**

- `shared/types/` — plan, bot, project, release, http, chat-message, broadcast-message
- `features/*/types/` — auth, monitoring, templates, files, tickets

**Muammo:** Ba’zi domain types `shared` da (plan, release, bot), ba’zilari `features` da. Bu noaniqlik va import tartibsizligiga olib keladi.

**Tavsiya:** Domain-specific types’larni tegishli feature’lar ostiga ko‘chiring (masalan, `Plan` → `features/plans/types` yoki `features/billing/types`). `shared/types` da faqat umumiy (http, utils va hokazo) qolsin.

---

## 11. `features/bot` va `app/bot/[id]` o‘rtasidagi nomuvofiqlik

**Muammo:** `features/bot/components/` da `send-message.tsx`, `files.tsx` bor, lekin ular `app/bot/[id]/send-message` va `app/bot/[id]/files` page’larida to‘g‘ridan-to‘g‘ri ishlatilmaydi. `files` faqat `FilesMainPage` orqali, `send-message` esa boshqa joyda ishlatilishi mumkin.

**Tavsiya:** Har bir route uchun aniq feature moduli bo‘lsin va app page’lari faqat shu modullardan import qilsin.

---

## Qisqacha tavsiyalar

1. App’dagi murakkab logikani `features/` ga ko‘chiring.
2. Monitoring transform/utils kodini `features/monitoring` ga birlashtiring.
3. App’dan page import qilishni to‘xtating; collection logikasi `features` da bo‘lsin.
4. `emty-release` → `empty-release`, `relase` → `release`, `botmather` → `botmother` typo’larni tuzating.
5. `page.old.tsx` kabi eski fayllarni olib tashlang.
6. Types’larni `shared` va `features` o‘rtasida aniq taqsimlang.
