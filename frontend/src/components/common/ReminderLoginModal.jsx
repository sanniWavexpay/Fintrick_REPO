import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom"; // 👈 Ye zaroori hai

export const ReminderLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const openLoginPage = () => {
    // 1. Pehle modal ko band karo
    onClose();
    navigate("/user-auth", { state: { from: location.pathname } });
    // navigate("/login", { state: { from: location.pathname, intent: "buy_now", variantId: selectedVariant?.ID } });
    // navigate("/user-auth");
  };
  //   if (!isOpen) return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // 👈 Modal ke andar click karne pe kuch na ho
            className="relative w-full max-w-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col items-center"
          >
            {/* Close */}
            <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-zinc-100 rounded-full text-zinc-400">
              <X size={18} />
            </button>

            {/* Icon & Title */}
            <div className="w-14 h-14 bg-zinc-950 text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-black/20">
              <ShieldCheck size={28} />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 text-center leading-tight">Sign in to Checkout</h3>
            <p className="text-zinc-500 text-[13px] text-center mt-2 leading-relaxed">Login to access secure payments and order tracking.</p>

            {/* Main Button */}
            <button
              onClick={openLoginPage}
              className="w-full mt-8 bg-zinc-950 text-white py-4 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95"
            >
              Secure Login
              <ArrowRight size={16} />
            </button>

            {/* Cancel Link */}
            <button onClick={onClose} className="mt-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900">
              Maybe Later
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body, // 👈 Ye isko Sidebar ke "jail" se bahar nikal dega
  );
};
