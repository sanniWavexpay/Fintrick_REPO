import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { calculateOrderMetrics } from "../../../utils/orderUtils";
import { getImageUrl } from "../../../utils/image";

export default function OrderCard({ order, onClick }) {
  const metrics = calculateOrderMetrics(order);
  const firstItem = order.items?.[0];

  if (!metrics) return null;

  const {
    status,
    originalTotal,
    adjustedTotal,
    isOrderFullyTerminated,
    hasPartials,
    isCancelled,
    isOrderRefunded,
    totalItemsCount,
  } = metrics;



  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onClick(order)}
      className="bg-white border border-slate-100 p-3 md:p-4 rounded-3xl flex items-center gap-3 md:gap-4 cursor-pointer transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 group hover:border-indigo-100"
    >
      {/* Product Image */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-2xl border border-slate-100 p-1.5 md:p-2 overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <img
            src={getImageUrl(firstItem?.variant_image)}
            alt={firstItem?.ProductTitle}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
        {totalItemsCount > 1 && (
          <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-lg border-2 border-white">
            +{totalItemsCount - 1}
          </div>
        )}
      </div>

      {/* Info Section — flex-1 with min-w-0 so it respects truncate */}
      <div className="flex-1 min-w-0">
        {/* Status Badge + OrderNo — shrink-0 on badge so it never wraps */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {isOrderFullyTerminated ? (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-lg uppercase bg-rose-50 text-rose-500 border border-rose-100 shrink-0 whitespace-nowrap">
              {isCancelled ? "Cancelled" : "Returned"}
            </span>
          ) : (
            <span
              className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase shrink-0 whitespace-nowrap ${status.bg} ${status.color} border ${status.border}`}
            >
              {status.label}
            </span>
          )}
          <span className="text-[9px] text-slate-300 font-bold tracking-tight uppercase truncate">
            #{order.OrderNo}
          </span>
        </div>

        <h4 className="text-[13px] font-black text-slate-800 truncate mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
          {firstItem?.ProductTitle}
        </h4>

        <div className="flex items-center gap-1 text-slate-400">
          <Calendar size={11} className="shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-tight">
            {new Date(order.CreatedDtTm).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Price Section — fixed width on mobile (w-[76px]) prevents squeeze */}
      <div className="text-right flex flex-col items-end gap-1 shrink-0 w-[76px] md:w-auto">
        {isCancelled || isOrderFullyTerminated || isOrderRefunded ? (
          <>
            <p className="text-[13px] md:text-[15px] font-black text-slate-300 line-through italic tracking-tighter decoration-slate-200">
              ₹{Math.round(originalTotal).toLocaleString()}
            </p>
            <p
              className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-lg tracking-wider border whitespace-nowrap ${
                isOrderRefunded
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-rose-50 text-rose-500 border-rose-100"
              }`}
            >
              {isOrderRefunded ? "Returned" : "Cancelled"}
            </p>
          </>
        ) : hasPartials ? (
          <>
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 italic mb-[-2px]">
                ₹{Math.round(originalTotal).toLocaleString()}
              </p>
              <p className="text-[15px] md:text-[18px] font-black italic tracking-tighter text-emerald-600 drop-shadow-sm">
                ₹{adjustedTotal.toLocaleString()}
              </p>
            </div>
            <p className="text-[7px] font-black uppercase tracking-widest leading-none px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
              Adjusted
            </p>
          </>
        ) : (
          <>
            <p className="text-[15px] md:text-[18px] font-black text-slate-900 italic tracking-tighter group-hover:scale-110 transition-transform origin-right">
              ₹{Math.round(originalTotal).toLocaleString()}
            </p>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tight opacity-70">
              (Inc. Tax)
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
