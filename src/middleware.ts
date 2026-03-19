import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { localeConfig } from "./shared/i18n/routing";

const intlMiddleware = createIntlMiddleware(localeConfig);

// Public route’larni aniqlaymiz
const publicPaths = [
  new RegExp(`^\\/(${localeConfig.locales.join("|")})\\/website(?:\\/.*)?$`),
  new RegExp(`^\\/website(?:\\/.*)?$`),
  // Landing page — root va /<lang>/ uchun auth shart emas
  new RegExp(`^\\/(${localeConfig.locales.join("|")})\\/?$`),
  new RegExp(`^\\/?$`),
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
      signIn: "/uz/auth",
      signOut: "/uz/website",
    },
  },
);

export default authMiddleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
