# Botmather - Telegram Bot Constructor Manager

Botmather - bu Telegram botlarini yaratish va boshqarish uchun professional platforma. Vizual konstruktor, real-time analytics va kuchli boshqaruv paneli bilan.

## 🚀 Xususiyatlar

- **Vizual Bot Konstruktor** - Kod yozmasdan bot yarating
- **Real-time Analytics** - Bot faoliyatini kuzating
- **Multi-language Support** - O'zbek, Rus, Ingliz, Yapon tillari
- **Secure Authentication** - Telegram OTP orqali xavfsiz kirish
- **Modern UI/UX** - Tailwind CSS va shadcn/ui komponentlari
- **Type Safety** - To'liq TypeScript qo'llab-quvvatlash
- **Error Handling** - Professional error boundary va retry strategiya
- **Performance Optimized** - React Query cache va lazy loading

## 🛠 Texnologiyalar

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Zustand, React Query
- **Authentication:** NextAuth.js
- **Internationalization:** next-intl
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Notifications:** React Hot Toast

## 📦 O'rnatish

1. **Repository'ni clone qiling:**
```bash
git clone https://github.com/your-username/botmather.git
cd botmather
```

2. **Dependencies'ni o'rnating:**
```bash
npm install
# yoki
yarn install
# yoki
pnpm install
```

3. **Environment variables'ni sozlang:**
```bash
cp example.env .env.local
```

`.env.local` faylini tahrirlang:
```env
NEXT_PUBLIC_API="https://your-api-url.com"
CONSTRUCTOR_URL="https://your-constructor-url.com"
NEXTAUTH_SECRET="your-secret-key-here"
DEBUG="true"
```

4. **Development server'ni ishga tushiring:**
```bash
npm run dev
# yoki
yarn dev
# yoki
pnpm dev
```

5. **Brauzerda oching:** [http://localhost:3000](http://localhost:3000)

## 🏗 Loyiha Strukturasi

```
botmather/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalization
│   │   ├── auth/          # Authentication pages
│   │   ├── bot/           # Bot management
│   │   └── market/        # Bot marketplace
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── common/           # Common components
│   └── theme/            # Theme components
├── lib/                  # Utility functions
├── services/             # API services
├── types/                # TypeScript types
├── messages/             # i18n translations
└── hooks/                # Custom React hooks
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint check

### Code Quality

Loyiha quyidagi best practice'lar bilan qurilgan:

- ✅ **Type Safety** - To'liq TypeScript
- ✅ **Error Boundaries** - Global error handling
- ✅ **Environment Validation** - Zod bilan env validation
- ✅ **Performance** - React Query cache strategiya
- ✅ **Security** - Production-ready security
- ✅ **i18n** - Multi-language support
- ✅ **Clean Code** - Consistent naming va structure

## 🌐 Deployment

### Vercel (Recommended)

1. GitHub'ga push qiling
2. [Vercel](https://vercel.com)'ga connect qiling
3. Environment variables'ni sozlang
4. Deploy!

### Docker

```bash
docker build -t botmather .
docker run -p 3000:3000 botmather
```

## 📱 API Integration

Loyiha REST API bilan ishlaydi. API endpoints:

- `POST /api/auth/login` - Authentication
- `GET /api/project/` - Bot list
- `POST /api/project/` - Create bot
- `PUT /api/project/:id` - Update bot
- `DELETE /api/project/:id` - Delete bot

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. Commit qiling (`git commit -m 'Add amazing feature'`)
4. Push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📄 License

Bu loyiha MIT litsenziyasi ostida tarqatiladi. Batafsil ma'lumot uchun [LICENSE](LICENSE) faylini ko'ring.

## 📞 Support

Savollar yoki muammolar bo'lsa:

- 📧 Email: support@botmather.com
- 💬 Telegram: [@botmather_support](https://t.me/botmather_support)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/botmather/issues)

---

**Botmather** - Telegram botlarini professional darajada yaratish va boshqarish uchun eng yaxshi yechim! 🚀
