import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Timer, Copy, CheckCircle2, ShieldCheck, Check, QrCode, Smartphone } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { usePaymentStatus } from "../../features/payment/usePyamentStatus";
import { usePayment } from "../../features/payment/usePayment";

export const UPIPaymentModal = ({ paymentData, isOpen, onClose, onPaymentSuccess }) => {
  const { amount, orderNo, upiString, txnId } = paymentData;
  const [timeLeft, setTimeLeft] = useState(300);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const { cancelPayment } = usePayment();
  console.log("sanni", amount, orderNo, upiString, txnId);

  // 1. React Query Hook (Polling 3s interval)
  const { data: statusResponse } = usePaymentStatus(txnId, isOpen);
  const currentStatus = statusResponse?.status; // Yeh 27, 28, 42 ya 43 hoga

  // 2. Payment Status Handling Logic
  useEffect(() => {
    if (!isOpen) return;

    if (currentStatus === 27) {
      // ✅ SUCCESS
      toast.success("Payment Received! Redirecting...");
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } else if (currentStatus === 28) {
      // ❌ FAILED
      toast.error("Payment failed by the bank.");
      onClose();
    } else if (currentStatus === 42) {
      // ⏰ EXPIRED (Backend set)
      toast.error("Transaction expired.");
      onClose();
    }
  }, [currentStatus, isOpen, orderNo, onClose]);

  // 3. Frontend Timer Expiry Sync (If server is slow, frontend will close)
  useEffect(() => {
    if (timeLeft === 0 && isOpen && currentStatus === 43) {
      toast.error("Session timed out!");
      onClose();
    }
  }, [timeLeft, isOpen, currentStatus, onClose]);

  // Dynamic UPI ID nikalne ke liye (pa= ke baad wala hissa)
  const extractVpa = (url) => {
    try {
      if (!url) return "shopkaroweb@icici";
      const params = new URLSearchParams(url.split("?")[1]);
      return params.get("pa") || "shopkaroweb@icici";
    } catch {
      return "shopkaroweb@icici";
    }
  };
  const vpa = extractVpa(upiString);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300); // reset timer
    }
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft === 0 && isOpen) {
      toast.error("Payment session expired! Please initiate a new payment.");
      onClose();
    }
  }, [timeLeft, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  const displayAmount = Number(amount).toLocaleString("en-IN");

  const handleModalClose = () => {
    Swal.fire({
      title: "Cancel Payment?",
      text: "Are You Sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await cancelPayment(txnId);
        toast.error("Transaction Cancelled");
        onClose();
      }
    });
  };
  const handleAppPayment = () => {
    if (!upiString) return;
    // Mobile browser ko instruction milegi ki UPI app kholo
    window.location.href = upiString;
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} // Animation change for full screen
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[1002] flex items-center justify-center pointer-events-none md:p-4"
          >
            <div className="w-full h-full md:h-auto md:max-h-[95vh] md:max-w-[400px] bg-white md:rounded-[2.5rem] p-6 shadow-2xl relative pointer-events-auto overflow-y-auto flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 text-[10px] text-[#ff0080] font-black bg-pink-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  <Timer size={12} />
                  {min}:{sec < 10 ? `0${sec}` : sec}
                </div>
                <h2 className="mt-4 text-2xl text-black font-black uppercase tracking-tight">Scan & Pay</h2>
                <p className="text-[14px] font-bold text-zinc-400 uppercase mt-2">
                  Payable Amount : <span className="text-black text-[18px]"> ₹{displayAmount}</span>
                </p>
              </div>
              {/* Close Button - Thoda bada for mobile accessibility */}
              <button onClick={handleModalClose} className="absolute top-6 right-6 p-2 bg-zinc-100 text-zinc-500 rounded-full hover:bg-zinc-200 transition-colors z-10">
                <X size={20} />
              </button>

              <div className="flex-1 flex flex-col justify-center ">
                <div className="flex justify-center mb-8">
                  <div className="relative p-4 bg-white border-2 border-zinc-50 rounded-[2rem] shadow-xl">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`}
                      className={`w-40 h-40 transition-opacity duration-500 ${qrLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setQrLoaded(true)}
                      alt="Payment QR"
                    />
                  </div>
                </div>
                {/* ... Rest of the compact UI (Apps & UPI ID) ... */}
                <div className="flex justify-center items-center gap-6 mb-5 opacity-60">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" className="h-4" />
                </div>

                {/* Mobile Pay Button - Bada aur prominent */}
                <div className="md:hidden mb-6 px-4">
                  <button
                    onClick={handleAppPayment}
                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[14px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform"
                  >
                    <Smartphone size={22} />
                    Pay via UPI App
                  </button>
                  <p className="text-center text-[9px] text-zinc-400 mt-2 font-bold uppercase tracking-tighter">Google Pay, PhonePe, Paytm & more</p>
                </div>

                {/* UPI ID & Apps Icons */}
                <div className="px-4">
                  <div onClick={handleCopy} className="bg-zinc-50 px-5  rounded-2xl border border-zinc-100 flex justify-between items-center cursor-pointer ">
                    <div className="truncate">
                      <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">UPI ID</span>
                      <p className="text-black text-[13px] font-black">{vpa}</p>
                    </div>
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-zinc-400" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 md:pt-5 text-center">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Secure Payment via UPI Gateway</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
