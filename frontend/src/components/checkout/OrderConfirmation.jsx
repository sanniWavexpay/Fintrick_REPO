import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, Calendar, ShoppingBag, Home, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti"; // npm install canvas-confetti
import { useNavigate } from "react-router-dom";

export const OrderConfirmation = ({ orderDetails }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(20); // 20 seconds timer
  // Confetti celebration on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff0080", "#10b981", "#7e22ce"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff0080", "#10b981", "#7e22ce"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/"); // 20 sec baad Home pe redirect
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);
  const steps = [
    { label: "Order Placed", date: "Today", icon: CheckCircle2, active: true },
    { label: "Processing", date: "Confirmed", icon: Package, active: false },
    { label: "Delivery", date: `Expected By ${orderDetails?.DeliveryEstimate || "7 Days"}`, icon: Truck, active: false },
  ];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center">
      {/* SUCCESS ANIMATION */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 size={48} className="text-emerald-500" />
      </motion.div>

      <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">Order Placed!</h2>
      <p className="text-zinc-500 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">Order ID: #{orderDetails?.OrderNo || "SKR-NEW"}</p>

      {/* DELIVERY STEPPER */}
      <div className="mt-12 space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-4 relative">
            <div
              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-sm 
              ${step.active ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-400"}`}
            >
              <step.icon size={18} />
            </div>

            {idx !== steps.length - 1 && <div className="absolute left-5 top-10 w-[2px] h-8 bg-zinc-100" />}

            <div className="text-left">
              <h4 className="text-sm font-black uppercase text-zinc-800 tracking-tight">{step.label}</h4>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">{step.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DELIVERY ADDRESS MINI CARD */}
      <div className="mt-10 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-zinc-400" />
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Delivery Estimate</span>
        </div>
        <p className="text-sm font-black text-zinc-800">{orderDetails?.DeliveryEstimate || "Expected in 7 Days"}</p>
        <div className="mt-2 flex flex-col gap-0.5">
          <p className="text-[11px] text-zinc-800 font-black uppercase tracking-tight">{orderDetails?.ShippingAddress?.Name}</p>
          <p className="text-[11px] text-zinc-500 font-bold leading-relaxed">{orderDetails?.ShippingAddress?.Details}</p>
        </div>
      </div>
      {/* REDIRECT NOTICE BOX */}
      <div className="mt-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 inline-flex flex-col items-center">
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2">Redirecting to home in</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-[#ff0080]">{countdown}s</span>
          <div className="h-4 w-[1px] bg-zinc-200" />
          <button onClick={() => navigate("/")} className="text-[10px] font-black uppercase text-zinc-900 flex items-center gap-1 hover:gap-2 transition-all">
            Go Now <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* MANUAL HOME BUTTON */}
      <div className="mt-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 mx-auto px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-zinc-800 transition-all shadow-lg"
        >
          <Home size={16} /> Back to Shopping
        </button>
      </div>
      <div>
        <p className="mt-6 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">A confirmation email has been sent to your registered ID.</p>
      </div>

    </div>
  );
};
