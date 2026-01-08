# Template Earnings & Withdrawal Feature - Quick Start

## 🚀 What's New?

This PR implements the frontend UI for the Template Earnings and Withdrawal System, allowing template authors to:
- ✅ View earnings from template sales
- ✅ Request withdrawals to their bank cards
- ✅ Track withdrawal request status
- ✅ Manage pending requests

## 📍 Where to Find It?

### Main Page
Navigate to: **Shablon Daromadlari** (Template Earnings) from the sidebar menu

### Billing Page
Updated to show both:
- Regular balance
- Template balance (earnings from template sales)

## 🎯 Quick User Guide

### 1. Check Your Earnings
1. Go to sidebar → "Shablon Daromadlari"
2. View your template balance in the top card
3. See total withdrawal requests count

### 2. Request Withdrawal
1. Click "Pul yechish" (Withdraw Money) button
2. Enter withdrawal details:
   - **Amount**: How much to withdraw (must be ≤ balance)
   - **Card Number**: 13-19 digit card number (auto-formatted)
   - **Card Owner**: Name as shown on card (auto-uppercase)
3. Click "So'rov yuborish" (Send Request)
4. Wait for admin approval

### 3. View Request Status
- **⏱️ Kutilmoqda (Pending)**: Awaiting admin review
- **✅ Tasdiqlangan (Approved)**: Money will be sent to your card
- **❌ Rad etilgan (Rejected)**: Request denied (see reason)

### 4. Delete Pending Request
1. Click 🗑️ icon on pending request
2. Confirm deletion
3. Request is removed

## 💡 How It Works

### Commission Split
When a user purchases your template:
- **80%** → Your template balance
- **20%** → Platform commission

### Withdrawal Process
```
You create request → Admin reviews → Admin approves → Money sent to card
```

## 🔧 For Developers

### New Files
```
src/app/[lang]/template-earnings/page.tsx
src/features/templates/components/create-withdrawal-dialog.tsx
src/features/templates/components/withdrawal-list.tsx
src/features/templates/types/withdrawal.ts
src/shared/services/requests/template-withdrawal.ts
```

### Modified Files
```
src/features/auth/types/get-me.ts
src/features/billing/balance-card.tsx
src/app/[lang]/billing/page.tsx
src/shared/config/navigations.ts
```

### API Endpoints Required
```
GET  /api/user/balance/                 (includes template_balance)
GET  /api/template/withdrawal/          (list requests)
POST /api/template/withdrawal/          (create request)
DELETE /api/template/withdrawal/{id}/   (delete pending)
```

### Dependencies
All required packages are already installed:
- react-hook-form
- @hookform/resolvers
- zod
- sonner
- date-fns
- lucide-react

## 📖 Documentation

- **TEMPLATE_EARNINGS_IMPLEMENTATION.md** - Full technical documentation
- **VISUAL_GUIDE.md** - UI mockups and user flows

## ✅ Testing Checklist

Backend API must be ready with:
- [ ] Template balance tracking
- [ ] Withdrawal request endpoints
- [ ] Commission distribution (80/20 split)
- [ ] Admin approval workflow

Frontend testing:
- [ ] Navigation to template earnings page
- [ ] Balance display on billing page
- [ ] Create withdrawal request with validation
- [ ] View withdrawal requests list
- [ ] Delete pending requests
- [ ] Status badges display correctly
- [ ] Responsive design works on all devices

## 🐛 Known Limitations

- Backend API must be implemented per problem statement
- Build may fail without proper environment variables (use .env.example)
- Admin approval is done in Django Admin (not in frontend)

## 🤝 Contributing

To continue development:
1. Ensure backend endpoints are ready
2. Test with real data
3. Add pagination if needed
4. Consider adding filters and export features

## 📞 Support

For issues or questions:
- Review documentation files
- Check TypeScript types
- Verify API endpoint responses match expected format

---

**Status:** ✅ Complete and Ready for Backend Integration
**Language:** 🇺🇿 Uzbek UI
**Framework:** Next.js 15 + TypeScript
