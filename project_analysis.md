# Loyiha Tahlili Hisoboti

Sana: 11/26/2025, 12:11:13 PM

## 📁 Fayl Strukturasi

```
admin-panel
├── .env
├── .env.example
├── .github
│   └── workflows
│       └── deploy.yaml
├── .gitignore
├── Dockerfile
├── README.md
├── api.yaml
├── components.json
├── just.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── scripts
│   └── analis_project.js
├── src
│   ├── app
│   │   ├── [lang]
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ReactQueryProvider.tsx
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register
│   │   │   │       └── page.tsx
│   │   │   ├── billing
│   │   │   │   └── page.tsx
│   │   │   ├── bot
│   │   │   │   └── [id]
│   │   │   │       ├── collection
│   │   │   │       │   ├── components
│   │   │   │       │   │   ├── add-collection-modal.tsx
│   │   │   │       │   │   ├── add-item-sheet.tsx
│   │   │   │       │   │   ├── collection-modal.tsx
│   │   │   │       │   │   ├── content-table.tsx
│   │   │   │       │   │   ├── data-rows.tsx
│   │   │   │       │   │   ├── delete-collection-dialog.tsx
│   │   │   │       │   │   ├── delete-item-dialog.tsx
│   │   │   │       │   │   ├── edit-collection-sheet.tsx
│   │   │   │       │   │   ├── edit-item-sheet.tsx
│   │   │   │       │   │   ├── empty-state.tsx
│   │   │   │       │   │   ├── new-item-row.tsx
│   │   │   │       │   │   ├── sidebar.tsx
│   │   │   │       │   │   ├── table-header.tsx
│   │   │   │       │   │   └── utils.ts
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── layout.tsx
│   │   │   │       ├── page.tsx
│   │   │   │       ├── release
│   │   │   │       │   ├── bot-info.tsx
│   │   │   │       │   ├── emty-release.tsx
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   ├── staging-section.tsx
│   │   │   │       │   └── versions-section.tsx
│   │   │   │       ├── send-message
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   └── send-new-message
│   │   │   │       │       └── page.tsx
│   │   │   │       └── settings
│   │   │   │           └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── layout-controller.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── market
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── remove-me.tsx
│   │   │   └── templates
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   └── auth
│   │   │       ├── [...nextauth]
│   │   │       │   ├── option.ts
│   │   │       │   └── route.ts
│   │   │       └── next-auth.d.ts
│   │   ├── globals copy.css
│   │   └── globals.css
│   ├── components
│   │   └── ui
│   │       └── button.tsx
│   ├── features
│   │   ├── auth
│   │   │   ├── components
│   │   │   │   ├── appearance-section.tsx
│   │   │   │   ├── danger-section.tsx
│   │   │   │   ├── language-section.tsx
│   │   │   │   ├── notification-section.tsx
│   │   │   │   ├── password-section.tsx
│   │   │   │   ├── profile-form.tsx
│   │   │   │   └── profile-info-section.tsx
│   │   │   └── types
│   │   │       ├── get-me.ts
│   │   │       ├── login.ts
│   │   │       └── profile.ts
│   │   ├── billing
│   │   │   ├── add-funds-modal.tsx
│   │   │   ├── balance-card.tsx
│   │   │   ├── billing-settings.tsx
│   │   │   ├── expense-details-table.tsx
│   │   │   ├── invoices-section.tsx
│   │   │   ├── payment-methods-section.tsx
│   │   │   ├── topup-history-table.tsx
│   │   │   └── usage-overview.tsx
│   │   ├── bot
│   │   │   ├── botSchema.ts
│   │   │   └── components
│   │   │       ├── bot-card.tsx
│   │   │       ├── bot-settings.tsx
│   │   │       ├── create-new-bot.tsx
│   │   │       ├── files.tsx
│   │   │       ├── inline-buttons.tsx
│   │   │       ├── message-preview.tsx
│   │   │       └── send-message.tsx
│   │   └── templates
│   │       ├── components
│   │       │   ├── create-project-alert.tsx
│   │       │   ├── template-card-skeletion.tsx
│   │       │   └── template-card.tsx
│   │       └── types
│   │           ├── order.ts
│   │           └── template.ts
│   ├── middleware.ts
│   ├── postcss.config.mjs
│   └── shared
│       ├── components
│       │   ├── activity-section.tsx
│       │   ├── app-sidebar.tsx
│       │   ├── common
│       │   │   ├── badge
│       │   │   │   └── container-badge.tsx
│       │   │   └── delete-modal
│       │   │       └── delete-modal.tsx
│       │   ├── dashboard-header.tsx
│       │   ├── documents-table.tsx
│       │   ├── error-boundary.tsx
│       │   ├── growth-chart.tsx
│       │   ├── metric-card.tsx
│       │   ├── profile-billing.tsx
│       │   ├── statistic-cards.tsx
│       │   ├── theme-provider.tsx
│       │   ├── toggler.tsx
│       │   ├── ui
│       │   │   ├── alert-dialog.tsx
│       │   │   ├── avatar.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── breadcrumb.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── chart.tsx
│       │   │   ├── checkbox.tsx
│       │   │   ├── command.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── form.tsx
│       │   │   ├── input-otp.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── pagination.tsx
│       │   │   ├── popover.tsx
│       │   │   ├── progress.tsx
│       │   │   ├── radio-group.tsx
│       │   │   ├── scroll-area.tsx
│       │   │   ├── select.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── sheet.tsx
│       │   │   ├── sidebar.tsx
│       │   │   ├── skeleton.tsx
│       │   │   ├── slider.tsx
│       │   │   ├── sonner.tsx
│       │   │   ├── switch.tsx
│       │   │   ├── table.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── textarea.tsx
│       │   │   ├── toggle-group.tsx
│       │   │   ├── toggle.tsx
│       │   │   └── tooltip.tsx
│       │   └── visitor-chart.tsx
│       ├── config
│       │   └── navigations.ts
│       ├── hooks
│       │   ├── use-debounces.tsx
│       │   └── use-mobile.ts
│       ├── i18n
│       │   ├── request.ts
│       │   └── routing.ts
│       ├── lib
│       │   ├── constants.ts
│       │   ├── env.ts
│       │   ├── error-handler.ts
│       │   ├── format-currency.ts
│       │   ├── input-validators.ts
│       │   ├── query-generator.ts
│       │   └── utils.ts
│       ├── messages
│       │   ├── en.json
│       │   ├── jp.json
│       │   ├── ru.json
│       │   └── uz.json
│       ├── services
│       │   ├── instance.ts
│       │   ├── react-query
│       │   │   ├── index.ts
│       │   │   ├── use-react-query-action.ts
│       │   │   └── use-scroll-query-action.ts
│       │   └── requests
│       │       ├── auth.ts
│       │       └── message.ts
│       ├── store
│       │   ├── chat-message.ts
│       │   └── count.ts
│       └── types
│           ├── bot.ts
│           ├── collection.ts
│           ├── http.ts
│           ├── message.ts
│           ├── project.ts
│           └── release.ts
├── stack.yaml
└── tsconfig.json
```

## 📄 Muhim Fayllar Tarkibi (içidan: constructor)

*Belgilangan `constructor` papkasidan o'qiladigan fayllar topilmadi.*
