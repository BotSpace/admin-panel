# Template Earnings Feature - Visual Guide

## 📁 File Structure

```
src/
├── app/[lang]/
│   ├── billing/
│   │   └── page.tsx                          # Updated to show template_balance
│   └── template-earnings/
│       └── page.tsx                          # ✨ NEW: Main earnings page
│
├── features/
│   ├── auth/types/
│   │   └── get-me.ts                         # Updated: Added template_balance
│   ├── billing/
│   │   └── balance-card.tsx                  # Updated: Shows dual balances
│   └── templates/
│       ├── components/
│       │   ├── create-withdrawal-dialog.tsx  # ✨ NEW: Withdrawal form
│       │   └── withdrawal-list.tsx           # ✨ NEW: Requests table
│       └── types/
│           └── withdrawal.ts                 # ✨ NEW: TypeScript types
│
└── shared/
    ├── config/
    │   └── navigations.ts                    # Updated: Added menu item
    └── services/requests/
        └── template-withdrawal.ts            # ✨ NEW: API service functions
```

## 🎨 UI Components Overview

### 1. Navigation Menu Item

**Location:** Sidebar under "Qo'shimchalar"

```
📁 Qo'shimchalar
  📚 Shablonlarim
  📤 Yuborilgan shablonlar
  💰 Shablon Daromadlari  ← NEW
  💳 To'lovlar
  🎫 Ticketlar
```

### 2. Billing Page - Updated Balance Display

**Route:** `/billing`

```
┌──────────────────────────────────────────────┐
│  Mavjud balans          Shablon daromadi     │
│                                              │
│  10,000 UZS            500 UZS               │
│  ^^^^^^^^^^^^          ^^^^^^^^^^            │
│  Regular balance       Template earnings     │
│                                              │
│  Maʼlumotlar har 15 soniyada avtomatik      │
│  yangilanadi                                 │
└──────────────────────────────────────────────┘
```

### 3. Template Earnings Page - Main View

**Route:** `/template-earnings`

```
┌────────────────────────────────────────────────────────┐
│  Shablon Daromadlari              [💰 Pul yechish]    │
│  Shablonlaringizdan olingan daromadlarni boshqaring    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────────────┐  ┌─────────────────────┐    │
│  │ 💵 Shablon Balansi  │  │ 📊 Jami So'rovlar   │    │
│  │                     │  │                     │    │
│  │ 500 UZS            │  │ 5                   │    │
│  │ Yechish uchun      │  │ Barcha pul yechish  │    │
│  │ mavjud balans      │  │ so'rovlari          │    │
│  └─────────────────────┘  └─────────────────────┘    │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ℹ️ Qanday ishlaydi?                                  │
│                                                        │
│  1. Shablon sotilganda: Har bir sotuvdan 80%          │
│     sizning shablon balansingizga qo'shiladi          │
│  2. Pul yechish so'rovi: Balansda pul bo'lsa...      │
│  3. Tasdiqlash: Administrator so'rovingizni...        │
├────────────────────────────────────────────────────────┤
│  Pul Yechish So'rovlari                               │
│  Barcha pul yechish so'rovlaringiz ro'yxati           │
│                                                        │
│  ┌────────────────────────────────────────────┐       │
│  │ Sana       Miqdor    Karta    Status  ⚙️  │       │
│  ├────────────────────────────────────────────┤       │
│  │ 08.01.2026 500 UZS   8600... ⏱️Kutilmoqda │🗑️     │
│  │ 10:30      50000     JOHN    ✅Tasdiqlangan│       │
│  │ 07.01.2026 1000 UZS  9860... ❌Rad etilgan │       │
│  └────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────┘
```

### 4. Create Withdrawal Dialog

**Triggered by:** "Pul yechish" button

```
┌─────────────────────────────────────────┐
│  Pul yechish so'rovi                [✕] │
│  Shablon daromadingizdan pul yechish    │
│  uchun ma'lumotlarni kiriting           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Mavjud balans                     │  │
│  │ 500 UZS                           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Miqdor (UZS)                          │
│  ┌───────────────────────────────────┐  │
│  │ 50000                             │  │
│  └───────────────────────────────────┘  │
│  Yechmoqchi bo'lgan pulning miqdori    │
│                                         │
│  Karta raqami                          │
│  ┌───────────────────────────────────┐  │
│  │ 8600 1234 5678 9012               │  │
│  └───────────────────────────────────┘  │
│  13-19 raqamli plastik karta           │
│                                         │
│  Karta egasi                           │
│  ┌───────────────────────────────────┐  │
│  │ JOHN DOE                          │  │
│  └───────────────────────────────────┘  │
│  Kartada yozilgan ism familiya         │
│                                         │
│        [Bekor qilish] [So'rov yuborish] │
└─────────────────────────────────────────┘
```

