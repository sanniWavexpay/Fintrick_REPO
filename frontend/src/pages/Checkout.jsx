import { useEffect, useState } from "react";
import { Lock, MapPin, ShieldCheck, ChevronRight, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { ShippingForm } from "../components/checkout/ShippingForm";
import { PaymentMethods } from "../components/checkout/PaymentMethods";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { OrderConfirmation } from "../components/checkout/OrderConfirmation";
import { Button } from "../components/common/Button";
import { UPIPaymentModal } from "../components/common/UPIPaymentModal";

import { useCart } from "../features/cart/useCart";
import { useAddress } from "../features/address/useAddress";
import { useOrder } from "../features/order/useOrder";
import { usePayment } from "../features/payment/usePayment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "../services/order.service";
import rupay from "../assets/image/social/rupay.png";
import visa from "../assets/image/social/visa.png";
import master from "../assets/image/social/master.png";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({ amount: 0, orderNo: "" });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);


  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, removeItem, removeItemAsync, updateQty, refetchCart } = useCart();
  const { addresses } = useAddress();
  const { user } = useSelector((state) => state.auth);
  const { placeOrder, isPlacingOrder } = useOrder();
  const { startPayment } = usePayment();
  const queryClient = useQueryClient();

  const selectedAddress = addresses?.find((a) => a.ID === selectedAddrId);

  console.log("location.state?.item?.isBuyNow ", location.state?.item?.isBuyNow);

  const buyNowFromLocation = location.state?.item?.isBuyNow ? location.state.item : null;
  console.log("buyNowFromLocation", buyNowFromLocation);

  const [checkoutItems, setCheckoutItems] = useState(() => {
    return buyNowFromLocation ? [buyNowFromLocation] : cartItems?.items || [];
  });

  useEffect(() => {
    if (buyNowFromLocation) {
      setCheckoutItems([buyNowFromLocation]);
    } else {
      setCheckoutItems(cartItems?.items || []);
    }
  }, [location.state, cartItems?.items]);

  // ================= SERVER-SIDE SUMMARY =================
  const [summaryState, setSummaryState] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMutation = useMutation({
    mutationFn: orderService.calculateSummary,
    onSuccess: (data) => {
      if (data.success) {
        setSummaryState(data.summary);
      }
    },
    onError: () => {
      toast.error("Failed to calculate prices");
    }
  });

  // 🔥 STABLE CALCULATION TRIGGER (Prevents Infinite Loops)
  const itemsHash = JSON.stringify(checkoutItems?.map(i => ({ id: i.variant_id || i.PVID, q: i.Quantity })));
  
  useEffect(() => {
    if (checkoutItems && checkoutItems.length > 0) {
      setIsCalculating(true);
      const payload = {
        items: checkoutItems.map(item => ({
          PVID: item.variant_id || item.PVID,
          Quantity: item.Quantity
        })),
        coupon_code: appliedCoupon?.code || null
      };

      calculateMutation.mutate(payload, {
        onSettled: () => setIsCalculating(false)
      });
    } else {
      setSummaryState(null);
    }
  }, [itemsHash, appliedCoupon?.code]); // Only trigger when actual items/quantities or coupon code changes

  const finalPayable = summaryState?.final_payable || 0;

  // ================= HANDLERS =================
  const handleRemoveItem = async (id) => {
    try {
      if (buyNowFromLocation) {
        setCheckoutItems([]);
        navigate("/shop");
      } else {
        await removeItem(id);
        setCheckoutItems((prev) => prev.filter((item) => (item.cart_id || item.id) !== id));
        toast.success("Item removed from cart");
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateQty = async (targetId, newQty) => {
    setCheckoutItems((prev) => prev.map((item) => (item.cart_id === targetId || item.variant_id === targetId ? { ...item, Quantity: newQty } : item)));

    if (!buyNowFromLocation) {
      try {
        await updateQty({ cart_id: targetId, Quantity: newQty });
      } catch {
        toast.error("Sync failed!");
      }
    }
  };

  const handleFinalAction = async () => {
    if (step === 1) {
      if (!selectedAddrId) {
        toast.error("📍 Please select a delivery address!");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (isPlacingOrder || isProcessing || isCalculating) return;

      if (!checkoutItems || checkoutItems.length === 0) {
        toast.error("🛒 No items found to checkout!");
        return;
      }

      if (Number(finalPayable) <= 0) {
        toast.error("⚠️ Please wait for the price calculation to complete.");
        return;
      }

      setIsProcessing(true);

      try {
        const orderPayload = {
          UID: user?.ID,
          ShippingAddressID: selectedAddrId,
          PaymentMode: (selectedPayment || "").toUpperCase(),
          isBuyNow: !!buyNowFromLocation,
          GrandTotal: Number(finalPayable),
          items: checkoutItems.map((item) => ({
            PVID: item.variant_id || item.PVID,
            Quantity: item.Quantity,
            VariantAttribute: item.Attribute || item.color || item.VariantAttribute || "",
          })),
          coupon_code: appliedCoupon?.code || null,
          coupon_discount: appliedCoupon?.discount || 0,
        };

        const response = await placeOrder(orderPayload);

        if (response.success) {
          const { OrderNo, PaymentMode, GrandTotal } = response;

          if (PaymentMode === "COD") {
            toast.success("📦 Order Placed!");

            // 1. Snapshot the data for success screen
            const finalDetails = {
              ...response,
              items: [...checkoutItems],
              summary: { ...summaryState }
            };
            setPlacedOrderDetails(finalDetails);

            // 2. MOVE TO STEP 3 IMMEDIATELY (Prevents empty-cart redirect)
            setStep(3);

            // 3. CLEANUP: If purchased from cart (Buy This Only), remove that specific item
            if (buyNowFromLocation?.cart_id) {
              try {
                await removeItemAsync(buyNowFromLocation.cart_id);
              } catch (err) {
                console.error("Cart cleanup failed", err);
              }
            }

            // 4. Clear the cart in the background
            await refetchCart();
          }

          if (PaymentMode === "UPI") {
            const paymentData = {
              order_id: OrderNo,
              name: selectedAddress.Name,
              email: selectedAddress.Email,
              phone: selectedAddress.Phone,
              amount: GrandTotal,
            };
            const payRes = await startPayment(paymentData);
            if (payRes?.success) {
              const data = payRes.data;
              setPaymentDetails({
                upiString: data.UPI_URL, // Backend se aaya dynamic UPI link
                txnId: data.TxnID, // Backend ka Transaction ID
                amount: data.Amount, // Backend se confirmed amount
                orderNo: data.OrderID, // Backend ka Order ID
              });
              setIsUPIModalOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Order Error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const getActionLabel = () => {
    if (step === 1) {
      return selectedAddrId ? "Confirm Address" : "Select Address";
    }
    if (step === 2) {
      if (!selectedPayment) return "Select Payment Mode";
      return selectedPayment === "upi" ? "Pay Now" : "Place Order";
    }
    return "Done";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-0 md:p-6 lg:p-10">
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative w-24 h-24 mb-6">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-t-[#ff0080] border-zinc-100 rounded-full"
              />
              {/* Inner Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedPayment === "cod" ? (
                  <Package size={32} className="text-[#ff0080] animate-pulse" />
                ) : (
                  <ShieldCheck size={32} className="text-[#ff0080] animate-pulse" />
                )}
              </div>
            </div>

            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-800">
              {selectedPayment === "cod" ? "Placing Your Order..." : "Securing Transaction..."}
            </h3>
            <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Please do not refresh or press back</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- DESKTOP BACK BUTTON --- */}
      <div className="hidden md:block max-w-6xl ms-7 mb-4 ">
        <button onClick={() => navigate("/shop")} className="group flex items-center gap-2 text-zinc-400 hover:text-[#ff0080] transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:border-[#ff0080]/30 group-hover:shadow-sm transition-all">
            <ChevronRight size={16} className="rotate-180" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Shop</span>
        </button>
      </div>
      <div className="w-full max-w-6xl mx-auto bg-white md:rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden relative">
        {/* --- STEP INDICATOR: Responsive scrollable for mobile --- */}
        <div className="flex items-center justify-start md:justify-center gap-1 py-6 px-4 border-b border-zinc-100 bg-zinc-50/50 overflow-x-auto no-scrollbar">
          {[
            { id: 1, label: "Address" },
            { id: 2, label: "Payment" },
            { id: 3, label: "Success" },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${step >= s.id ? "bg-[#C26D43] text-white shadow-md" : "bg-white text-zinc-400 border border-zinc-200"
                  }`}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {s.id}. {s.label}
                </span>
              </div>
              {i < 2 && <ChevronRight size={12} className="text-zinc-300" />}
            </div>
          ))}
        </div>

        {/* --- CONTENT AREA: Reversed Column for Mobile --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-12">
          {/* LEFT: Forms (8 Columns on Large) */}
          <div className="lg:col-span-7 p-6 md:p-12 border-r border-zinc-100 bg-white">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-xl md:text-2xl text-black font-black mb-6 uppercase tracking-[0.1em]">Delivery Address</h2>
                  <ShippingForm
                    setStep={setStep}
                    selectedAddrId={selectedAddrId} // Pass state
                    setSelectedAddrId={setSelectedAddrId} // Pass setter
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter mb-2">Payment</h2>
                  <p className="text-xs text-zinc-400 font-bold mb-8 uppercase tracking-widest">100% Secure Transaction</p>
                  {/* Add this inside step 2 motion.div */}
                  <div className="mb-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <MapPin size={18} className="text-[#ff0080]" />
                      </div>
                      {selectedAddress ? (
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivering To</h4>
                          <p className="text-xs font-bold text-zinc-900 mt-0.5">
                            {selectedAddress.Name} • {selectedAddress.Pincode}
                          </p>
                          <p className="text-[10px] text-zinc-500 truncate max-w-[200px] md:max-w-md">
                            {selectedAddress.Address}, {selectedAddress.City}, {selectedAddress.State}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-red-500">No address selected!</p>
                      )}
                    </div>
                    <button onClick={() => setStep(1)} className="text-[10px] font-black text-[#ff0080] uppercase border-b border-[#ff0080]/20 pb-0.5">
                      Change
                    </button>
                  </div>
                  <div className="mt-8 pt-6 border-t border-zinc-100">
                    <p className="text-center text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Guaranteed Safe Checkout</p>
                    <div className="flex justify-center items-center gap-2 bg-primary/20 p-2 rounded-xl">
                      {/* Use real logo URLs or high-quality icons */}
                      <img src={visa} className="h-10" alt="Visa" />
                      <img src={master} className="h-10" alt="Mastercard" />
                      <div className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-zinc-800">PCI-DSS</span>
                      </div>
                    </div>
                  </div>
                  <PaymentMethods selected={selectedPayment} onChange={setSelectedPayment} />

                  <div className="flex gap-4 mt-10 hidden md:flex">
                    {/* Back Button */}
                    <Button label="Back" variant="outline" className="flex-1" onClick={() => setStep(1)} />
                    {/* Pay Button using your custom component logic */}
                    <Button
                      label={getActionLabel()}
                      variant="primary"
                      className={`flex-[2] transition-all ${step === 2 && !selectedPayment ? "opacity-50 grayscale" : ""}`}
                      disabled={(step === 2 && !selectedPayment) || isPlacingOrder || isProcessing}
                      onClick={handleFinalAction}
                    />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <OrderConfirmation orderDetails={placedOrderDetails} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Order Summary (5 Columns on Large) */}
          <div className="lg:col-span-5 p-6 md:p-12 bg-zinc-50/50">
            <div className="sticky top-10">
              <h3 className="text-sm text-black font-bold uppercase tracking-widest mb-6 opacity-40">Your Order</h3>
              <OrderSummary
                items={step === 3 ? placedOrderDetails?.items : checkoutItems}
                onRemoveItem={step === 3 ? null : handleRemoveItem}
                onUpdateQty={step === 3 ? null : handleUpdateQty}
                summary={step === 3 ? placedOrderDetails?.summary : summaryState}
                setSummary={setSummaryState}
                isReadOnly={step === 3}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                isCalculating={isCalculating}
              />
              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-zinc-200 flex items-center gap-4 opacity-50 grayscale">
                <Lock size={16} />
                <p className="text-[10px] font-bold uppercase tracking-tight">SSL Encrypted Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. UPI MODAL RENDERING */}
      <UPIPaymentModal
        isOpen={isUPIModalOpen}
        onClose={() => setIsUPIModalOpen(false)}
        // Pura object bhej do
        paymentData={paymentDetails}
        onPaymentSuccess={async () => {
          setIsUPIModalOpen(false); // Modal band karo

          // 1. Snapshot items and summary for the success component
          const finalSuccessData = {
            success: true,
            OrderNo: paymentDetails.orderNo,
            GrandTotal: paymentDetails.amount,
            PaymentMode: "UPI",
            items: [...checkoutItems], // <--- FREEZE ITEMS
            summary: { ...summaryState }, // <--- FREEZE SUMMARY
            ShippingAddress: selectedAddress ? {
              Name: selectedAddress.Name,
              Details: `${selectedAddress.Address}, ${selectedAddress.City}, ${selectedAddress.State} - ${selectedAddress.Pincode}`
            } : null,
            DeliveryEstimate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })
          };

          setPlacedOrderDetails(finalSuccessData);

          // 2. Move to Step 3 BEFORE refetching (LOCKS the screen)
          setStep(3);

          // 3. CLEANUP: If purchased from cart (Buy This Only), remove that specific item
          if (buyNowFromLocation?.cart_id) {
            try {
              await removeItemAsync(buyNowFromLocation.cart_id);
            } catch (err) {
              console.error("Cart cleanup failed", err);
            }
          }

          // 4. Sync backend cart (empties it)
          await refetchCart();

          // 5. Invalidate orders to ensure UI updates automatically (React Query Power!)
          queryClient.invalidateQueries({ queryKey: ["myOrders"] });
        }}
      />

      {/* <CardPaymentModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} /> */}

      {/* --- FLIPKART STYLE STICKY BOTTOM BAR (Mobile Only) --- */}
      {step < 3 &&
        checkoutItems?.length > 0 && ( // Cart empty hone par poora footer hide ho jayega
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between z-[100] shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
            {/* Left Side: Price Info */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Payable</span>
              <div className="flex items-center gap-2">
                {/* finalPayable ko .toLocaleString() ke saath likho formatting ke liye */}
                <span className="text-lg font-black text-black">₹{Math.round(finalPayable)}</span>
              </div>
              <p className="text-[8px] font-medium text-zinc-400 italic">* Price is inclusive of all applicable taxes (GST)</p>
            </div>

            {/* Right Side: Action Button */}
            <div>
              <Button
                label={getActionLabel()}
                variant="primary"
                size="sm"
                disabled={(step === 1 && !selectedAddrId) || (step === 2 && !selectedPayment) || isPlacingOrder || isProcessing}
                className={`w-full !rounded-xl !py-4 shadow-lg transition-all ${
                  (step === 1 && !selectedAddrId) || (step === 2 && !selectedPayment) || isPlacingOrder || isProcessing
                    ? "opacity-50 cursor-not-allowed grayscale shadow-none"
                    : "shadow-pink-200 active:scale-95"
                }`}
                onClick={handleFinalAction}
              />
            </div>
          </div>
        )}
    </div>
  );
}
