import { Heart, Minus, Plus, RotateCcw, Star, Truck, ShieldCheck, Zap, CreditCard, MapPin, Info, ChevronRight, ShoppingBag, Check, Bus, ChevronDown } from "lucide-react";
import { ProductAccordion } from "./ProductAccordion";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductDescription from "./ProductDescription";
import ReviewSection from "./ReviewSection";
import { Button } from "../common/Button";
import { getImageUrl } from "../../utils/image";
import { usePincode } from "../../services/findPincode.service";
import { useState, useRef } from "react";
import { useWishlist } from "../../features/wishlist/useWishlist";
import { WishlistLoginModal } from "../common/WishlistLoginModal";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export const ProductInfo = ({
  selectedVariant,
  setSelectedVariant, // Isse parent se pass karna zaroori hai
  product,
  quantity,
  setQuantity,
  variants,
  handleAddToCart,
  handleBuyNow,
  reviews,
  rating_distribution,
  overall_rating,
  isLoading,
  isInCart,
}) => {
  const reviewsRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.ID); // Jo "null" tha usse yahan fix kiya
  const { user } = useSelector((state) => state.auth);
  const [showGstTooltip, setShowGstTooltip] = useState(false);

  const { pincode, setPincode, status, handleCheck, data } = usePincode();
  const sizes = [...new Set(variants?.flatMap((v) => v.specs?.filter((s) => s.key === "Size").map((s) => s.value)))].filter(Boolean);
  // 7 Din baad ki date nikalne ka logic
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Current date + 7 days

    // Format: "12 Mar, Thursday"
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      weekday: "long",
    }).format(date);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      // Guest case: Modal dikhao
      setShowLoginModal(true);
    } else {
      // Login case: API call (Toggle Logic)
      toggleWishlist(product.ID);
    }
  };
  const handleQuantityChange = (action) => {
    const stock = Number(selectedVariant?.AvailableQty) || 0;
    const MAX_LIMIT = 5;

    if (action === "plus") {
      if (quantity >= MAX_LIMIT) {
        toast.error("Maximum 5 units allowed per order!", {
          id: "qty-limit", // id dene se baar-baar toast stack nahi honge
        });
        return;
      }

      if (quantity < stock) {
        setQuantity((prev) => prev + 1);
      } else {
        toast.error(`Only ${stock} units in stock!`, { id: "stock-alert" });
      }
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar pt-4 px-4 md:px-8 lg:px-16 md:h-[calc(130vh-100px)] lg:h-[calc(130vh-100px)]">
      {/* 1. Breadcrumbs & Tags */}
      <div className="flex justify-between items-center mb-4 hidden md:flex">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Home / {product?.CategoryName} / <span className="text-black">{product?.Title}</span>
        </div>
        <div className="flex gap-2">
          {product?.Trending === 1 && <span className="bg-primary/10 text-primary text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter italic border border-primary/20">Trending</span>}
        </div>
      </div>
      {/* 2. Header Section */}
      <div className="flex justify-between items-start mb-2 gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-black leading-[0.9]">{product?.Title}</h1>
          {/* HTML description rendering */}
          <div className="text-zinc-400 text-[14px] mt-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: product?.ShortDesc }} />
          <p className="mt-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">HSN No: {product?.HSN}</p>
        </div>
        <button
          onClick={handleWishlistClick}
          className={`
                md:flex hidden z-20 p-2 border border-zinc-100 
                rounded-full backdrop-blur-md transition-all duration-300
                 ${isWishlisted ? "bg-primary text-white" : "bg-white/80 text-black"}
                hover:bg-primary hover:text-white
              `}
        >
          <Heart size={14} className="md:w-4 md:h-4" fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      {/* 1. STYLE / COLOR SELECTOR */}
      <div className="mb-6">
        <span className="text-[11px] font-black uppercase tracking-widest text-black mb-4 block">Select Style</span>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {(() => {
            // Unique Colors ki list nikalo
            const uniqueColors = Array.from(
              new Set(
                variants
                  ?.map((v) => v.specs?.find((s) => s.key === "Color")?.value)
                  .filter(Boolean)
              )
            );

            if (uniqueColors.length > 0) {
              return uniqueColors.map((colorName) => {
                // Is color ka pehla variant image/selection ke liye nikalo
                const matchingVariant = variants?.find(
                  (v) => v.specs?.find((s) => s.key === "Color")?.value === colorName
                );

                const currentColor = selectedVariant?.specs?.find((s) => s.key === "Color")?.value;
                const isSelected = currentColor === colorName;

                return (
                  <div key={colorName} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        if (matchingVariant && typeof setSelectedVariant === "function") {
                          setSelectedVariant(matchingVariant);
                        }
                      }}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        isSelected ? "border-black scale-95 shadow-md" : "border-transparent opacity-60"
                      }`}
                    >
                      <img
                        src={getImageUrl(matchingVariant?.images?.[0] || product?.Thumbnail)}
                        className="w-full h-full object-cover"
                        alt={colorName}
                      />
                    </button>
                    <span className={`text-[9px] font-black uppercase ${isSelected ? "text-black" : "text-zinc-400"}`}>
                      {colorName}
                    </span>
                  </div>
                );
              });
            }

            // Fallback for variants without explicit Color spec
            return variants?.map((v) => {
              const isSelected = selectedVariant?.ID === v.ID;
              const colorLabel = v.specs?.find((s) => s.key === "Color")?.value || "Standard";

              return (
                <div key={v.ID} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      if (typeof setSelectedVariant === "function") setSelectedVariant(v);
                    }}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      isSelected ? "border-black scale-95 shadow-md" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={getImageUrl(v.images?.[0] || product?.Thumbnail)} className="w-full h-full object-cover" alt="variant" />
                  </button>
                  <span className={`text-[9px] font-black uppercase ${isSelected ? "text-black" : "text-zinc-400"}`}>{colorLabel}</span>
                </div>
              );
            });
          })()}
        </div>
      </div>
      {/* 5. SIZE SELECTION (Sirf tab dikhao jab variants mein "Size" attribute ho) */}
      {sizes.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-black">Select Size</span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => {
              // Current color nikalte hain (agar hai toh)
              const currentColor = selectedVariant?.specs?.find((s) => s.key === "Color")?.value;

              // Variant matching logic
              const variantMatch = variants?.find((v) => {
                const hasColor = currentColor ? v.specs.some((s) => s.key === "Color" && s.value === currentColor) : true; // Agar color nahi hai toh color check skip karo

                const hasSize = v.specs.some((s) => s.key === "Size" && s.value === size);
                return hasColor && hasSize;
              });

              const isAvailable = variantMatch && variantMatch.AvailableQty > 0;
              const isSelected = selectedVariant?.specs?.some((s) => s.key === "Size" && s.value === size);

              return (
                <button
                  key={size}
                  disabled={!isAvailable}
                  onClick={() => {
                    if (variantMatch) {
                      setSelectedVariant(variantMatch);
                      setQuantity(1);
                    }
                  }}
                  className={`relative py-3 rounded-xl font-black text-[11px] uppercase transition-all border-2
                  ${!isAvailable
                      ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed opacity-100"
                      : isSelected
                        ? "bg-black text-white border-black shadow-lg scale-95"
                        : "bg-white text-black border-zinc-200 hover:border-black"
                    }`}
                >
                  {size}

                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                      <div className="w-[150%] border-t border-dotted border-zinc-400 rotate-[-45deg]"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* 3. Rating & Stock */}
      <div className="flex items-center gap-6 mb-2 border-b border-zinc-50 ">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-success text-white px-2 py-1 rounded-lg">
            <Star size={12} fill="white" />
            <span className="text-xs font-black italic">{Math.round(overall_rating?.average_rating)}</span>
          </div>
          <span 
            onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="text-[10px] font-black text-primary uppercase tracking-widest underline decoration-zinc-200 underline-offset-4 cursor-pointer hover:text-black transition-colors"
          >
            {overall_rating?.total_reviews} Reviews
          </span>
        </div>
      </div>
      {/* 4. Pricing Section */}
      <div className="relative group">
        <div className="relative z-10 flex items-baseline gap-4 mb-2">
          <span className="text-2xl font-[1000] tracking-tighter text-black italic">₹{Math.round(selectedVariant?.SellPrice)}</span>
          <span className="text-sm text-stone-500 line-through font-bold tracking-tighter">₹{Math.round(selectedVariant?.Price)}</span>

          {selectedVariant?.Discount > 0 && (
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform" }} // Vibration fix
              className="text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full tracking-widest shadow-lg shadow-red-900/20 inline-block"
            >
              {Math.round(selectedVariant?.Discount)}% OFF
            </motion.span>
          )}
        </div>
        <p className="relative z-10 text-[10px] font-black text-stone-500 mb-2 flex items-center gap-1">
          <Bus size={14} /> <span>Free delivery</span>
        </p>
        <p className="relative z-10 text-[10px] font-black text-stone-500 uppercase mb-2">
          {status === "valid" ? `Secure delivery by ${getDeliveryDate()}` : "Enter pincode to check delivery date"}
        </p>
      </div>
      {/* Warranty */}
      <div className="flex items-center gap-2 text-[11px] text-stone-600 relative">
        <ShieldCheck size={14} className="text-green-600 shrink-0" />
        <div>
          {product?.GST}% GST Included & Domestic Warranty
          <span
            onMouseEnter={() => setShowGstTooltip(true)}
            onMouseLeave={() => setShowGstTooltip(false)}
            className="ml-2 text-blue-500 font-bold cursor-pointer hover:underline relative inline-block"
          >
            Know More

            {/* 🔥 SMART POSITIONED TOOLTIP 🔥 */}
            <AnimatePresence>
              {showGstTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="
                    absolute bottom-full mb-3 w-[280px] bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 z-50 text-left
                    /* Mobile: Align to right to prevent overflow */
                    right-[-50px] translate-x-0
                    /* Desktop: Center align */
                    md:right-auto md:left-1/2 md:-translate-x-1/2
                  "
                >
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-50 pb-3">
                    <Info size={14} className="text-blue-500" />
                    <span className="font-black text-slate-800 uppercase tracking-tighter text-xs">Tax Breakdown</span>
                  </div>

                  {/* Scrollable Content */}
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-4 custom-scrollbar text-[11px] leading-relaxed text-slate-500 font-medium">
                    <p>
                      <strong className="text-slate-700 block mb-1">GST ({product?.GST}%):</strong>
                      Price includes CGST and SGST as per Govt norms. You can claim Input Tax Credit (ITC) if you have a valid GSTIN.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100/50">
                      <p className="font-black text-slate-800 uppercase text-[9px] tracking-widest opacity-50">Example Calculation (Tax Included)</p>
                      <div className="flex justify-between"><span>Base Price:</span> <span className="font-bold text-slate-700">₹1000</span></div>
                      <div className="flex justify-between"><span>GST (18%):</span> <span className="font-bold text-slate-700">+ ₹180</span></div>
                      <div className="h-[1px] bg-slate-200 my-1" />
                      <div className="flex justify-between font-black text-slate-900 text-sm"><span>Total Price:</span> <span>₹1180</span></div>
                    </div>
                    <p>
                      <strong className="text-slate-700 block mb-1">Warranty Details:</strong>
                      1 Year Domestic Warranty covers manufacturing defects. Physical damage or burnout is not covered.
                    </p>
                    <p className="italic text-blue-600/70 text-[9px] leading-snug">Note: A digital GST invoice will be sent to your registered email after delivery.</p>
                  </div>

                  {/* Tooltip Arrow */}
                  <div className="absolute top-full right-[60px] md:right-auto md:left-1/2 md:-translate-x-1/2 border-8 border-transparent border-t-white"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        </div>
      </div>

      {/* pincode */}
      <div className="my-3 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[12px] font-medium text-zinc-500 min-w-[70px]">Delivery</span>
          <div className={`relative flex items-center border-b-2 pb-1 w-full max-w-[200px] ${status === "invalid" ? "border-red-500" : "border-blue-600"}`}>
            <MapPin size={16} className={status === "invalid" ? "text-red-500" : "text-blue-600"} />
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter Pincode"
              className="w-full bg-transparent text-[13px] text-black font-bold focus:outline-none ml-2"
            />

            <button onClick={handleCheck} className="text-[12px] font-bold text-blue-600  ml-2 disabled:opacity-50 cursor-pointer " disabled={status === "loading"}>
              {status === "loading" ? "Checking..." : "Check"}
            </button>
          </div>
        </div>

        {/* Status Messages using React Query States */}
        {/* Status Message with Location */}
        {status === "valid" && data && (
          <div className="space-y-1">
            <p className="text-[10px] font-black text-green-600 flex items-center gap-1 uppercase">
              <Check size={12} /> Delivery available
            </p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
              <MapPin size={10} /> {data.PostOffice[0].District}, {data.PostOffice[0].State}
            </p>
          </div>
        )}
        {status === "invalid" && <p className="text-[10px] font-black text-red-500 uppercase">Not Serviceable or Invalid Code</p>}
      </div>
      {/* Quantity Selector */}
      <div className="flex flex-col gap-4 my-4">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-zinc-500 min-w-[70px]">Quantity</span>
          <div className="flex items-center border border-zinc-300 rounded-sm overflow-hidden h-9">
            {/* Minus Button */}
            <button
              onClick={() => handleQuantityChange("minus")}
              className="w-8 h-full text-black flex items-center justify-center bg-white hover:bg-zinc-50 border-r border-zinc-300"
            >
              <Minus size={14} />
            </button>

            {/* Quantity Display */}
            <span className="w-10 text-center text-[14px] font-bold text-black bg-white">{quantity}</span>

            {/* Plus Button */}
            <button
              onClick={() => handleQuantityChange("plus")}
              className="w-8 h-full text-black flex items-center justify-center bg-white hover:bg-zinc-50 border-l border-zinc-300"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-b border-zinc-100 py-6 ">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <RotateCcw size={18} />, label: "7 Days return" },
            { icon: <Truck size={18} />, label: "Free Delivery" },
            { icon: <ShieldCheck size={18} />, label: "Cash on Delivery" },
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-2">
              <div className="text-blue-600">{badge.icon}</div>
              <p className="text-[10px] md:text-[11px] font-medium text-zinc-600 leading-tight">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
      <ProductDescription apiData={product?.LongDesc} />
      <div ref={reviewsRef}>
        <ReviewSection setShowLoginModal={setShowLoginModal} product={product} overall_rating={overall_rating} reviews={reviews} rating_distribution={rating_distribution} />
      </div>
      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {selectedVariant?.AvailableQty > 0 ? (
          <>
            <Button
              label={isInCart ? "Go to Cart" : "Add To Bag"}
              variant={isInCart ? "primary" : "dark"}
              size="sm"
              className="w-full !rounded-xl !py-4 shadow-lg"
              icon={ShoppingBag}
              onClick={handleAddToCart}
            />
            <Button label="Buy Now" variant="primary" size="sm" className="w-full !rounded-xl !py-4 shadow-lg" icon={Zap} onClick={handleBuyNow} />
          </>
        ) : (
          /* Out of Stock State for Mobile */
          <Button
            label="Out of Stock"
            variant="outline"
            size="lg"
            disabled={true}
            className="w-full !rounded-xl !py-4 opacity-60 cursor-not-allowed border-red-200 text-red-500 bg-red-50"
          />
        )}
      </div>
      <WishlistLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};
