import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence add kiya smooth transition ke liye
import { Heart, ShoppingBag, Zap } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/image";
import { useSelector } from "react-redux";
import { WishlistLoginModal } from "../common/WishlistLoginModal";
import { useState } from "react";
import { useWishlist } from "../../features/wishlist/useWishlist";

export const ProductGallery = ({ selectedVariant, product, images, selectedImage, setSelectedImage, handleAddToCart, handleBuyNow, isInCart }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.ID); // Jo "null" tha usse yahan fix kiya
  const { user } = useSelector((state) => state.auth);

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
  return (
    <div className="relative">
      {/* 1. Main Container: Mobile pe Column, Desktop pe Row-Reverse taaki thumbnails left dikhen */}
      <div className="flex flex-col lg:flex-row-reverse gap-4">
        {/* 2. Main Display Image (Right side on Desktop) */}

        <div className="flex-1">
          {/* Mobile Breadcrumb & Heart Yahan Rahenge */}
          <div className="flex justify-between items-center m-4 md:hidden ">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Home / Shop / <span className="text-black">{product?.CategoryName}</span>
            </div>
          </div>
          <button
            onClick={handleWishlistClick}
            className={`md:hidden  absolute right-0 p-3 border border-zinc-100 
                rounded-full backdrop-blur-md transition-all duration-300
                 ${isWishlisted ? "bg-primary text-white" : "bg-white/80 text-black"}
                hover:bg-primary hover:text-white`}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-[0.5rem] overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm"
          >
            <img src={getImageUrl(images[selectedImage])} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in" alt="Product" />
          </motion.div>
          {/* 4. Desktop Buttons (Niche hi rahenge full width) */}
          {/* 4. Desktop Buttons */}
          <div className="hidden lg:flex flex-col sm:flex-row gap-4 mt-8">
            {selectedVariant?.AvailableQty > 0 ? (
              <>
                <Button
                  label={isInCart ? "Go to Cart" : "Add To Cart"}
                  variant={isInCart ? "primary" : "dark"}
                  size="lg"
                  icon={ShoppingBag}
                  onClick={handleAddToCart}
                  className="flex-1"
                />
                <Button label="Buy Now" variant="primary" size="lg" icon={Zap} onClick={handleBuyNow} className="flex-1" />
              </>
            ) : (
              /* OUT OF STOCK STATE */
              <div className="flex-1 flex flex-col gap-2">
                <Button label="Out of Stock" variant="outline" size="lg" disabled={true} className="w-full opacity-60 cursor-not-allowed border-red-200 text-red-500" />
                <p className="text-[10px] text-center font-bold uppercase tracking-widest text-zinc-400">We'll restock this soon!</p>
              </div>
            )}
          </div>
          {/* Trust Line */}
          <div className="hidden lg:flex justify-center gap-6 opacity-40 mt-4">
            <p className="text-[9px] font-bold text-black uppercase tracking-widest">Genuine Product</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary">Free Shipping</p>
          </div>
        </div>

        {/* 3. Thumbnails (Left side on Desktop, Bottom on Mobile) */}
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:max-h-[500px] py-1 shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedImage === i ? "border-black scale-95 shadow-md" : "border-transparent opacity-60"
              }`}
            >
              <img src={getImageUrl(img)} className="w-full h-full object-cover" alt={`thumb-${i}`} />
            </button>
          ))}
        </div>
      </div>
      <WishlistLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};
