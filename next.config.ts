import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const { CONSTRUCTOR_URL } = process.env;

export default withNextIntl({
  async rewrites() {
    return [
      // Media files
      {
        source: "/:locale/share/_next/image",
        destination: `${CONSTRUCTOR_URL}/share/_next/image`,
      },

      // constructor
      {
        source: "/share/:path*",
        destination: `${CONSTRUCTOR_URL}/share/:path*`,
      },
      {
        source: "/:locale/:bot",
        destination: `${CONSTRUCTOR_URL}/share/:bot`,
      },
    ];
  },
  images: {
    domains: ["localhost"], // yoki CONSTRUCTOR_URL dagi host
  },
});