### 5. Withdrawal List - Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│           ⏱️                             │
│                                         │
│     So'rovlar yo'q                      │
│                                         │
│  Hozircha pul yechish so'rovlari yo'q.  │
│  Yuqoridagi tugma orqali yangi so'rov   │
│  yaratishingiz mumkin.                  │
│                                         │
└─────────────────────────────────────────┘
```

### 6. Status Badges

```
⏱️ Kutilmoqda   - Gray badge with clock icon
✅ Tasdiqlangan - Blue badge with check icon
❌ Rad etilgan  - Red badge with X icon
```

## 🔄 User Interactions

### Creating Withdrawal Request

```
User clicks "Pul yechish"
    ↓
Dialog opens with form
    ↓
User fills in:
- Amount: 50000
- Card: 8600 1234 5678 9012 (auto-formatted)
- Owner: JOHN DOE (auto-uppercase)
    ↓
User clicks "So'rov yuborish"
    ↓
Validation checks:
✓ Amount > 0
✓ Amount ≤ Balance
✓ Card number 13-19 digits
✓ Owner 3-255 chars
    ↓
API call: POST /api/template/withdrawal/
    ↓
Success! 🎉
    ↓
Toast notification: "So'rov yuborildi"
    ↓
Dialog closes
    ↓
Data refreshes automatically
```

### Deleting Pending Request

```
User clicks 🗑️ on pending request
    ↓
Confirmation dialog appears
    ↓
User confirms deletion
    ↓
API call: DELETE /api/template/withdrawal/{id}/
    ↓
Success! 🎉
    ↓
Toast notification: "O'chirildi"
    ↓
List refreshes automatically
```

## 🎯 Key Features

### Validation

✅ **Amount Validation:**
- Must be > 0
- Cannot exceed template_balance
- Real-time error messages

✅ **Card Number Validation:**
- Auto-formatting (groups of 4)
- 13-19 digits only
- Spaces are removed on submit

✅ **Card Owner Validation:**
- Auto-uppercase
- 3-255 characters
- Letters and spaces

### Real-time Updates

⏱️ **Balance:** Refreshes every 15 seconds
🔄 **After Create:** Both balance and list refresh
🔄 **After Delete:** List refreshes

### Status-based UI

| Status | Badge | Icon | Can Delete? |
|--------|-------|------|-------------|
| pending | Gray | ⏱️ | Yes |
| approved | Blue | ✅ | No |
| rejected | Red | ❌ | No |

## 📱 Responsive Design

- **Mobile:** Single column, stacked cards
- **Tablet:** Two-column grid for balance cards
- **Desktop:** Full table view, optimal spacing

## 🎨 Color Scheme

- **Primary:** Template balance amounts (blue)
- **Secondary:** Pending status (gray)
- **Success:** Approved status (green/blue)
- **Destructive:** Rejected status, delete actions (red)
- **Muted:** Helper text, descriptions (gray)

## 🔔 Notifications (Toast)

### Success Messages
✅ "So'rov yuborildi" - After creating request
✅ "O'chirildi" - After deleting request

### Error Messages
❌ "Balans yetarli emas" - Amount exceeds balance
❌ "So'rovni yuborishda xatolik" - API error
❌ "So'rovni o'chirishda xatolik" - Delete error

## 🔗 API Integration

All API calls use authenticated `instanceAuth` from Axios:

```typescript
// List requests
GET /api/template/withdrawal/

// Create request
POST /api/template/withdrawal/
Body: { amount, card_number, card_owner }

// Delete request
DELETE /api/template/withdrawal/{id}/

// Get balance (includes template_balance)
GET /api/user/balance/
```

## 🎓 Code Quality

✅ TypeScript strict mode
✅ Zod schema validation
✅ React Hook Form integration
✅ Proper error handling
✅ Loading states with skeletons
✅ Consistent naming conventions
✅ Clean component structure
✅ Reusable utilities
✅ Type-safe API calls
