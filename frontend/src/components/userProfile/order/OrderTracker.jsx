import { motion } from "framer-motion";
import { Check, Package, Truck, Home, MapPin, Settings, XCircle, RefreshCcw } from "lucide-react";
import { format } from "date-fns";

export const OrderTracking = ({ selectedOrder }) => {
  if (!selectedOrder) return null;
  console.log("Selected Order in Tracker:", selectedOrder);

  const orderDate = new Date(selectedOrder.CreatedDtTm);
  const status = Number(selectedOrder.OrderStatus);

  // Local helper to avoid date-fns conflict
  const addDaysToDate = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const safeStepDate = (expectedDays, isStepCompleted) => {
    const expectedDate = addDaysToDate(orderDate, expectedDays);
    if (isStepCompleted && selectedOrder.UpdatedDtTm) {
      const updatedDate = new Date(selectedOrder.UpdatedDtTm);
      if (expectedDate > updatedDate) {
        return format(updatedDate, "dd MMM");
      }
    }
    return format(expectedDate, "dd MMM");
  };

  // --- Status Classification ---
  const isCancelled = status === 12;
  const isRefunded = status === 13;
  const isTerminated = isCancelled || isRefunded;
  const isDelivered = status === 11;
  const isShipped = status === 10;
  const isConfirmed = status === 9;
  const isPending = status === 8;

  // Partial states (Adjust these based on your backend codes)
  const isPartial = status === 58 || status === 61 || status === 62;

  // --- Badge logic ---
  const getBadgeText = () => {
    if (isCancelled) return "Order Cancelled";
    if (isRefunded) return "Order Returned";
    if (isDelivered) return "Fully Delivered";
    if (isPartial) return "Partially Delivered";
    if (isShipped) return "In Transit";
    if (isConfirmed) return "Order Confirmed";
    return "Awaiting Confirmation";
  };

  const getBadgeClass = () => {
    if (isCancelled || isRefunded) return "bg-rose-50 text-rose-600";
    if (isDelivered) return "bg-emerald-50 text-emerald-600";
    if (isPartial) return "bg-orange-50 text-orange-600";
    return "bg-blue-50 text-blue-600 animate-pulse";
  };

  // --- Dynamic Steps Logic ---
  const getSteps = () => {
    const baseSteps = [
      {
        id: 1,
        label: "Order Placed",
        date: format(orderDate, "dd MMM, yyyy"),
        time: format(orderDate, "hh:mm a"),
        icon: <Package size={18} />,
        status: "completed",
        desc: "We have received your order."
      }
    ];

    if (isCancelled) {
      // Step 2: Cancellation Milestone
      baseSteps.push({
        id: 2,
        label: "Order Cancelled",
        date: safeStepDate(1, true),
        time: "Cancelled",
        icon: <XCircle size={18} />,
        status: "failed",
        desc: "The order was cancelled."
      });

      // Special Logic for UPI/Paid Orders: Add Refund Stage
      const isPaid = (selectedOrder.PaymentStatus == 15 || selectedOrder.PaymentStatus == 17 || selectedOrder.PaymentStatus == 53 || selectedOrder.PaymentStatus == 55 || selectedOrder.PaymentStatus == 61);
      const isCOD = selectedOrder.items?.[0]?.PaymentMode == 49; // Simplified check from available data

      if (isPaid && !isCOD) {
          const isRefundSettled = (selectedOrder.PaymentStatus == 17 || selectedOrder.PaymentStatus == 53);
          baseSteps.push({
            id: 3,
            label: isRefundSettled ? "Refunded" : "Refund Processing",
            date: safeStepDate(1, isRefundSettled),
            time: isRefundSettled ? "Settled" : "Initiated",
            icon: <RefreshCcw size={18} />,
            status: isRefundSettled ? "completed" : "active",
            desc: isRefundSettled ? "Payment has been returned to source." : "Your refund is being processed by the bank."
          });
      }
      
      return baseSteps;
    }

    // Standard Flow for Active or Returned Orders
    const normalSteps = [
      ...baseSteps,
      {
        id: 2,
        label: "Processing",
        date: (status >= 9 || isRefunded) ? safeStepDate(1, true) : "Pending",
        time: (status >= 9 || isRefunded) ? "Confirmed" : "In Queue",
        icon: <Settings size={18} />,
        status: (status >= 9 || isRefunded) ? "completed" : (status === 8 ? "active" : "pending"),
        desc: (status >= 9 || isRefunded) ? "Order confirmed by seller." : "Awaiting seller confirmation."
      },
      {
        id: 3,
        label: "On The Way",
        date: (status >= 10 || isRefunded) ? safeStepDate(2, true) : "Expected " + format(addDaysToDate(orderDate, 2), "dd MMM"),
        time: (status >= 10 || isRefunded) ? "Shipped" : "Upcoming",
        icon: <Truck size={18} />,
        status: (isDelivered || isPartial || isRefunded) ? "completed" : (status === 10 ? "active" : "pending"),
        desc: (status >= 10 || isRefunded) ? "Package is on its way." : "Will be shipped soon."
      },
      {
        id: 4,
        label: isPartial ? "Partially Delivered" : "Delivered",
        date: (isDelivered || isRefunded) ? format(new Date(selectedOrder.UpdatedDtTm || addDaysToDate(orderDate, 7)), "dd MMM") : "Expected " + format(addDaysToDate(orderDate, 7), "dd MMM"),
        time: (isDelivered || isRefunded) ? "Received" : isPartial ? "Partial Success" : "By 08:00 PM",
        icon: isPartial ? <RefreshCcw size={18} /> : <Home size={18} />,
        status: (isDelivered || isRefunded) ? "completed" : (isPartial ? "active" : "pending"),
        desc: (isDelivered || isRefunded) ? "Your order has been delivered." : (isPartial ? "Some items delivered.." : "Deliveries usually take 7 days.")
      }
    ];

    if (isRefunded) {
      // Append Return Milestones after successful delivery flow
      normalSteps.push({
        id: 5,
        label: "Order Returned",
        date: safeStepDate(1, true),
        time: "Returned",
        icon: <XCircle size={18} />,
        status: "completed",
        desc: "The order was returned."
      });
      normalSteps.push({
        id: 6,
        label: "Refunded",
        date: safeStepDate(1, true),
        time: "Settled",
        icon: <RefreshCcw size={18} />,
        status: "completed",
        desc: "Payment has been refunded to source."
      });
    }

    return normalSteps;
  };

  const steps = getSteps();

  return (
    <div className="bg-white rounded-[30px] md:rounded-[35px] p-5 md:p-8 border border-slate-100 shadow-sm mt-4 md:mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-8 md:mb-10">
        <div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Status</p>
          <h3 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter">#{selectedOrder.OrderNo}</h3>
        </div>
        <div className={`self-start sm:self-auto px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${getBadgeClass()}`}>
          {getBadgeText()}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[20px] md:left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />

        <div className="space-y-8 md:space-y-10 relative">
          {steps.map((step, index) => {
            const isActive = step.status === "active";
            const isCompleted = step.status === "completed";
            const isFailed = step.status === "failed";

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-start gap-4 md:gap-6"
              >
                <div
                  className={`
                    relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500
                    ${isFailed
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-100"
                      : isCompleted
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                        : isActive
                          ? "bg-purple-600 text-white shadow-xl shadow-purple-100 scale-105"
                          : "bg-slate-50 text-slate-300 border border-slate-100"
                    }
                  `}
                >
                  <div className="scale-90 md:scale-100">{step.icon}</div>
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md border border-slate-50">
                      <Check size={10} className="text-emerald-500" strokeWidth={5} />
                    </div>
                  )}
                  {isActive && <span className="absolute inset-0 rounded-[14px] md:rounded-2xl bg-purple-600 animate-ping opacity-25" />}
                  {isFailed && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md border border-slate-50">
                      <XCircle size={10} className="text-rose-600" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`font-black uppercase tracking-tight text-[11px] md:text-sm truncate ${isFailed ? "text-rose-600" : isActive ? "text-purple-600" : "text-slate-800"}`}>
                      {step.label}
                    </h4>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter md:tracking-widest">{isFailed ? (isRefunded ? "Returned" : "Cancelled") : step.date}</p>
                      <p className={`text-[8px] font-bold uppercase mt-0.5 ${isFailed ? "text-rose-400" : isActive ? "text-purple-500" : "text-slate-300"}`}>{step.time}</p>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed mt-1">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 md:mt-10 p-4 md:p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-500 shrink-0">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</p>
            <p className="text-[10px] font-bold text-slate-800 truncate">
              {selectedOrder.City || "Warehouse"}, {selectedOrder.State || "IN"}
            </p>
          </div>
        </div>
        <div className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${isTerminated ? "bg-rose-50 text-rose-600" : isDelivered ? "bg-emerald-50 text-emerald-600" : isPartial ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"}`}>
          {isTerminated ? (isRefunded ? "Returned" : "Cancelled") : isDelivered ? "Delivered" : isPartial ? "Partial" : "In Progress"}
        </div>
      </div>
    </div>
  );
};
