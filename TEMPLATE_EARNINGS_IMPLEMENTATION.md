# Template Earnings and Withdrawal System - Frontend Implementation

## Overview

This implementation adds the frontend UI for the template earnings and withdrawal system described in the problem statement. Users can now view their template earnings balance and request withdrawals directly from the admin panel.

## Features Implemented

### 1. Template Balance Display

**Location:** `/billing` page

The billing page now shows two balances:
- **Regular Balance** (UZS): For general platform usage
- **Template Balance** (UZS): Earnings from template sales (80% of each sale)

The template balance appears automatically when the user has earned money from template sales.

### 2. Template Earnings Page

**Route:** `/template-earnings`

A dedicated page for managing template earnings with the following sections:

#### Balance Cards
- **Template Balance Card**: Shows available balance for withdrawal
- **Total Requests Card**: Shows count of all withdrawal requests

#### Information Section
Explains how the system works:
1. Template sales commission (80% to author, 20% to platform)
2. How to create withdrawal requests
3. Admin approval process

#### Withdrawal Requests List
Displays all withdrawal requests with:
- Creation date and time
- Amount requested
- Card number (formatted)
- Card owner name
- Status badge (pending/approved/rejected)
- Rejection reason (if applicable)
- Delete action (for pending requests only)

### 3. Create Withdrawal Request

**Component:** `CreateWithdrawalDialog`

A dialog form for creating new withdrawal requests with:

#### Fields:
- **Amount** (required): Amount to withdraw in UZS
- **Card Number** (required): 13-19 digit card number with auto-formatting
- **Card Owner** (required): Cardholder name (auto-uppercase)

#### Validation:
- Amount must be greater than 0
- Amount cannot exceed available balance
- Card number must be 13-19 digits
- Card number accepts spaces (removed on submit)
- Card owner must be 3-255 characters

#### Features:
- Real-time card number formatting (groups of 4 digits)
- Auto-uppercase for card owner
- Balance check before submission
- Success/error toast notifications
- Auto-refresh data after successful submission

### 4. Navigation

Added new menu item in the sidebar:
- **Title:** "Shablon Daromadlari"
- **Icon:** Wallet
- **Route:** `/template-earnings`
- **Location:** Under "Qo'shimchalar" section

## Technical Implementation

### New Files Created

1. **Types:**
   - `/src/features/templates/types/withdrawal.ts`
     - `TemplateWithdrawalRequest`: Full withdrawal request object
     - `CreateWithdrawalRequest`: Request creation payload
     - `WithdrawalStatus`: Status enum (pending/approved/rejected)

2. **Services:**
   - `/src/shared/services/requests/template-withdrawal.ts`
     - `getWithdrawalRequests()`: List all requests
     - `getWithdrawalRequest(id)`: Get single request
     - `createWithdrawalRequest(data)`: Create new request
     - `deleteWithdrawalRequest(id)`: Delete pending request

3. **Components:**
   - `/src/features/templates/components/create-withdrawal-dialog.tsx`
     - Modal form for creating withdrawal requests
   - `/src/features/templates/components/withdrawal-list.tsx`
     - Table component for displaying withdrawal requests

4. **Pages:**
   - `/src/app/[lang]/template-earnings/page.tsx`
     - Main template earnings management page

### Modified Files

1. **Types:**
   - `/src/features/auth/types/get-me.ts`
     - Added `template_balance: string` to Balance interface

2. **Components:**
   - `/src/features/billing/balance-card.tsx`
     - Added templateBalance prop and display logic

3. **Pages:**
   - `/src/app/[lang]/billing/page.tsx`
     - Pass template_balance to BalanceCard

4. **Configuration:**
   - `/src/shared/config/navigations.ts`
     - Added "Shablon Daromadlari" navigation item
     - Imported Wallet icon from lucide-react

## API Endpoints Used

### GET `/api/user/balance/`
**Response:**
```json
{
  "status": true,
  "data": {
    "balance": 10000,
    "template_balance": "500.00"
  }
}
```

### GET `/api/template/withdrawal/`
**Response:**
```json
{
  "status": true,
  "data": {
    "links": {
      "previous": null,
      "next": null
    },
    "total_items": 5,
    "total_pages": 1,
    "page_size": 30,
    "current_page": 1,
    "results": [
      {
        "id": 1,
        "user": 1,
        "amount": "500.00",
        "card_number": "8600123456789012",
        "card_owner": "JOHN DOE",
        "status": "pending",
        "rejection_reason": null,
        "reviewed_by": null,
        "reviewed_at": null,
        "created_at": "2026-01-08T12:00:00Z",
        "updated_at": "2026-01-08T12:00:00Z"
      }
    ]
  }
}
```

