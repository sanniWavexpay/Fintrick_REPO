import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../features/cart/Cart.slice";
import { useCart } from "../../features/cart/useCart";
import { getImageUrl } from "../../utils/image";
import toast from "react-hot-toast";
import { ReminderLoginModal } from "./ReminderLoginModal";

export const SlideOutCart = ({ isOpen, toggleCart }) => {
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { cartItems, updateQty, removeItem } = useCart();
  const { user } = useSelector((state) => state.auth);
  const stopPropagation = (e) => e.stopPropagation();
  const items = cartItems?.items;
  const summary = cartItems?.summary;

  const handleQtyChange = (e, cart_id, currentQty, type, stock) => {
    e.stopPropagation();
    const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return;
    if (newQty > 5) {
      toast.error("You already have 5 units in your bag!");
      return;
    }
    if (type === "inc" && newQty > stock) {
      toast.error(`Only ${stock} units in stock!`, { id: "stock-alert" });
      return;
    }
    updateQty({ cart_id: cart_id, Quantity: newQty });
  };

  const handleRemove = (e, cart_id) => {
    e.stopPropagation();
    removeItem(cart_id);
  };

  const handleCheckout = () => {
    if (!user) {
      setShowCheckoutModal(true);
    } else {
      toggleCart();
      setTimeout(() => {
        navigate("/checkout");
      }, 300);
    }
  };

  const handleBuyItNow = (item) => {
    if (!user) {
      setShowCheckoutModal(true);
    } else {
      toggleCart();
      navigate("/checkout", {
        state: { checkoutType: "BUY_NOW", item: { ...item, isBuyNow: true } },
      });
    }
  };

  return (
    <div className="relative inset-0 z-[999]">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={stopPropagation}
              className="fixed inset-0 bg-[#1C1917]/60 backdrop-blur-md z-[100]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={stopPropagation}
              className="fixed top-0 right-0 h-full w-full max-w-[390px] bg-[#FAF7EE] text-[#1C1917] border-l border-[#E8DFD0] z-[101] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 flex justify-between items-center border-b border-[#E8DFD0] bg-[#F3EFE6]">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1C1917] tracking-wider uppercase">
                    Your Shopping Bag
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-[#C26D43] animate-pulse" />
                    <p className="text-[10px] text-[#78716C] font-bold tracking-[0.15em] uppercase">
                      {items?.length || 0} Contemporary Items
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 bg-[#FAF7EE] hover:bg-[#E8DFD0] rounded-full transition-all group cursor-pointer border border-[#E8DFD0]"
                >
                  <X className="w-5 h-5 text-[#1C1917] group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {items && items.length > 0 ? (
                  items.map((item, idx) => {
                    const itemThumb = item.Thumbnail || item.thumbnail || item.photo || item.image || "";
                    const itemTitle = item.Title || item.title || item.product_name || "Contemporary Piece";
                    const itemPrice = Number(item.Price || item.price || item.SellingPrice || 0);
                    const itemQty = Number(item.Quantity || item.quantity || 1);
                    const itemSlug = item.Slug || item.slug || item.product_id || "";
                    const itemId = item.cart_id || item.variant_id || item.product_id || idx;

                    return (
                      <motion.div
                        layout
                        key={itemId}
                        className="flex gap-4 p-3 rounded-2xl bg-white border border-[#E8DFD0] hover:border-[#C26D43]/50 transition-all group relative overflow-hidden shadow-sm"
                      >
                        <div
                          onClick={() => {
                            if (itemSlug) {
                              toggleCart();
                              navigate(`/product/${itemSlug}`);
                            }
                          }}
                          className="w-20 h-24 rounded-xl overflow-hidden bg-[#F3EFE6] shrink-0 border border-[#E8DFD0] shadow-sm relative z-10 cursor-pointer flex items-center justify-center"
                        >
                          {itemThumb ? (
                            <img
                              src={getImageUrl(itemThumb)}
                              alt={itemTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <ShoppingBag className="w-8 h-8 text-[#C26D43]/50" />
                          )}
                        </div>

                        <div className="flex flex-col justify-between flex-1 py-1 relative z-10">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3
                                  onClick={() => {
                                    if (itemSlug) {
                                      toggleCart();
                                      navigate(`/product/${itemSlug}`);
                                    }
                                  }}
                                  className="text-[13px] font-bold text-[#1C1917] line-clamp-1 group-hover:text-[#C26D43] transition-colors cursor-pointer"
                                >
                                  {itemTitle}
                                </h3>

                                <button
                                  onClick={() => handleBuyItNow({ ...item, Price: itemPrice, Quantity: itemQty, Thumbnail: itemThumb, Title: itemTitle, Slug: itemSlug })}
                                  className="flex items-center justify-center gap-1.5 mt-1.5 text-[9px] font-bold text-[#C26D43] border border-[#C26D43]/30 bg-[#C26D43]/10 hover:bg-[#C26D43] hover:text-white px-2 py-0.5 rounded-md uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  <Zap size={10} fill="currentColor" />
                                  Buy This Only
                                </button>
                              </div>

                              <button
                                onClick={(e) => handleRemove(e, itemId)}
                                className="p-1.5 text-[#A8A29E] hover:text-red-500 transition-colors cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider">
                              {item.Attribute || item.color || "Contemporary Fit"}
                            </p>
                          </div>

                          {/* Qty & Price */}
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2.5 bg-[#F3EFE6] px-2.5 py-1 rounded-xl border border-[#E8DFD0]">
                              <button
                                onClick={(e) =>
                                  handleQtyChange(
                                    e,
                                    itemId,
                                    itemQty,
                                    "dec",
                                    item.AvailableQty
                                  )
                                }
                                className="text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                              >
                                <Minus size={11} strokeWidth={3} />
                              </button>
                              <span className="text-xs font-bold text-[#1C1917] w-4 text-center">
                                {itemQty}
                              </span>
                              <button
                                onClick={(e) =>
                                  handleQtyChange(
                                    e,
                                    itemId,
                                    itemQty,
                                    "inc",
                                    item.AvailableQty
                                  )
                                }
                                className="text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                              >
                                <Plus size={11} strokeWidth={3} />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black text-[#1C1917]">
                                ₹{Math.round(itemPrice * itemQty).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-12">
                    <div className="w-20 h-20 bg-[#F3EFE6] rounded-full flex items-center justify-center border border-[#E8DFD0] relative">
                      <ShoppingBag size={34} className="text-[#C26D43]" />
                      <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#C26D43] rounded-full border-2 border-[#FAF7EE]" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-serif font-bold text-[#1C1917] uppercase tracking-wider">
                        Your Bag is Empty
                      </h3>
                      <p className="text-xs text-[#78716C] leading-relaxed">
                        Explore our handcrafted linen & cotton collections to begin your wardrobe edit.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        toggleCart();
                        navigate("/shop");
                      }}
                      className="group flex items-center gap-2 bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md cursor-pointer"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items && items.length > 0 && (
                <div className="p-6 bg-[#F3EFE6] border-t border-[#E8DFD0] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#78716C] font-semibold tracking-wider uppercase">
                        Subtotal
                      </span>
                      <span className="text-2xl font-serif font-bold text-[#1C1917]">
                        ₹{Math.round(
                          summary?.total_base_price ||
                            items?.reduce(
                              (acc, i) =>
                                acc +
                                Number(i.Price || i.price || i.SellingPrice || 0) *
                                  Number(i.Quantity || 1),
                              0
                            ) ||
                            0
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#C26D43] font-semibold">
                      <Sparkles size={13} className="text-[#C26D43]" /> Free Express Shipping Applied
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </button>

                  <p className="text-[10px] text-center text-[#78716C] font-medium tracking-wide">
                    100% Encrypted & Secure Checkout • 7-Day Exchange
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ReminderLoginModal
        isOpen={showCheckoutModal}
        onClose={() => {
          setShowCheckoutModal(false);
          toggleCart();
        }}
      />
    </div>
  );
};
