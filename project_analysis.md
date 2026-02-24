# Loyiha Tahlili Hisoboti

Sana: 2/18/2026, 7:33:37 PM

## 📁 Fayl Strukturasi

```
admin-panel
├── .env
├── .env.example
├── .github
│   └── workflows
│       └── deploy.yaml
├── .gitignore
├── .husky
│   └── pre-push
├── Dockerfile
├── FEATURE_README.md
├── README.md
├── TEMPLATE_EARNINGS_IMPLEMENTATION.md
├── VISUAL_GUIDE.md
├── Your Project API.yaml
├── api.md
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── scripts
│   └── analis_project.js
├── src
│   ├── app
│   │   ├── [lang]
│   │   │   ├── (monitoring)
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ReactQueryProvider.tsx
│   │   │   ├── auth
│   │   │   │   └── login
│   │   │   │       ├── layout.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── billing
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── bot
│   │   │   │   ├── [id]
│   │   │   │   │   ├── collection
│   │   │   │   │   │   ├── components
│   │   │   │   │   │   │   ├── add-collection-modal.tsx
│   │   │   │   │   │   │   ├── add-item-sheet.tsx
│   │   │   │   │   │   │   ├── collection-item-combobox.tsx
│   │   │   │   │   │   │   ├── collection-modal.tsx
│   │   │   │   │   │   │   ├── content-table.tsx
│   │   │   │   │   │   │   ├── data-rows.tsx
│   │   │   │   │   │   │   ├── delete-collection-dialog.tsx
│   │   │   │   │   │   │   ├── delete-item-dialog.tsx
│   │   │   │   │   │   │   ├── edit-collection-sheet.tsx
│   │   │   │   │   │   │   ├── edit-item-sheet.tsx
│   │   │   │   │   │   │   ├── empty-state.tsx
│   │   │   │   │   │   │   ├── new-item-row.tsx
│   │   │   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   │   │   ├── table-header.tsx
│   │   │   │   │   │   │   └── utils.ts
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── files
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── messages
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── monitoring
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── plans
│   │   │   │   │   │   ├── components
│   │   │   │   │   │   │   ├── confetti-animation.tsx
│   │   │   │   │   │   │   ├── confirmation-dialog.tsx
│   │   │   │   │   │   │   ├── enterprise-card.tsx
│   │   │   │   │   │   │   ├── enterprise-price-dialog.tsx
│   │   │   │   │   │   │   ├── insufficient-balance-dialog.tsx
│   │   │   │   │   │   │   ├── plan-card.tsx
│   │   │   │   │   │   │   ├── plans-header.tsx
│   │   │   │   │   │   │   ├── types.ts
│   │   │   │   │   │   │   └── utils.ts
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── release
│   │   │   │   │   │   ├── bot-info.tsx
│   │   │   │   │   │   ├── emty-release.tsx
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── versions-section.tsx
│   │   │   │   │   ├── send-message
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   ├── page.old.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── send-new-message
│   │   │   │   │   │       ├── layout.tsx
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── web-app
│   │   │   │   │       ├── layout.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── files
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout-controller.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── market
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── profile
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── template-earnings
│   │   │   │   └── page.tsx
│   │   │   ├── template-submissions
│   │   │   │   ├── [id]
│   │   │   │   │   ├── edit
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── templates
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── test
│   │   │   │   └── page.tsx
│   │   │   └── tickets
│   │   │       ├── [id]
│   │   │       │   ├── layout.tsx
│   │   │       │   └── page.tsx
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   └── auth
│   │   │       ├── [...nextauth]
│   │   │       │   ├── option.ts
│   │   │       │   └── route.ts
│   │   │       └── next-auth.d.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   └── nprogress.css
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
│   │   │   ├── balance-card.tsx
│   │   │   ├── payment-card.tsx
│   │   │   ├── payment-history-table.tsx
│   │   │   └── payment-methods-section.tsx
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
│   │   ├── files
│   │   │   ├── components
│   │   │   │   ├── file-grid.tsx
│   │   │   │   ├── file-table.tsx
│   │   │   │   ├── files-empty.tsx
│   │   │   │   └── upload-file-modal.tsx
│   │   │   ├── main-page.tsx
│   │   │   └── types
│   │   │       └── file.ts
│   │   ├── monitoring
│   │   │   ├── dashboard
│   │   │   │   ├── cpu-card.tsx
│   │   │   │   ├── disk-card.tsx
│   │   │   │   ├── ram-card.tsx
│   │   │   │   ├── resource-card.tsx
│   │   │   │   ├── status-bar.tsx
│   │   │   │   └── traffic-card.tsx
│   │   │   └── types
│   │   │       └── monitoring.ts
│   │   ├── templates
│   │   │   ├── components
│   │   │   │   ├── create-project-alert.tsx
│   │   │   │   ├── create-withdrawal-dialog.tsx
│   │   │   │   ├── submit-template-dialog.tsx
│   │   │   │   ├── template-card-skeletion.tsx
│   │   │   │   ├── template-card.tsx
│   │   │   │   └── withdrawal-list.tsx
│   │   │   └── types
│   │   │       ├── order.ts
│   │   │       ├── submission.ts
│   │   │       ├── template.ts
│   │   │       └── withdrawal.ts
│   │   └── tickets
│   │       ├── components
│   │       │   ├── create-ticket-modal.tsx
│   │       │   └── ticket-list-table.tsx
│   │       └── types
│   │           └── ticket.ts
│   ├── middleware.ts
│   ├── postcss.config.mjs
│   └── shared
│       ├── components
│       │   ├── activity-section.tsx
│       │   ├── app-sidebar.tsx
│       │   ├── common
│       │   │   ├── analitics.tsx
│       │   │   ├── badge
│       │   │   │   └── container-badge.tsx
│       │   │   └── delete-modal
│       │   │       └── delete-modal.tsx
│       │   ├── dashboard-header.tsx
│       │   ├── documents-table.tsx
│       │   ├── error-boundary.tsx
│       │   ├── growth-chart.tsx
│       │   ├── metric-card.tsx
│       │   ├── page-header.tsx
│       │   ├── profile-billing.tsx
│       │   ├── select-plan.tsx
│       │   ├── sidebar-inset-header.tsx
│       │   ├── statistic-cards.tsx
│       │   ├── theme-provider.tsx
│       │   ├── toggler.tsx
│       │   ├── top-loading-bar.tsx
│       │   ├── ui
│       │   │   ├── alert-dialog.tsx
│       │   │   ├── avatar.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── border-beam.tsx
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
│       │   ├── parce-pice.ts
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
│       │       ├── file.ts
│       │       ├── message.ts
│       │       ├── monitoring.ts
│       │       ├── template-submission.ts
│       │       └── template-withdrawal.ts
│       ├── store
│       │   ├── chat-message.ts
│       │   └── count.ts
│       └── types
│           ├── bot.ts
│           ├── collection.ts
│           ├── http.ts
│           ├── message.ts
│           ├── messages.ts
│           ├── plan.ts
│           ├── project.ts
│           └── release.ts
├── stack.yaml
└── tsconfig.json
```

## 📄 Muhim Fayllar Tarkibi (içidan: constructor)

*Belgilangan `constructor` papkasidan o'qiladigan fayllar topilmadi.*
