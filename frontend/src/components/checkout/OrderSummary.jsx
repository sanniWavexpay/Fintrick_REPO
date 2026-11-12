import { Tag, ShieldCheck, Info, ChevronDown, X, ShoppingBag, ArrowRight, Ticket, Check, Loader2 } from "lucide-react";
import { useCart } from "../../features/cart/useCart";
import { getImageUrl } from "../../utils/image";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCoupon } from "../../features/coupon/useCoupon";
import { motion, AnimatePresence } from "framer-motion";

export const OrderSummary = ({ items, summary, setSummary, onUpdateQty, onRemoveItem, isReadOnly, appliedCoupon, setAppliedCoupon, isCalculating }) => {
  const navigate = useNavigate();
  const { updateQty } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);
  const [showGstTooltip, setShowGstTooltip] = useState(false);

  console.log(summary);

  // DIRECT FROM BACKEND
  const couponDiscount = summary?.coupon_discount || appliedCoupon?.discount || 0;
  const basePrice = summary?.original_base_price || summary?.total_base_price || 0;
  const gst_price = summary?.gst_price || summary?.total_tax || 0;
  const adjustedSubtotal = summary?.total_base_price || 0;
  const finalPayable = summary?.final_payable || 0;
  const isSyncing = isCalculating || !summary;

  // Coupon hook
  const {
    applyCoupon,
    removeCoupon: removeCouponHook,
    availableCoupons,
    isApplying,
    listLoading,
  } = useCoupon(summary?.total_base_price || 0, setSummary);

  // ================= COUPON VALIDITY CHECK =================
  // Item remove ya qty change ke baad check karo ki coupon abhi valid hai ya nahi
  const checkCouponAfterCartChange = (newTotal) => {
    if (!appliedCoupon) return;
    const minAmt = appliedCoupon.minOrderAmount || 0;
    if (minAmt > 0 && newTotal < minAmt) {
      setAppliedCoupon(null);
      toast(`Coupon "${appliedCoupon.code}" removed — cart total is now below ₹${Math.round(minAmt)} minimum`, { icon: "⚠️" });
    }
  };

  // ================= REMOVE ITEM =================
  const handleRemove = (e, item) => {
    e.stopPropagation();
    const idToRemove = item.cart_id;

    // Cart total after removing this item
    const removedItemTotal = (item.Price || 0) * (item.Quantity || 1);
    const newTotal = Math.max(0, (summary?.total_base_price || 0) - removedItemTotal);
    checkCouponAfterCartChange(newTotal);

    if (onRemoveItem) {
      onRemoveItem(idToRemove);
    }
  };

  // ================= QTY CHANGE =================
  const handleQtyChange = (e, cart_id, currentQty, type) => {
    e.stopPropagation();
    const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1 || newQty > 5) return;

    // Cart total after qty change (sirf decrease pe check karo)
    if (type === "dec" && appliedCoupon) {
      const thisItem = items.find((i) => i.cart_id === cart_id);
      const pricePerUnit = thisItem?.Price || 0;
      const newTotal = Math.max(0, (summary?.total_base_price || 0) - pricePerUnit);
      checkCouponAfterCartChange(newTotal);
    }

    if (onUpdateQty) {
      onUpdateQty(cart_id, newQty);
    } else {
      updateQty({ cart_id: cart_id, Quantity: newQty });
    }
  };

  // ================= COUPON HANDLERS =================
  const handleApplyCoupon = (code) => {
    const codeToApply = code || couponInput.trim();
    if (!codeToApply) {
      toast.error("Please enter a coupon code");
      return;
    }
    // Use the coupon service directly for cleaner flow
    import("../../services/coupon.service").then(({ couponService }) => {
      couponService
        .apply(codeToApply, summary?.total_base_price || 0)
        .then((result) => {
          if (result.status) {
            setAppliedCoupon({
              id: result.coupon_id,
              code: result.coupon_code,
              discount: result.discount,
              minOrderAmount: result.min_order_amount || 0,
            });

            setCouponInput("");
            setShowCoupons(false);
            toast.success(result.message || "Coupon Applied!");
          } else {
            toast.error(result.message || "Invalid Coupon");
          }
        })
        .catch((err) => {
          toast.error(err?.message || "Something went wrong");
        });
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast("Coupon Removed", { icon: "ℹ️" });
  };

  // ================= EMPTY REDIRECT =================
  useEffect(() => {
    // If we are in read-only mode (Success Step), don't redirect even if items are empty
    if (isReadOnly) return;

    if (items.length === 0) {
      navigate("/shop", { replace: true });
    }
  }, [items.length, navigate, isReadOnly]);

  return (
    <div className="space-y-6 text-zinc-900">
      {/* HEADER */}
      <div className="pb-3 border-b border-zinc-100">
        <h3 className="text-base font-black uppercase tracking-widest text-zinc-800">Order Summary</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="badge badge-ghost badge-xs font-bold text-zinc-400">
            {items?.length} {items?.length > 1 ? "ITEMS" : "ITEM"}
          </span>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-tight">Review before payment</p>
        </div>
      </div>

      {/* COMPACT PRODUCT LIST */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
        {items.map((item) => (
          <div
            key={item.cart_id}
            className={`flex gap-3 p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm relative group transition-all 
             ${isReadOnly ? "cursor-default opacity-95 " : "hover:border-zinc-200 cursor-pointer shadow-md"}`}
            onClick={(e) => {
              if (isReadOnly) return;
              navigate(`/product/${item?.Slug}`);
            }}
          >
            {/* REMOVE BUTTON */}
            {!isReadOnly && (
              <button
                onClick={(e) => handleRemove(e, item)}
                className="absolute top-2 right-2 p-1 rounded-full bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors z-20 "
                title="Remove Item"
              >
                <X size={12} />
              </button>
            )}

            {/* DISCOUNT BADGE (Floating Pill) */}
            {item?.Discount > 0 && <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg z-10 border border-white/20">{Math.round(item?.Discount)}% OFF</div>}

            {/* Image Section */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border bg-zinc-50 shrink-0 mt-1 ">
              <img src={getImageUrl(item?.Thumbnail)} className="w-full h-full object-cover" alt={item?.Title} />
            </div>

            {/* Info Section */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div className="pr-6">
                <h4 className="text-[11px] md:text-[12px] font-black uppercase leading-tight tracking-tight text-zinc-800 line-clamp-1">{item?.Title}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item?.Attribute ? (
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{item?.Attribute}</p>
                  ) : (
                    <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-tighter italic">Standard Edition</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] text-black font-bold font-mono">₹{Math.round(item?.Price * item.Quantity)}</span>
                  <span className="text-[9px] font-bold text-zinc-400 line-through">₹{Math.round(item.MRP * item.Quantity)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className={`flex items-center rounded-lg p-0.5 border ${isReadOnly ? "bg-zinc-50 border-zinc-100" : "bg-zinc-100 border-zinc-200"}`}>
                  {!isReadOnly && (
                    <button
                      onClick={(e) => handleQtyChange(e, item.cart_id, item.Quantity, "dec")}
                      className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-white hover:text-[#ff0080] rounded-md transition-all active:scale-90 disabled:opacity-30"
                      disabled={item.Quantity <= 1}
                    >
                      <span className="text-lg font-bold leading-none">-</span>
                    </button>
                  )}
                  <span className={`w-6 text-center text-[10px] font-black ${isReadOnly ? "text-zinc-400" : "text-zinc-900"}`}>
                    {isReadOnly ? `x${item.Quantity}` : item.Quantity}
                  </span>
                  {!isReadOnly && (
                    <button
                      onClick={(e) => handleQtyChange(e, item.cart_id, item.Quantity, "inc")}
                      className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-white hover:text-[#ff0080] rounded-md transition-all active:scale-90 disabled:opacity-30"
                      disabled={item.Quantity >= 5}
                    >
                      <span className="text-lg font-bold leading-none">+</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-600 uppercase">Express</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========== COUPON SECTION ========== */}
      {!isReadOnly && (
        <div className="space-y-3">
          {/* Applied Coupon Badge */}
          {appliedCoupon ? (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    {appliedCoupon.code} Applied
                  </p>
                  <p className="text-[9px] font-bold text-emerald-500">You save ₹{Math.round(appliedCoupon.discount)}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-[9px] font-black text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all uppercase tracking-wider"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              {/* Coupon Input */}
              <div className="p-1.5 pl-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Tag size={12} className="text-[#C26D43] shrink-0" />
                  <input
                    type="text"
                    value={couponInput}
                    maxLength={20}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="Enter coupon code"
                    className="text-[11px] font-bold uppercase tracking-tight text-zinc-800 bg-transparent outline-none w-full placeholder:text-zinc-400 placeholder:normal-case"
                  />
                </div>
                <button
                  onClick={() => handleApplyCoupon()}
                  disabled={isApplying}
                  className="text-[9px] font-black text-[#C26D43] hover:bg-white px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 uppercase tracking-wider shrink-0"
                >
                  {isApplying ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
                </button>
              </div>

              {/* Available Coupons Toggle */}
              {availableCoupons?.length > 0 && (
                <button
                  onClick={() => setShowCoupons(!showCoupons)}
                  className="w-full text-[9px] font-black text-[#C26D43] uppercase tracking-widest py-1 hover:underline transition-all flex items-center justify-center gap-1"
                >
                  <Ticket size={10} />
                  {showCoupons ? "Hide" : `View ${availableCoupons.length} Available`} Coupons
                  <ChevronDown size={10} className={`transition-transform ${showCoupons ? "rotate-180" : ""}`} />
                </button>
              )}

              {/* Available Coupons List */}
              {showCoupons && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon.ID}
                      className="p-3 bg-white rounded-xl border border-zinc-100 flex items-center justify-between hover:border-[#C26D43]/30 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md tracking-wider">
                            {coupon.Code}
                          </span>
                          <span className="text-[8px] font-bold text-emerald-600 uppercase">
                            {coupon.DiscountType === 5 ? `₹${Math.round(coupon.DiscountValue)} OFF` : `${Math.round(coupon.DiscountValue)}% OFF`}
                          </span>
                        </div>
                        {coupon.Description && (
                          <p className="text-[9px] text-zinc-400 font-medium mt-1 truncate">{coupon.Description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {coupon.MinOrderAmount > 0 && (
                            <span className="text-[8px] text-zinc-400 font-bold">Min ₹{Math.round(coupon.MinOrderAmount)}</span>
                          )}
                          {coupon.MaxDiscountAmount > 0 && coupon.DiscountType === 6 && (
                            <span className="text-[8px] text-zinc-400 font-bold">Max ₹{Math.round(coupon.MaxDiscountAmount)} off</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyCoupon(coupon.Code)}
                        className="text-[9px] font-black text-[#C26D43] border border-[#C26D43]/20 px-3 py-1 rounded-lg hover:bg-[#C26D43] hover:text-white transition-all shrink-0 uppercase"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* DETAILED PRICE BREAKDOWN */}
      <div className="space-y-2.5 pt-1 relative">
        <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-zinc-400">
          <span>Total MRP</span>
          <span className={`font-mono transition-opacity ${isSyncing ? "opacity-30" : "opacity-100"}`}>
            ₹{Math.round(summary?.total_mrp || 0)}
          </span>
        </div>

        <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-emerald-500">
          <span>Bag Discount</span>
          <span className={`font-mono transition-opacity ${isSyncing ? "opacity-30" : "opacity-100"}`}>
            - ₹{Math.round(summary?.bag_discount || 0)}
          </span>
        </div>

        {/* COUPON DISCOUNT ROW */}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-[#C26D43]">
            <span className="flex items-center gap-1">
              <Tag size={10} /> Coupon ({appliedCoupon?.code})
            </span>
            <span className="font-mono">- ₹{Math.round(couponDiscount)}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-zinc-800 border-t border-zinc-50 pt-2">
          <span>Subtotal</span>
          <span className="font-mono">₹{Math.round(adjustedSubtotal)}</span>
        </div>
        <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-zinc-500">
          <span>Handling Fee</span>
          <span className="text-zinc-800 font-mono">₹{Math.round(summary?.platform_fee || 0)}</span>
        </div>

        <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-zinc-500 pb-3 border-b border-zinc-50">
          <span>Delivery Fee</span>
          <span className="text-emerald-600 font-black">{typeof summary?.delivery_charge === 'number' ? (summary.delivery_charge === 0 ? 'FREE' : `₹${Math.round(summary.delivery_charge)}`) : summary?.delivery_charge}</span>

        </div>
        <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-zinc-500 pb-3 border-b border-zinc-50">
          <span
            className="flex items-center gap-1 cursor-help group relative"
            onMouseEnter={() => setShowGstTooltip(true)}
            onMouseLeave={() => setShowGstTooltip(false)}
          >
            <div className="flex flex-col items-start">
              <span className="flex items-center gap-1">GST Price <Info size={10} className="text-zinc-300 group-hover:text-[#C26D43] transition-colors" /></span>
              <span className="text-[8px] font-bold opacity-50 lowercase tracking-tighter">(18% inclusive)</span>
            </div>

            {/* 🔥 PREMIUM GST TOOLTIP 🔥 */}
            <AnimatePresence>
              {showGstTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-3 w-64 bg-white border border-zinc-100 shadow-2xl rounded-2xl p-4 z-50 text-left normal-case tracking-normal"
                >
                  <div className="flex items-center gap-2 mb-2 border-b border-zinc-50 pb-2">
                    <Info size={12} className="text-[#C26D43]" />
                    <span className="font-black text-zinc-800 uppercase tracking-tighter text-[10px]">Tax Information</span>
                  </div>

                  <div className="space-y-3 text-[10px] leading-relaxed text-zinc-500 font-medium">
                    <p>
                      <strong className="text-zinc-700 block">GST Inclusive:</strong>
                      The total payable amount already includes Goods and Services Tax as per Government norms.
                    </p>
                    <div className="bg-zinc-50 p-2 rounded-xl space-y-1">
                      <p className="font-bold text-zinc-800">Quick Breakdown</p>
                      <div className="flex justify-between"><span>Base Amount:</span> <span>₹{Math.round(adjustedSubtotal)}</span></div>
                      <div className="flex justify-between text-emerald-600 font-bold"><span>Tax Added:</span> <span>₹{Math.round(gst_price)}</span></div>
                    </div>
                    <p className="italic opacity-70 text-[9px]">A detailed GST invoice will be available for download after successful delivery.</p>
                  </div>

                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-4 border-8 border-transparent border-t-white"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
          <span className="text-emerald-600 font-black">₹{Math.round(gst_price)}</span>
        </div>
      </div>

      {/* SAVINGS HIGHLIGHT */}
      <div className="bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
        <p className="text-[12px] font-black text-emerald-700 uppercase ">
          You are saving ₹{Math.round((summary?.bag_discount || 0) + couponDiscount)} on this order! 🥳
        </p>
      </div>

      {/* TOTAL PAYABLE (ROUNDED) */}
      <div className="flex justify-between items-center relative">
        {isSyncing && (
          <div className="absolute inset-x-0 -top-2 flex justify-center">
            <div className="bg-white px-2 py-0.5 rounded-full border border-zinc-100 shadow-sm flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 text-[#C26D43] animate-spin" />
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-tighter">Syncing...</span>
            </div>
          </div>
        )}
        <div className={`${isSyncing ? "opacity-40" : "opacity-100"} transition-opacity`}>
          <p className="text-[9px] font-bold text-zinc-400 mt-0.5">Final amount to pay</p>
          <p className="text-[16px] font-black uppercase tracking-[0.2em] text-[#C26D43]">Total Payable</p>
          <p className="text-[8px] font-medium text-zinc-400 italic">* Price is inclusive of all applicable taxes (GST)</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black tracking-tighter text-zinc-900 font-mono transition-all ${isSyncing ? "opacity-30 scale-95" : "opacity-100 scale-100"}`}>
            ₹{Math.round(finalPayable)}
          </span>
        </div>
      </div>

      {/* TRUST BADGE */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 text-white shadow-lg">
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <ShieldCheck size={16} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest">Secure Checkout</p>
          <p className="text-[7px] font-bold text-zinc-400 uppercase mt-0.5">Verified & Encrypted</p>
        </div>
      </div>
    </div>
  );
};
