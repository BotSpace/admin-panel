# Loyiha Tahlili Hisoboti

Sana: 11/12/2025, 12:04:33 AM

## 📁 Fayl Strukturasi

```
constructor-manager
├── .env.local
├── .gitignore
├── Dockerfile
├── README.md
├── example.env
├── just.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── salom.py
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
│   │   │   ├── bot
│   │   │   │   └── [id]
│   │   │   │       ├── layout.tsx
│   │   │   │       ├── page.tsx
│   │   │   │       ├── release
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
│   │   │   └── remove-me.tsx
│   │   ├── api
│   │   │   └── auth
│   │   │       ├── [...nextauth]
│   │   │       │   ├── option.ts
│   │   │       │   └── route.ts
│   │   │       └── next-auth.d.ts
│   │   └── globals.css
│   ├── components.json
│   ├── features
│   │   ├── auth
│   │   │   ├── components
│   │   │   ├── hooks
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   └── types
│   │   │       ├── get-me.ts
│   │   │       └── login.tsx
│   │   ├── bot
│   │   │   ├── botSchema.ts
│   │   │   ├── components
│   │   │   │   ├── bot-card.tsx
│   │   │   │   ├── bot-settings.tsx
│   │   │   │   ├── create-new-bot.tsx
│   │   │   │   ├── files.tsx
│   │   │   │   ├── message-preview.tsx
│   │   │   │   └── send-message.tsx
│   │   │   ├── hooks
│   │   │   ├── pages
│   │   │   ├── services
│   │   │   └── types
│   │   └── market
│   │       ├── components
│   │       ├── hooks
│   │       ├── pages
│   │       ├── services
│   │       └── types
│   ├── middleware.ts
│   ├── next-env.d.ts
│   ├── postcss.config.mjs
│   └── shared
│       ├── components
│       │   ├── activity-section.tsx
│       │   ├── app-sidebar.tsx
│       │   ├── common
│       │   │   ├── badge
│       │   │   │   └── badge.tsx
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
│       │       └── auth.ts
│       ├── store
│       │   ├── chat-message.ts
│       │   └── count.ts
│       └── types
│           ├── bot.ts
│           ├── http.ts
│           ├── project.ts
│           └── release.ts
└── tsconfig.json
```

## 📄 Muhim Fayllar Tarkibi (içidan: constructor)

*Belgilangan `constructor` papkasidan o'qiladigan fayllar topilmadi.*
