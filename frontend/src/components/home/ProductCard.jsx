import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../utils/image";
import { useCart } from "../../features/cart/useCart";
import { FlyingCartAnimation } from "../common/FlyingCartAnimation";
import toast from "react-hot-toast";
import { WishlistLoginModal } from "../common/WishlistLoginModal";
import { useWishlist } from "../../features/wishlist/useWishlist";
import { cartActions } from "../../features/cart/Cart.slice";

export function ProductCard({ item }) {
  const dispatch = useDispatch();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [flyData, setFlyData] = useState(null);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const { cartItems, addToCart, isAdding } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(item.ID);
  const { user } = useSelector((state) => state.auth);
  const isOutOfStock = Number(item.TotalStock) <= 0;
  const existingItem = cartItems?.items?.find((i) => String(i.product_id) === String(item?.ID || item?.product_id));
  const isInCart = !!existingItem;

  const handleCardClick = (e, slug) => {
    if (slug) {
      navigate(`/product/${slug}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isInCart) {
      dispatch(cartActions.setCartOpen(true));
      return;
    }
    const currentQty = existingItem ? existingItem.Quantity : 0;

    if (currentQty >= 5) {
      toast.error("You already have 5 units in your bag!");
      return;
    }

    if (Number(item?.TotalStock) < 1) {
      toast.error("Product is out of stock!");
      return;
    }

    const targetVariantId =
      item?.VariantID ||
      item?.variant_id ||
      item?.variantId ||
      item?.variants?.[0]?.ID ||
      item?.ID;

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cartIcon = document.getElementById("cart-icon-main");

      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        setFlyData({
          start: {
            x: cardRect.left + cardRect.width / 2,
            y: cardRect.top + cardRect.height / 2,
          },
          end: {
            x: cartRect.left + cartRect.width / 2,
            y: cartRect.top + cartRect.height / 2,
          },
          image: getImageUrl(item.Thumbnail),
        });
      }
    }
    const priceVal = Number(item.SellingPrice || item.SellPrice || item.Price || 0);
    const mrpVal = Number(item.MRP || priceVal);

    addToCart({
      productId: Number(item.ID),
      product_id: Number(item.ID),
      variantId: Number(targetVariantId),
      variant_id: Number(targetVariantId),
      cart_id: Number(targetVariantId),
      Title: item.Title,
      title: item.Title,
      Price: priceVal,
      price: priceVal,
      SellingPrice: priceVal,
      MRP: mrpVal,
      mrp: mrpVal,
      Thumbnail: item.Thumbnail,
      thumbnail: item.Thumbnail,
      Slug: item.Slug,
      slug: item.Slug,
      Quantity: 1,
      quantity: 1,
      TotalStock: Number(item.TotalStock || 10),
      AvailableQty: Number(item.TotalStock || 10),
      Attribute: item.Attribute || "",
    });
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    toggleWishlist(item.ID);
  };

  const getStockStatus = () => {
    const stock = Number(item.TotalStock);
    if (stock <= 0) {
      return { label: "Out of Stock", color: "text-red-700 bg-red-50", animate: true, dot: "bg-red-600" };
    }
    if (stock > 0 && stock <= 5) {
      return { label: `Only ${stock} left`, color: "text-[#C26D43] bg-[#C26D43]/10", animate: true, dot: "bg-[#C26D43]" };
    }
    return { label: "In Stock", color: "text-emerald-700 bg-emerald-50", animate: false, dot: "bg-emerald-600" };
  };

  const status = getStockStatus();
  return (
    <div
      ref={cardRef}
      onClick={(e) => handleCardClick(e, item?.Slug)}
      className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E8DFD0] hover:border-[#C26D43]/40 overflow-hidden"
    >
      <AnimatePresence>
        {flyData && (
          <FlyingCartAnimation
            startPos={flyData.start}
            endPos={flyData.end}
            image={flyData.image}
            onComplete={() => setFlyData(null)}
          />
        )}
      </AnimatePresence>

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F3EFE6]">
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px] pointer-events-none">
            <div className="bg-[#1C1917] text-[#FAF7EE] px-4 py-1.5 rounded-full shadow-lg">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest block text-center">
                Sold Out
              </span>
            </div>
          </div>
        )}

        {/* Badges */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 z-20">
            <span
              className={`px-2.5 py-0.5 text-[9px] tracking-wider font-bold uppercase rounded-full shadow-sm ${
                item.badge === "Hot" ? "bg-[#C26D43] text-white" : "bg-white text-[#1C1917]"
              }`}
            >
              {item.badge}
            </span>
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className={`absolute top-2.5 right-2.5 z-20 cursor-pointer p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
            isWishlisted
              ? "bg-[#C26D43] text-white"
              : "bg-white/80 text-[#1C1917] hover:bg-[#C26D43] hover:text-white"
          }`}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Product Image */}
        <img
          src={getImageUrl(item.Thumbnail)}
          alt={item.Title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isOutOfStock ? "grayscale opacity-60" : ""
          }`}
        />

        {item.Discount > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-[#1C1917] text-[#FAF7EE] text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider z-10 shadow-sm">
            {Math.round(item.Discount)}% OFF
          </div>
        )}

        {/* Desktop-Only Hover Action Bar */}
        <div className="hidden md:flex absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex gap-2 w-full">
            <button
              disabled={isAdding || isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 text-[11px] font-bold py-2.5 px-2 rounded-xl flex items-center justify-center gap-2 transition-all uppercase disabled:bg-gray-400 cursor-pointer ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isInCart
                  ? "bg-[#C26D43] text-white hover:bg-[#D47A53] shadow-md"
                  : "bg-[#1C1917] text-[#FAF7EE] hover:bg-[#C26D43]"
              }`}
            >
              <ShoppingCart size={13} />
              {isAdding ? "Adding..." : isOutOfStock ? "Sold Out" : isInCart ? "In Bag" : "Add to Bag"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${item?.Slug}`);
              }}
              aria-label="View Details"
              className="bg-white text-[#1C1917] p-2.5 rounded-xl hover:bg-[#FAF7EE] transition-colors cursor-pointer shadow-sm"
            >
              <Eye size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>

            {item.AvgRating > 0 ? (
              <div className="flex items-center gap-1 text-[#D4A373]">
                <Star size={12} fill="currentColor" />
                <span className="text-[11px] font-bold text-[#78716C]">{Math.round(item.AvgRating)}</span>
              </div>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#C26D43] bg-[#C26D43]/10 px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>

          <h3 className="text-xs md:text-sm font-semibold text-[#1C1917] hover:text-[#C26D43] transition-colors leading-snug line-clamp-1">
            {item.Title}
          </h3>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#E8DFD0]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm md:text-base font-black text-[#1C1917]">
              ₹{Math.round(item.SellingPrice)}
            </span>
            {item.MRP && (
              <span className="text-[10px] md:text-xs text-[#A8A29E] line-through">
                ₹{Math.round(item.MRP)}
              </span>
            )}
          </div>
          {item.Discount > 0 && (
            <span className="text-[10px] text-[#C26D43] font-bold">
              Save {Math.round(item.Discount)}%
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button
          disabled={isAdding || isOutOfStock}
          onClick={handleAddToCart}
          className={`md:hidden mt-2.5 w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
            isInCart
              ? "bg-[#C26D43] text-white"
              : "bg-[#1C1917] text-[#FAF7EE] active:bg-[#C26D43]"
          }`}
        >
          {isOutOfStock ? "Sold Out" : isInCart ? "In Bag (View)" : "Add to Bag"}
        </button>
      </div>
      <WishlistLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
