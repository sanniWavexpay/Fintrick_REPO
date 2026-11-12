import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  ArrowUp,
  Globe,
  ChevronRight,
} from "lucide-react";
import master from "../../assets/image/social/master.png";
import rupay from "../../assets/image/social/rupay.png";
import visa from "../../assets/image/social/visa.png";

import { siteConfig } from "../../config/siteConfig";

export default function GlobalFooter() {
  const navigate = useNavigate();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = {
    mens: [
      { name: "T-Shirts & Polos", path: "/category/mens-wear/t-shirts" },
      { name: "Linen & Casual Shirts", path: "/category/mens-wear/shirts" },
      { name: "Jackets & Overshirts", path: "/category/mens-wear/jackets" },
      { name: "Denim & Jeans", path: "/category/mens-wear/jeans" },
      { name: "Tailored Trousers", path: "/category/mens-wear/trousers" },
      { name: "All Men's Collection", path: "/category/mens-wear" },
    ],
    womens: [
      { name: "Tops & Tunics", path: "/category/womens-wear/tops-tunic" },
      { name: "Casual & Midi Dresses", path: "/category/womens-wear/casual-dresses" },
      { name: "Jumpsuits & Playsuits", path: "/category/womens-wear/jumpsuits-playsuits" },
      { name: "Pants & Jeggings", path: "/category/womens-wear/jeans-jeggings" },
      { name: "Sarees & Ethnic Wear", path: "/category/womens-wear/sarees" },
      { name: "All Women's Collection", path: "/category/womens-wear" },
    ],
    support: [
      { name: "Shipping & Delivery", path: "/shipping-policy" },
      { name: "Returns & Exchanges", path: "/return-policy" },
      { name: "Cancellation Policy", path: "/cancellation-policy" },
      { name: "Privacy Policy", path: "/privacy-policy" },
      { name: "Terms of Service", path: "/terms-of-service" },
      { name: "Frequently Asked Questions", path: "/faq" },
    ],
    company: [
      { name: "About Fintrick", path: "/about-us" },
      { name: "Contact & Support", path: "/contact-us" },
      { name: "Explore Catalog", path: "/shop" },
    ],
  };

  return (
    <footer className="relative bg-[#14110F] text-[#FAF7EE] overflow-hidden border-t border-[#292524]">
      {/* Ambient Radial Lights (Warm Luxury Glow) */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-[#C26D43]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#D4A373]/8 blur-[160px] rounded-full pointer-events-none" />

      {/* ================= MAIN NAVIGATION FOOTER GRID ================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand Info & Socials (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 text-center sm:text-left flex flex-col items-center sm:items-start">
            <Link to="/" onClick={scrollToTop} className="inline-block">
              {siteConfig.logoDark || siteConfig.logo ? (
                <img
                  src={siteConfig.logoDark || siteConfig.logo}
                  alt={siteConfig.name}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-black text-[#FAF7EE] tracking-wider uppercase">
                  {siteConfig.name}
                </span>
              )}
            </Link>

            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed max-w-sm font-normal">
              Contemporary apparel crafted from honest natural cottons and breathable resort linens. Designed for effortless modern silhouettes and lasting comfort.
            </p>

            {/* Direct Contact Details */}
            <div className="space-y-2 text-xs text-[#A8A29E] pt-1">
              {siteConfig.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-[#C26D43] shrink-0" />
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    +91 {siteConfig.phone}
                  </a>
                </div>
              )}
              {siteConfig.email && (
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-[#C26D43] shrink-0" />
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              )}
              {siteConfig.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-[#C26D43] shrink-0 mt-0.5" />
                  <span className="leading-snug text-[11px] text-[#78716C]">
                    {siteConfig.address}
                  </span>
                </div>
              )}
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] border border-[#292524] hover:border-[#C26D43] flex items-center justify-center transition-all duration-300 hover:scale-105"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Men's Edit (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C26D43]">
              Men's Edit
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              {footerLinks.mens.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="hover:text-[#FAF7EE] hover:translate-x-1 inline-block transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Women's Edit (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C26D43]">
              Women's Edit
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              {footerLinks.womens.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="hover:text-[#FAF7EE] hover:translate-x-1 inline-block transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Support & Policies (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C26D43]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="hover:text-[#FAF7EE] hover:translate-x-1 inline-block transition-all"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Trust Badges (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C26D43]">
              Fintrick Guarantee
            </h4>
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2.5 bg-[#1C1917] p-2.5 rounded-xl border border-[#292524]">
                <Truck size={16} className="text-[#C26D43] shrink-0" />
                <div className="text-[10px] text-left">
                  <p className="font-bold text-[#FAF7EE]">Express Shipping</p>
                  <p className="text-[#78716C]">Pan-India delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#1C1917] p-2.5 rounded-xl border border-[#292524]">
                <RotateCcw size={16} className="text-[#C26D43] shrink-0" />
                <div className="text-[10px] text-left">
                  <p className="font-bold text-[#FAF7EE]">7-Day Exchange</p>
                  <p className="text-[#78716C]">Hassle-free support</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#1C1917] p-2.5 rounded-xl border border-[#292524]">
                <ShieldCheck size={16} className="text-[#C26D43] shrink-0" />
                <div className="text-[10px] text-left">
                  <p className="font-bold text-[#FAF7EE]">100% Genuine</p>
                  <p className="text-[#78716C]">Artisanal cottons</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM COPYRIGHT & STRIP ================= */}
      <div className="border-t border-[#292524] bg-[#0E0C0A] py-6 px-4 sm:px-8 pb-24 lg:pb-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          
          {/* Region / Currency Indicator */}
          <div className="flex items-center gap-2 bg-[#1C1917] border border-[#292524] px-3 py-1.5 rounded-full text-[11px] font-semibold text-[#FAF7EE]/80">
            <Globe size={13} className="text-[#C26D43]" />
            <span>Fintrick.store • India (INR ₹)</span>
          </div>

          {/* Copyright Statement */}
          <div className="text-center text-[11px] text-[#A8A29E] font-medium space-y-0.5">
            <div>
              © {new Date().getFullYear()} {siteConfig.legalName || "FINTRICK INNOVATIONS"}. All Rights Reserved.
            </div>
            <div className="text-[10px] text-[#78716C]">
              Spectrum Business Centre, Mangaluru, Karnataka - 575005
            </div>
          </div>

          {/* Payment Badges & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1C1917] border border-[#292524] px-3 py-1 rounded-xl">
              <img src={visa} alt="Visa" className="h-3.5 w-auto object-contain brightness-90" />
              <img src={master} alt="Mastercard" className="h-3.5 w-auto object-contain brightness-90" />
              <img src={rupay} alt="RuPay" className="h-3.5 w-auto object-contain brightness-90" />
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Back to Top"
              className="w-8 h-8 rounded-full bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] border border-[#292524] hover:border-[#C26D43] flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm"
            >
              <ArrowUp size={14} />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
