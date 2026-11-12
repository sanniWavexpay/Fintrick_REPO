import defaultLogo from "../assets/image/fintrick-logo.svg";
import defaultLogoDark from "../assets/image/fintrick-logo-dark.svg";

export const siteConfig = {
  name: import.meta.env.VITE_APP_NAME || "Fintrick",
  domain: "fintrick.store",
  legalName: import.meta.env.VITE_APP_LEGAL_NAME || "FINTRICK INNOVATIONS",
  email: import.meta.env.VITE_APP_EMAIL || "tech@fintrickinnovations.com",
  phone: import.meta.env.VITE_APP_PHONE || "9292024432",
  address:
    import.meta.env.VITE_APP_ADDRESS ||
    "2nd Floor ShopNo.213 Spectrum Business Centre Mercara Hill Road Kalpane Ground Mangaluru Dakshina Kannada Karnataka",
  pinCode: "575005",
  gst: import.meta.env.VITE_APP_GST || "",
  theme: import.meta.env.VITE_APP_THEME || "fintrick",
  logo: import.meta.env.VITE_APP_LOGO_URL || defaultLogo,
  logoDark: import.meta.env.VITE_APP_LOGO_DARK_URL || defaultLogoDark,
  favicon: import.meta.env.VITE_APP_FAVICON_URL || "/favicon.svg",

  // SEO Defaults
  seo: {
    titleTemplate: `%s | ${import.meta.env.VITE_APP_NAME || "Fintrick"}`,
    defaultDescription:
      "Fintrick - Contemporary apparel and fashion destination. Discover premium men's and women's wear, casual linens, stylish cottons, chic dresses, and modern essentials.",
  },
};
