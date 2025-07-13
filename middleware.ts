import { withAuth } from "next-auth/middleware";

import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const locales = ["en", "de"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null, // Faqat autentifikatsiyadan o'tgan foydalanuvchilar kirishi mumkin
    },
    pages: {
      signIn: "/en/auth/login", // Foydalanuvchi login qilmagan bo‘lsa, shu sahifaga yo‘naltiriladi
    },
  }
);

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/auth/login") {
    return intlMiddleware(req); // Faqat login sahifasiga localization middleware qo‘llanadi
  }
  return (authMiddleware as any)(req); // Barcha boshqa sahifalar private hisoblanadi
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Middleware faqat sahifalar uchun ishlaydi
};
