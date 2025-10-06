import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
import env from "@/lib/env";

export default withNextIntl({
  async rewrites() {
    return [
      // Media files
      {
        source: "/:locale/bot/:bot/constructor/_next/image",
        destination: `${env.CONSTRUCTOR_URL}/share/_next/image`,
      },
      // constructor
      {
        source: "/share/:path*",
        destination: `${env.CONSTRUCTOR_URL}/share/:path*`,
      },
      {
        source: "/:locale/bot/:bot/constructor",
        destination: `${env.CONSTRUCTOR_URL}/share/:bot`,
      },
    ];
  },
  images: {
    domains: ["localhost"], // yoki env.CONSTRUCTOR_URL dagi host
  },
});
