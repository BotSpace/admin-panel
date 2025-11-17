import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const locales = ["en", "uz", "ru", "jp"];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "uz",
});

// Public route’larni aniqlaymiz
const publicPaths = [
  // new RegExp(`^\\/(${locales.join("|")})\\/website(\\/.*)?$`),
  new RegExp(`^\\/(${locales.join("|")})\\/website(?:\\/.*)?$`),
];

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (publicPaths.some((pattern) => pattern.test(req.nextUrl.pathname))) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/uz/auth/login",
    },
  }
);

export default authMiddleware;

// export default function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // 1️⃣ Agar til yo'q bo'lsa, default til qo'shish
//   const hasLocale = localeConfig.locales.some((locale) =>
//     pathname.startsWith(`/${locale}`)
//   );
// }

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
