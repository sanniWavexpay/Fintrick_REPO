/**
 * Utility functions for Order processing, price calculations and status mappings.
 * Standardizes logic between OrderList and OrderDetailView.
 */

export const ORDER_STATUS_MAP = {
  8: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  9: { label: "Confirmed", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  10: { label: "Shipped", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  11: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  12: { label: "Cancelled", color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200" },
  13: { label: "Returned", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  62: { label: "Partial Return", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
};

export const PAYMENT_STATUS_CONFIG = {
  14: { label: "Payment Pending", color: "text-amber-500", bg: "bg-amber-50" },
  51: { label: "Refund Pending", color: "text-amber-500", bg: "bg-amber-50" },
  52: { label: "Paid Success", color: "text-emerald-500", bg: "bg-emerald-50" },
  53: { label: "Refunded", color: "text-emerald-600", bg: "bg-emerald-50" },
  55: { label: "Refund Initiated", color: "text-sky-500", bg: "bg-sky-50" },
  54: { label: "Partial Paid", color: "text-indigo-500", bg: "bg-indigo-50" },
  61: { label: "Partial Refund", color: "text-amber-600", bg: "bg-amber-50" },
  59: { label: "User Cancelled", color: "text-rose-500", bg: "bg-rose-50" },
  28: { label: "Failed / Cancelled", color: "text-rose-500", bg: "bg-rose-50" },
  44: { label: "Refund Initiated", color: "text-sky-500", bg: "bg-sky-50" },
  45: { label: "Refund Initiated", color: "text-sky-500", bg: "bg-sky-50" },
  46: { label: "Refund Initiated", color: "text-sky-500", bg: "bg-sky-50" },
  56: { label: "Refund Success", color: "text-emerald-500", bg: "bg-emerald-50" },
};

/**
 * Calculates all metrics for an order.
 * Returning an object with all derived states.
 */
export const calculateOrderMetrics = (order) => {
  if (!order) return null;

  const items = order.items || [];
  const orderStatus = Number(order.OrderStatus);

  // Payment Status Resolution
  const paymentDetailStatus = Number(order.payment_detail_status || order.payment_detail_status_id);
  const isPaid = [15, 17, 52, 53, 55, 61, 23].includes(Number(order.PaymentStatus)) ||
    [15, 17, 52, 53, 55, 61, 23].includes(paymentDetailStatus);

  const isCOD = [49, '49'].includes(order.payment_mode);
  const isCancelled = orderStatus === 12;
  const isOrderRefunded = orderStatus === 13;
  const isTerminated = isCancelled || isOrderRefunded;

  // 1. Active Items (Not terminated or refunded)
  const activeItems = items.filter(item => {
    const isItemTerminated = item.ItemStatus === 22 || item.ItemStatus === 51 || item.ItemStatus === 23 || item.is_partially_cancelled == 1;
    const isItemRefunded = item.return_status_id === 56 || item.return_status_id === 62 || item.refund_status_id === 56;
    return !isItemTerminated && !isItemRefunded;
  });

  const activeItemsCount = activeItems.length;
  const totalItemsCount = items.length;
  const isOrderFullyTerminated = activeItemsCount === 0 && totalItemsCount > 0;
  const hasPartials = totalItemsCount !== activeItemsCount && totalItemsCount > 0;

  // 2. Price Details
  const originalTotal = Number(order.GrandTotalAmount || 0);
  const shippingFee = Number(order.ShippingFee || 0);
  const platformFee = Number(order.PlatformFee || 0);
  const totalTax = Number(order.TotalTax || 0);
  const totalMRP = Number(order.TotalMRP || 0);
  const totalDiscount = Number(order.TotalDiscount || 0);

  // High-Trust Source: Use backend calculated values
  let backendNetSettlement = isOrderFullyTerminated ? 0 : originalTotal;

  if (order.payment) {
    if (isCOD) {
      backendNetSettlement = Number(order.payment.PendingAmount);
    } else {
      backendNetSettlement = originalTotal - Number(order.payment.CancelledAmount || 0);
    }
  }

  const calcNetSettlement = backendNetSettlement;
  const adjustedTotal = calcNetSettlement; // Map for backward compatibility

  // 3. Status Info
  const statusConfig = ORDER_STATUS_MAP[orderStatus] || { label: "Processing", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100" };

  let pStatus = PAYMENT_STATUS_CONFIG[paymentDetailStatus] || { label: "Unknown", color: "text-slate-400", bg: "bg-slate-50" };

  // COD/Cancelled edge cases
  if (isCOD && [14, 51].includes(paymentDetailStatus)) {
    pStatus = {
      ...pStatus,
      label: isCancelled ? "Not Paid" : "Payment Pending"
    };
  }

  return {
    isPaid,
    isCOD,
    isCancelled,
    isOrderRefunded,
    isTerminated,
    activeItems,
    activeItemsCount,
    totalItemsCount,
    isOrderFullyTerminated,
    hasPartials,
    originalTotal,
    adjustedTotal,
    calcNetSettlement,
    shippingFee,
    platformFee,
    totalTax,
    totalMRP,
    totalDiscount,
    status: {
      ...statusConfig,
      label: (orderStatus === 13) ? statusConfig.label : (order.order_status_text || statusConfig.label)
    },
    payment: {
      ...pStatus,
      label: pStatus.label || order.payment_status_text || "Unknown"
    }
  };
};


