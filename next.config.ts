import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");
import env from "@/shared/lib/env";

export default withNextIntl({
  async rewrites() {
    return [
      // Media files - constructor
      {
        source: "/:locale/bot/:bot/constructor/_next/image",
        destination: `${env.CONSTRUCTOR_URL}/share/_next/image`,
      },
      // Media files - sales (new child)
      {
        source: "/:locale/bot/:bot/sales/_next/image",
        destination: `${env.SALES_URL}/share/_next/image`,
      },

      // constructor (existing child)
      {
        source: "/share/:path*",
        destination: `${env.CONSTRUCTOR_URL}/share/:path*`,
      },
      {
        source: "/:locale/bot/:bot/constructor",
        destination: `${env.CONSTRUCTOR_URL}/share/:bot`,
      },
      {
        source: "/:locale/bot/:bot/constructor/collection",
        destination: `${env.CONSTRUCTOR_URL}/share/:bot/collection`,
      },

      // sales (new child) - routes under /sales go to the sales project
      {
        source: "/sales/:path*",
        destination: `${env.SALES_URL}/share/:path*`,
      },
      {
        source: "/:locale/bot/:bot/sales",
        destination: `${env.SALES_URL}/share/:bot`,
      },
      {
        source: "/:locale/bot/:bot/sales/collection",
        destination: `${env.SALES_URL}/share/:bot/collection`,
      },
    ];
  },
  images: {
    domains: ["localhost"], // consider adding the hosts for CONSTRUCTOR_URL / SALES_URL if needed
  },
});
