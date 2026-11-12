import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Truck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
} from "lucide-react";
import { getImageUrl } from "../../utils/image";

// Curated distinct spotlight products with exact subcategory slugs
const heroProducts = [
  {
    id: 37,
    title: "Beige & White Striped Cotton Shirt Collar Maxi Dress",
    slug: "beige-white-striped-cotton-shirt-collar-maxi-dress",
    categoryName: "Women's Wear",
    categorySlug: "womens-wear",
    thumbnail: "assets/images/product/1785753309_casual dress for women (3).png",
    sellingPrice: 539,
    mrp: 1199,
    discount: "55% OFF",
    rating: "4.9",
    reviews: "410+ orders",
    highlightWord: "Maxi Dress",
    desc: "Tailored with a crisp shirt collar and breezy vertical stripes. Crafted from a pure breathable cotton-linen blend for an elegant, effortless silhouette.",
    subcategories: [
      { name: "Casual Dresses", slug: "casual-dresses" },
      { name: "Tops & Tunics", slug: "tops-tunic" },
      { name: "Festive Sarees", slug: "sarees" },
      { name: "Jumpsuits", slug: "jumpsuits-playsuits" },
      { name: "Jeans & Jeggings", slug: "jeans-jeggings" },
    ],
  },
  {
    id: 56,
    title: "Unique Design Cool Printed Graphic Tee for Men",
    slug: "unique-design-cool-printed-tshirt-for-men",
    categoryName: "Men's Wear",
    categorySlug: "mens-wear",
    thumbnail: "assets/images/product/1785826629_Unique Design Cool Printed Tshirt for men 1.png",
    sellingPrice: 405,
    mrp: 699,
    discount: "42% OFF",
    rating: "4.8",
    reviews: "350+ orders",
    highlightWord: "Graphic Tee",
    desc: "Distinct contemporary streetwear artwork on 100% combed breathable cotton. Relaxed silhouette engineered for all-day ease and everyday style.",
    subcategories: [
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Shirts", slug: "shirts" },
      { name: "Jackets", slug: "jackets" },
      { name: "Jeans", slug: "jeans" },
      { name: "Trousers", slug: "trousers" },
    ],
  },
  {
    id: 48,
    title: "Elegant Rich Chiffon Festive Saree with Matching Blouse",
    slug: "elegant-rich-chiffon-party-wear-saree-with-matching-blouse",
    categoryName: "Women's Wear",
    categorySlug: "womens-wear",
    thumbnail: "assets/images/product/1785823135_1.png",
    sellingPrice: 365,
    mrp: 1299,
    discount: "72% OFF",
    rating: "4.9",
    reviews: "560+ orders",
    highlightWord: "Festive Saree",
    desc: "Drapes like a dream with exquisite fall and featherlight chiffon texture. Perfect for celebratory occasions, festive soirées, and elegant evenings.",
    subcategories: [
      { name: "Festive Sarees", slug: "sarees" },
      { name: "Casual Dresses", slug: "casual-dresses" },
      { name: "Tops & Tunics", slug: "tops-tunic" },
      { name: "Jumpsuits", slug: "jumpsuits-playsuits" },
    ],
  },
  {
    id: 68,
    title: "Half Sleeve Baggy Fit Cotton Blend Streetwear Tee",
    slug: "half-sleeve-baggy-fit-cotton-blend-casual-streetwear-tee",
    categoryName: "Men's Wear",
    categorySlug: "mens-wear",
    thumbnail: "assets/images/product/1785829261_Half Sleeve Baggy Fit Cotton Blend Casual Streetwear Tee (2).png",
    sellingPrice: 400,
    mrp: 500,
    discount: "20% OFF",
    rating: "4.8",
    reviews: "280+ orders",
    highlightWord: "Streetwear Tee",
    desc: "Oatmeal beige earth tone with an oversized drop-shoulder fit. Heavyweight yet highly breathable cotton blend tailored for effortless modern styling.",
    subcategories: [
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Shirts", slug: "shirts" },
      { name: "Jackets", slug: "jackets" },
      { name: "Jeans", slug: "jeans" },
      { name: "Trousers", slug: "trousers" },
    ],
  },
  {
    id: 29,
    title: "Casual Vertical Striped Cinched-Waist Peplum Top",
    slug: "casual-vertical-striped-cinched-waist-peplum-top",
    categoryName: "Women's Wear",
    categorySlug: "womens-wear",
    thumbnail: "assets/images/product/1785743088_sky blue tops forr women (2).png",
    sellingPrice: 410,
    mrp: 999,
    discount: "59% OFF",
    rating: "4.8",
    reviews: "480+ orders",
    highlightWord: "Peplum Top",
    desc: "Designed with an elasticated cinched waist and breezy vertical stripes. Premium lightweight woven cotton offering an effortlessly feminine silhouette.",
    subcategories: [
      { name: "Tops & Tunics", slug: "tops-tunic" },
      { name: "Casual Dresses", slug: "casual-dresses" },
      { name: "Jumpsuits", slug: "jumpsuits-playsuits" },
      { name: "Jeans & Jeggings", slug: "jeans-jeggings" },
      { name: "Sarees", slug: "sarees" },
    ],
  },
  {
    id: 62,
    title: "Men's Solid Cotton Blend Loose Fit T-Shirt",
    slug: "mens-solid-cotton-blend-round-neck-loose-fit-t-shirt",
    categoryName: "Men's Wear",
    categorySlug: "mens-wear",
    thumbnail: "assets/images/product/1785827563_Men's Solid Cotton Blend Round Neck Loose Fit T-Shirt.png",
    sellingPrice: 315,
    mrp: 450,
    discount: "30% OFF",
    rating: "4.8",
    reviews: "310+ orders",
    highlightWord: "Loose Fit",
    desc: "Warm earth tone aesthetic in an ultra-soft cotton-rich blend. Tailored loose drape offering unmatched day-long breathability and timeless minimalism.",
    subcategories: [
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Shirts", slug: "shirts" },
      { name: "Jackets", slug: "jackets" },
      { name: "Jeans", slug: "jeans" },
      { name: "Trousers", slug: "trousers" },
    ],
  },
];

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const current = heroProducts[activeIdx];

  // Auto-slide between products every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % heroProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % heroProducts.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const goToProduct = () => {
    navigate(`/product/${current.slug}`);
  };

  return (
    <section className="relative w-full bg-[#FAF7EE] text-[#1C1917] px-4 sm:px-8 lg:px-12 py-3 sm:py-6 lg:py-8 flex flex-col justify-center overflow-hidden">
      
      {/* Ambient Warm Luxury Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C26D43]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#D4A373]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ================= MAIN RESPONSIVE GRID ================= */}
      <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center relative z-10">
        
        {/* ---------------- 1. VISUAL PRODUCT SHOWCASE (MOBILE: TOP [order-1], DESKTOP: RIGHT [order-2]) ---------------- */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center justify-center w-full">
          
          {/* Main Visual Showcase Container - Clean, Unobstructed, 100% visible clothes photo */}
          <div
            onClick={goToProduct}
            className="relative w-full max-w-[390px] xs:max-w-[420px] h-[280px] xs:h-[320px] sm:h-[400px] lg:h-[480px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl sm:shadow-2xl bg-[#F3EFE6] group border border-[#E8DFD0] cursor-pointer"
          >
            {/* Product Image Crossfade (No blocking card on top!) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 flex items-center justify-center p-3 sm:p-5"
              >
                <img
                  src={getImageUrl(current.thumbnail)}
                  alt={current.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-md"
                />
              </motion.div>
            </AnimatePresence>

            {/* Top-Left Category Tag */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <div className="bg-[#FAF7EE]/95 backdrop-blur-md px-3 sm:px-3.5 py-1 rounded-full border border-[#E8DFD0] shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C26D43] animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-bold text-[#1C1917] uppercase tracking-wider">
                  {current.categoryName} • Spotlight
                </span>
              </div>
            </div>

            {/* Top-Right Arrows to switch product */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous Product"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF7EE]/90 hover:bg-[#FAF7EE] backdrop-blur-md text-[#1C1917] border border-[#E8DFD0] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next Product"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF7EE]/90 hover:bg-[#FAF7EE] backdrop-blur-md text-[#1C1917] border border-[#E8DFD0] flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Bottom Subtle Tap Hint (Non-blocking, elegant luxury touch) */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none">
              <div className="bg-[#1C1917]/75 backdrop-blur-md text-[#FAF7EE] text-[9.5px] font-semibold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Eye size={10} className="text-[#C26D43]" />
                <span>Tap to view details</span>
              </div>
            </div>

          </div>

          {/* Minimalist Slide Indicator Dots (Products 1 to 6) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {heroProducts.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Show ${item.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIdx === idx
                    ? "w-8 h-2 bg-[#1C1917]"
                    : "w-2 h-2 bg-[#D6CEBF] hover:bg-[#A8A29E]"
                }`}
              />
            ))}
          </div>

        </div>

        {/* ---------------- 2. EDITORIAL COPY & DUAL BUTTONS (MOBILE: BOTTOM [order-2], DESKTOP: LEFT [order-1]) ---------------- */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center space-y-3.5 sm:space-y-6 text-center lg:text-left items-center lg:items-start">
          
          {/* Season Pill Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#F3EFE6] px-3.5 py-1 rounded-full border border-[#E8DFD0] shadow-2xs">
            <Sparkles size={11} className="text-[#C26D43]" />
            <span className="text-[9.5px] sm:text-[11px] font-bold tracking-[0.2em] text-[#C26D43] uppercase">
              SEASON EDIT 2026 • {current.categoryName.toUpperCase()}
            </span>
          </div>

          {/* Product Headline & Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="space-y-2.5 sm:space-y-3.5"
            >
              {/* Product Title */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] xl:text-[50px] font-serif text-[#1C1917] leading-[1.14] tracking-tight font-normal">
                {current.title.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={
                      word.toLowerCase().includes(current.highlightWord.toLowerCase().split(" ")[0])
                        ? "italic text-[#C26D43] font-normal"
                        : ""
                    }
                  >
                    {word}{" "}
                  </span>
                ))}
              </h1>

              {/* Price Banner with Ratings */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#1C1917]">
                  ₹{current.sellingPrice}
                </span>
                <span className="text-sm sm:text-base text-[#A8A29E] line-through font-normal">
                  ₹{current.mrp}
                </span>
                <span className="text-[11px] font-bold text-[#C26D43] bg-[#C26D43]/10 px-2.5 py-0.5 rounded-full border border-[#C26D43]/20">
                  Save {current.discount}
                </span>
                <span className="text-[#A8A29E]">•</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#1C1917]">
                  <Star size={11} className="fill-[#C26D43] text-[#C26D43]" />
                  <span>{current.rating}</span>
                  <span className="text-[#78716C] font-normal hidden sm:inline">({current.reviews})</span>
                </div>
              </div>

              {/* Product Editorial Description */}
              <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed max-w-xl font-normal line-clamp-3 sm:line-clamp-none">
                {current.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Subcategory Chips with EXACT Links & Filters */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-0.5">
            <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider mr-1 hidden sm:inline">
              Collections:
            </span>
            {current.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => navigate(`/category/${current.categorySlug}/${sub.slug}`)}
                className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#F3EFE6] hover:bg-[#1C1917] text-[#57534E] hover:text-[#FAF7EE] border border-[#E8DFD0] transition-colors cursor-pointer"
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Action Buttons: Stacked Full-Width on Mobile (1 Clean Line each!), Side-by-Side on Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 w-full sm:w-auto">
            {/* Primary Button: View this product */}
            <button
              onClick={goToProduct}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="whitespace-nowrap">View Product • ₹{current.sellingPrice}</span>
              <ArrowRight size={14} />
            </button>

            {/* Secondary Button: Explore category */}
            <button
              onClick={() => navigate(`/category/${current.categorySlug}`)}
              className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-[#1C1917] hover:text-[#FAF7EE] border border-[#1C1917] text-[#1C1917] text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="whitespace-nowrap">Explore {current.categoryName}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Trust Checkmarks */}
          <div className="pt-3 sm:pt-5 border-t border-[#E8DFD0] w-full flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[10px] sm:text-xs text-[#78716C]">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-[#C26D43]" />
              <span className="font-medium">100% Breathable</span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw size={13} className="text-[#C26D43]" />
              <span className="font-medium">7-Day Free Exchange</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck size={13} className="text-[#C26D43]" />
              <span className="font-medium">Express Pan-India Delivery</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