### POST `/api/template/withdrawal/`
**Request:**
```json
{
  "amount": "500.00",
  "card_number": "8600123456789012",
  "card_owner": "JOHN DOE"
}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "user": 1,
    "amount": "500.00",
    "card_number": "8600123456789012",
    "card_owner": "JOHN DOE",
    "status": "pending",
    ...
  }
}
```

### DELETE `/api/template/withdrawal/{id}/`
**Response:** 204 No Content

## User Flow

### Creating a Withdrawal Request

1. User navigates to "Shablon Daromadlari" from sidebar
2. Checks available template balance
3. Clicks "Pul yechish" button
4. Fills in withdrawal form:
   - Enters amount
   - Enters card number (auto-formatted)
   - Enters cardholder name (auto-uppercase)
5. Clicks "So'rov yuborish"
6. System validates:
   - Amount is positive
   - Amount doesn't exceed balance
   - Card number format is correct
7. Request is created with "pending" status
8. Success message shown
9. Balance and request list auto-refresh

### Viewing Requests

1. User sees all requests in table format
2. Each request shows:
   - Date/time created
   - Amount with UZS currency
   - Card number (formatted with spaces)
   - Cardholder name
   - Status badge with icon
   - Rejection reason (if rejected)

### Deleting Pending Requests

1. User clicks trash icon on pending request
2. Confirmation dialog appears
3. User confirms deletion
4. Request is deleted
5. Success message shown
6. List auto-refreshes

### Status Badge Colors

- **Pending** (secondary/gray): Clock icon
- **Approved** (default/blue): CheckCircle2 icon
- **Rejected** (destructive/red): XCircle icon

## Styling

- Uzbek language text throughout
- Consistent with existing admin panel design
- Uses shadcn/ui components
- Responsive grid layout (mobile/tablet/desktop)
- Color-coded status badges
- Hover effects and transitions
- Loading skeletons for async data

## Error Handling

- Form validation with Zod schema
- API error messages displayed via toast
- Balance insufficient check before submission
- Network error handling
- Delete confirmation dialog

## Data Refresh

- Balance refreshes every 15 seconds
- Withdrawal list refreshes after:
  - Creating new request
  - Deleting request
- Manual refresh on form submission success

## Dependencies

All required dependencies are already installed:
- `react-hook-form` (v7.68.0) - Form handling
- `@hookform/resolvers` (v5.2.2) - Zod integration
- `zod` (v4.1.13) - Schema validation
- `sonner` (v2.0.7) - Toast notifications
- `date-fns` (v4.1.0) - Date formatting
- `lucide-react` (v0.561.0) - Icons

## Testing Checklist

To test this implementation:

1. **Balance Display**
   - [ ] Navigate to /billing
   - [ ] Verify template_balance shows if > 0
   - [ ] Verify auto-refresh every 15 seconds

2. **Template Earnings Page**
   - [ ] Navigate to /template-earnings
   - [ ] Verify balance cards display correctly
   - [ ] Verify info card explains the process
   - [ ] Verify empty state shows when no requests

3. **Create Withdrawal**
   - [ ] Click "Pul yechish" button
   - [ ] Try submitting with empty fields (should fail)
   - [ ] Try amount > balance (should fail)
   - [ ] Try invalid card number (should fail)
   - [ ] Enter valid data and submit
   - [ ] Verify success message
   - [ ] Verify new request appears in list

4. **Withdrawal List**
   - [ ] Verify all requests display correctly
   - [ ] Verify status badges show correct color/icon
   - [ ] Verify rejection reasons display (if any)
   - [ ] Verify date/time formatting

5. **Delete Request**
   - [ ] Click trash icon on pending request
   - [ ] Verify confirmation dialog appears
   - [ ] Cancel and verify no deletion
   - [ ] Confirm and verify deletion
   - [ ] Verify success message

6. **Responsive Design**
   - [ ] Test on mobile viewport
   - [ ] Test on tablet viewport
   - [ ] Test on desktop viewport

## Future Enhancements

Potential improvements for future iterations:

1. **Pagination**: Add pagination for withdrawal requests list
2. **Filtering**: Filter by status (pending/approved/rejected)
3. **Export**: Download withdrawal history as CSV/PDF
4. **Notifications**: Email/Telegram notifications for status changes
5. **History**: Separate approved/rejected tab
6. **Analytics**: Charts showing earnings over time
7. **Multi-language**: Add full i18n support
8. **Card Verification**: Validate card numbers with Luhn algorithm

## Notes

- The backend API endpoints should already be implemented per the problem statement
- Commission distribution (80/20 split) is handled by the backend
- Admin approval workflow is handled in Django Admin (not in this frontend)
- Template balance is separate from regular balance
- Only pending withdrawals can be deleted
- Amounts are stored as decimal strings to preserve precision
