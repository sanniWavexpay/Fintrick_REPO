import { useEffect, useState } from "react";
import { CreditCard, QrCode, Banknote, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const PaymentMethods = ({ selected, onChange }) => {

  const methods = [
    // {
    //   id: "upi",
    //   name: "UPI",
    //   sub: "GPay, PhonePe, Paytm",
    //   icon: <QrCode size={24} />,
    //   gradient: "from-purple-600 to-pink-600",
    //   accent: "text-purple-600",
    // },
    // {
    //   id: "card",
    //   name: "Cards",
    //   sub: "Visa, Mastercard, AMEX",
    //   icon: <CreditCard size={24} />,
    //   gradient: "from-blue-600 to-indigo-600",
    //   accent: "text-blue-600",
    // },

    {
      id: "cod",
      name: "Cash",
      sub: "Pay at Doorstep",
      icon: <Banknote size={24} />,
      gradient: "from-emerald-500 to-teal-600",
      accent: "text-emerald-600",
    },
  ];

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">Payment Method</h2>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">Secure & Encrypted Transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((method) => {
          const isActive = selected === method.id;

          return (
            <label key={method.id} onClick={() => onChange(method.id)} className="group relative cursor-pointer">
              <input type="radio" name="payment" className="peer hidden" checked={isActive} readOnly />

              <div
                className={`
                  relative overflow-hidden h-full p-5 rounded-2xl border-2 transition-all duration-300
                  ${
                    isActive
                      ? "border-success bg-success/10  shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] scale-[1.02]"
                      : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-300 hover:bg-white"
                  }
                `}
              >
                {/* Selection Indicator */}
                <div
                  className={`
                  absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${isActive ? "border-success bg-success" : "border-zinc-300 bg-transparent"}
                `}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                {/* Icon Box */}
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500
                  bg-gradient-to-br ${method.gradient} text-white shadow-lg
                  group-hover:rotate-6
                `}
                >
                  {method.icon}
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h3 className={`font-black text-sm uppercase tracking-wider transition-colors ${isActive ? "text-zinc-900" : "text-zinc-500"}`}>{method.name}</h3>
                  <p className="text-[11px] font-bold text-zinc-400 leading-tight">{method.sub}</p>
                </div>

                {/* Active Underline Decoration */}
                {isActive && <motion.div layoutId="activeGlow" className="absolute bottom-0 left-0 right-0 h-1 bg-success" />}
              </div>
            </label>
          );
        })}
      </div>

      {/* Helper Info */}
      <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <p className="text-[11px] font-medium text-blue-700">
          Selected: <span className="font-black uppercase">{selected}</span> — No extra convenience fees applied.
        </p>
      </div>
    </div>
  );
};
