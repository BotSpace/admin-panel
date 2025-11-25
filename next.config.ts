import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");
import env from "@/shared/lib/env";

const constructor_rewrites = [
  // Media files - constructor
  {
    source: "/:lang/bot/:bot/constructor/_next/image",
    destination: `${env.CONSTRUCTOR_URL}/share/_next/image`,
  },

  // Media files - sales (new child)
  {
    source: "/:lang/bot/:bot/sales/_next/image",
    destination: `${env.SALES_URL}/share/_next/image`,
  },

  // constructor (existing child)
  {
    source: "/share/:path*",
    destination: `${env.CONSTRUCTOR_URL}/share/:path*`,
  },
  {
    source: "/:lang/bot/:bot/constructor",
    destination: `${env.CONSTRUCTOR_URL}/share/:lang/:bot`,
  },
];

const website_rewrites = [
  // Barcha website sahifalarini proksi qilish
  {
    source: "/:lang/website/:path*",
    destination: `${env.SALES_URL}/website/:lang/:path*`,
  },
  {
    source: "/api/:path*",
    destination: `${env.SALES_URL}/website/api/:path*`,
  },

  // media (static files, chunks, images)
  {
    source: "/website/_next/:path*",
    destination: `${env.SALES_URL}/website/_next/:path*`,
  },
];

export default withNextIntl({
  async rewrites() {
    return [...constructor_rewrites, ...website_rewrites];
  },
  images: {
    domains: ["localhost", "localhost:3002", "api.botmother.uz", "192.168.3.1:3000"], // SALES_URL domeni
  },
});
