import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  MapPinned,
  ReceiptText,
  ShieldCheck,
  Banknote,
  CreditCard,
  User,
  Phone,
  MapPin,
  Package,
  CheckCircle2,
  Info,
  RefreshCcw,
  AlertCircle,
  Truck,
  XCircle,
  ChevronDown,
  Wallet,
  Banknote as Bank,
  ArrowRight,
  Clock,
  PackageX,
  Package2,
  PackageCheck,
} from "lucide-react";
import { generateInvoice } from "../../../utils/generateInvoice";
import { OrderTracking } from "./OrderTracker";
import { getImageUrl } from "../../../utils/image";
import { useOrderActions } from "../../../features/order/useOrderActions";
import ReturnModal from "./ReturnModal";
import { calculateOrderMetrics, ORDER_STATUS_MAP, PAYMENT_STATUS_CONFIG } from "../../../utils/orderUtils";
import { siteConfig } from "../../../config/siteConfig";

// --- Helpers ---
const HorizontalRefundTracker = ({ item, orderItems, isOrderFullyTerminated, orderLevelRefundable }) => {
  const method = item.refund_method?.toLowerCase() || '';
  const isUPI = method === 'upi';
  const isBank = method === 'bank_transfer' || method === 'bank';

  let destination = "Refund Account";
  let detailLabel = "Destination";
  let ownerName = item.account_holder_name || "";

  if (isUPI) {
    destination = item.refund_upi_id || "UPI Portal";
    detailLabel = "UPI ID";
  } else if (isBank) {
    destination = `A/C (...${item.refund_account_no?.slice(-4) || '****'})`;
    detailLabel = "Bank Account";
  }

  // Amount: Strictly trust the backend's exact per-item refund_amount.
  // No proportional redistribution — database is source of truth.
  const amount = Math.round(Number(item.refund_amount || item.TotalAmount || 0));

  const processedAt = item.refund_processed_at
    ? new Date(item.refund_processed_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'Processing';

  return (
    <div className="py-8 px-6 bg-emerald-50/20 rounded-[32px] border border-emerald-100/50 backdrop-blur-sm relative overflow-hidden group mt-2">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/10 rounded-full blur-2xl -ml-12 -mb-12"></div>

      <div className="flex flex-col items-center relative z-10">
        <div className="flex items-center justify-between w-full max-w-sm relative mb-8 px-2">
          {/* Source */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 mb-2">
              <Wallet size={24} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{siteConfig.name}</span>
          </div>

          {/* Animated Flow */}
          <div className="flex-1 h-[2px] bg-slate-100 mx-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-emerald-400 to-emerald-200 opacity-50"></div>
            <motion.div
              initial={{ left: "-10%" }}
              animate={{ left: "105%" }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 blur-md rounded-full opacity-60"></div>
                <div className="w-7 h-7 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg relative z-10">
                  <Bank size={14} className="animate-bounce" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Destination */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-200/50 flex items-center justify-center text-white mb-2 relative transform group-hover:scale-105 transition-transform duration-500">
              {isUPI ? <RefreshCcw size={32} /> : <Bank size={32} />}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-emerald-50">
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Settled</span>
          </div>
        </div>

        {/* Details Card */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-black text-slate-800 mb-1 tracking-tight"
          >
            ₹{amount}
          </motion.div>
          <div className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Refund Successful</div>

          <div className="w-full pt-4 border-t border-slate-50 flex flex-col items-start gap-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                <ArrowRight size={14} />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{detailLabel}</span>
                <span className="text-[11px] font-black text-slate-700 uppercase">{destination}</span>
                {ownerName && <span className="text-[8px] font-bold text-indigo-400 uppercase mt-0.5">{ownerName}</span>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                <Clock size={14} />
              </div>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">At Time</span>
                <span className="text-[11px] font-bold text-slate-500 italic uppercase">{processedAt}</span>
              </div>
            </div>

            {item.refund_txn_id && (
              <div className="flex items-center gap-3 pt-3 border-t border-slate-50 w-full">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                  <ReceiptText size={14} />
                </div>
                <div className="flex flex-col items-start leading-tight min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reference ID</span>
                  <span className="text-[11px] font-black text-indigo-600 uppercase truncate font-mono">{item.refund_txn_id}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Removed local getOrderStatus and getPaymentStatus as they are now in orderUtils.js

export default function OrderDetailView({ selectedOrder, setSelectedOrder }) {
  const [showTracking, setShowTracking] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmingItemId, setConfirmingItemId] = useState(null);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState(null);
  const [cancellingItemId, setCancellingItemId] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [cancelModalType, setCancelModalType] = useState(null); // 'FULL' or 'ITEM'
  const { cancelOrder, cancelItem, isCancelling, isItemCancelling } = useOrderActions(setSelectedOrder);

  console.log("selectedOrder", selectedOrder);

  // High Precision Metrics from Centralized Utility
  const metrics = calculateOrderMetrics(selectedOrder);
  const {
    status: statusInfo,
    payment: paymentInfo,
    isPaid,
    isCancelled,
    isOrderRefunded,
    isTerminated,
    isCOD,
    activeItems,
    isOrderFullyTerminated,
    hasPartials,
    calcNetSettlement,
    originalTotal: originalGrandTotal,
    shippingFee,
    platformFee,
    totalTax: calcTotalTax,
    totalMRP: calcTotalMRP,
    totalDiscount: calcTotalDiscount
  } = metrics;

  const orderStatus = selectedOrder.OrderStatus;
  const isPaymentPending = !isPaid && !isCOD;
  const canCancelOrder = orderStatus <= 9 && !isPaymentPending;
  const canReturnItem = (item) => {
    const returnableStatuses = [11, 58, 61, 62, 66];
    return (
      returnableStatuses.includes(orderStatus) &&
      item.ItemStatus === 21 && // Delivered item status
      !item.return_status_id // Ensure return hasn't initiated already
    );
  };
  const anyItemReturnable = selectedOrder.items.some(item => canReturnItem(item));

  // Return Window Expiry Logic (7 Days)
  const getReturnExpiry = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };
  const returnExpiry = getReturnExpiry(selectedOrder.UpdatedDtTm);

  // Use 'invoiceItems' for the breakdown (MRP, Discount, etc.) 
  const invoiceItems = (isTerminated || hasPartials) ? selectedOrder.items : activeItems;

  const originalCouponDiscount = Number(selectedOrder.CouponCode ? (selectedOrder.CouponDiscount || 0) : 0);

  // --- Derived Calculations for Breakdown (Stable UI) ---
  // We prioritize DB snapshots (TotalTax, TotalMRP) over summing items to prevent UI jumping.
  const dbMRP = Number(selectedOrder.TotalMRP || 0);
  const dbDiscount = Number(selectedOrder.TotalDiscount || 0);
  const dbTax = Number(selectedOrder.TotalTax || 0);

  // Base Product Subtotal (MRP - Item Discount). Note: Coupon is a separate order-level item.
  const calcProductSubtotal = (dbMRP > 0) ? (dbMRP - dbDiscount) : (invoiceItems.reduce((acc, item) => acc + (Number(item.SellPrice) * Number(item.Quantity)), 0));

  const breakdownTotalTax = dbTax > 0 ? dbTax : invoiceItems.reduce((acc, item) => acc + Number(item.Gst || 0), 0);
  const baseCalcTotalMRP = dbMRP > 0 ? dbMRP : invoiceItems.reduce((acc, item) => acc + (Number(item.UnitPrice || 0) * Number(item.Quantity || 0)), 0);
  const baseCalcTotalDiscount = dbDiscount > 0 ? dbDiscount : (baseCalcTotalMRP - calcProductSubtotal);



  // Final Payable Settlement (Already calculated in metrics)

  // Legend Settings
  const totalDeductions = originalGrandTotal - calcNetSettlement;

  // --- Back-end Directed Financial Metrics (Source of Truth) ---
  const payment = selectedOrder.payment || {};
  const cancelledAdjustmentAmount = Number(payment.CancelledAmount || 0);

  const settledRefundAmount = Number(payment.RefundAmount || 0);

  // For 'Processing' items, we still briefly sum items with active return/refund states 
  // that haven't been settled into RefundAmount yet.
  let processingRefundAmount = selectedOrder.items.reduce((acc, item) => {
    const status = Number(item.refund_status_id || item.return_status_id || 0);
    const itemIsInitiated = [55, 44, 45, 46, 51].includes(status);
    const itemIsSettled = [53, 56, 23].includes(Number(item.ItemStatus)) || [56].includes(status);

    if (itemIsInitiated && !itemIsSettled) {
      return acc + Number(item.refund_amount || item.TotalAmount || 0);
    }
    return acc;
  }, 0);

  // Exact mathematical tracing for fully terminated Paid orders (Online Payment Only)
  // For COD, 'CancelledAmount' represents unpaid value, not refundable value, so we skip this.
  if (isOrderFullyTerminated && isPaid && !isCOD) {
    processingRefundAmount = Math.max(0, cancelledAdjustmentAmount - settledRefundAmount);
  }

  // Total Refund Value = What's already back + what's coming back
  const totalRefundValue = settledRefundAmount + processingRefundAmount;

  const hasPhysicalRefunds = totalRefundValue > 0;
  const hasDeductions = settledRefundAmount > 0 || processingRefundAmount > 0 || cancelledAdjustmentAmount > 0 || isCancelled || isOrderFullyTerminated;

  // Strict check: Only fully refunded if money is actually settled and nothing is pending
  const isFullyRefunded = isTerminated && settledRefundAmount > 0 && processingRefundAmount === 0;
  const isRefundInProcess = processingRefundAmount > 0;
  const isPartialRefund = hasPhysicalRefunds && !isFullyRefunded;

  const canDownloadInvoice = isPaid && (orderStatus === 11 || orderStatus === 58 || orderStatus === 61 || orderStatus === 62) && !isFullyRefunded;

  console.log(selectedOrder);

  const handleAction = async (type) => {
    if (type === "CANCEL") {
      if (isPaid) {
        setCancelModalType("FULL");
        setSelectedItemForReturn(null);
        setReturnModalOpen(true);
      } else {
        await cancelOrder(selectedOrder.ID);
      }
      setIsConfirming(false);
    }
  };

  const handleItemCancel = async (item) => {
    if (isPaid) {
      setCancelModalType("ITEM");
      setSelectedItemForReturn(item);
      setReturnModalOpen(true);
    } else {
      setCancellingItemId(item.ID);
      try {
        await cancelItem(item.ID);
        setConfirmingItemId(null);
      } catch (error) {
        console.error("Cancel failed", error);
      } finally {
        setCancellingItemId(null);
      }
    }
  };

  if (isItemCancelling || isCancelling) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase italic">Order Details</h1>
        <button onClick={() => setSelectedOrder(null)} className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK
        </button>
      </div>

      {/* TOP ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3 items-start">
        <div className="flex flex-col gap-2">
          <button
            disabled={!canDownloadInvoice}
            onClick={() => generateInvoice(selectedOrder)}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${canDownloadInvoice
              ? "bg-white border border-slate-900 text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white"
              : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-50"
              }`}
          >
            <Download size={14} />
            <span>Invoice</span>
          </button>
          {!canDownloadInvoice && !isTerminated && (
            <p className="text-[8px] leading-[1.2] text-slate-400 text-center uppercase font-bold px-1">Available after delivery & payment</p>
          )}
        </div>

        <button
          onClick={() => setShowTracking(!showTracking)}
          className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${showTracking ? "bg-indigo-600 text-white" : "bg-slate-900 text-white shadow-slate-200"
            }`}
        >
          {showTracking ? <ArrowLeft size={14} /> : <MapPinned size={14} />}
          <span>{showTracking ? "Back" : "Track"}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showTracking ? (
          <motion.div key="tracking" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <OrderTracking selectedOrder={selectedOrder} />
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
            {/* 1. STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shipment Status Card: Always showing CANCELLED for terminated orders */}
              <div className="bg-white/40 backdrop-blur-md rounded-[28px] p-6 border border-white/40 shadow-sm flex items-center gap-5 group hover:bg-white/60 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isTerminated ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-500'}`}>
                  {isTerminated ? <PackageX size={24} /> : (isPaid ? <PackageCheck size={24} /> : <Package2 size={24} />)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Shipment Status</p>
                  <h3 className={`text-sm font-black uppercase tracking-wider ${isTerminated ? 'text-slate-600' : 'text-slate-800'}`}>
                    {statusInfo.label}
                  </h3>
                </div>
              </div>

              {/* Method / Refund Card: Showing REFUND PENDING for paid orders */}
              <div className="bg-white/40 backdrop-blur-md rounded-[28px] p-6 border border-white/40 shadow-sm flex items-center gap-5 group hover:bg-white/60 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isPaid ? 'bg-sky-50 text-sky-500' : 'bg-amber-50 text-amber-500'}`}>
                  {isPaid ? <CreditCard size={24} /> : <Banknote size={24} />}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Method: {isCOD ? "COD" : "ONLINE"}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isPaid ? (isFullyRefunded ? 'bg-emerald-400' : 'bg-sky-400') : 'bg-amber-400'}`}></div>
                    <h3 className={`text-sm font-black uppercase tracking-wider ${isPaid ? (isFullyRefunded ? 'text-emerald-600' : 'text-sky-600') : 'text-amber-600'}`}>
                      {(isTerminated && isPaid) ? (isFullyRefunded ? "REFUNDED" : "REFUND PENDING") : paymentInfo.label}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* 1.5 POLICY & SERVICE CENTER */}
            {anyItemReturnable && (
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-[32px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest italic">Service & Policy Center</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">7 Days Easy Returns • Guaranteed Fulfillment</p>
                  </div>
                </div>
                <div className="bg-white/80 px-4 py-2 rounded-xl border border-indigo-100 text-center sm:text-right">
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Return Window Eligible Until</p>
                  <p className="text-[11px] font-black text-slate-900 italic">{returnExpiry || "7 Days after delivery"}</p>
                </div>
              </div>
            )}

            {/* 2. PACKAGE CONTENTS (ITEM WISE ACTIONS) */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ReceiptText size={16} className="text-indigo-500" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Package Contents</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">#{selectedOrder.OrderNo}</span>
              </div>

              <div className="divide-y divide-slate-50">
                {selectedOrder.items.map((item) => (
                  <>
                    <div key={item.ID} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-all group">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-white rounded-xl border border-slate-100 p-1.5 shadow-sm shrink-0">
                          <img src={getImageUrl(item.variant_image)} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-black text-slate-800 truncate leading-tight">{item.ProductTitle}</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">{item.variant_name || "Standard"}</p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] md:text-[15px] font-[1000] text-slate-900 tracking-tighter">₹{Math.round(item.SellPrice).toLocaleString()}</span>
                              {item.UnitPrice > item.SellPrice && (
                                <span className="text-[10px] md:text-[11px] text-slate-400 line-through font-bold decoration-slate-300">₹{Math.round(item.UnitPrice)}</span>
                              )}
                            </div>

                            {item.Discount > 0 && (
                              <span className="text-[10px] md:text-[11px] font-black text-green-600 uppercase tracking-tighter">
                                ({Math.round(item.Discount)}% Off)
                              </span>
                            )}

                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg ml-auto md:ml-0">
                              <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Qty</span>
                              <span className="text-[11px] font-black text-slate-800 leading-none">{item.Quantity}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2.5">
                            {canCancelOrder && (item.ItemStatus == 18 || item.ItemStatus == 19) && (
                              <div className="flex items-center gap-2">
                                {confirmingItemId === item.ID ? (
                                  <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                                    <button
                                      disabled={isItemCancelling}
                                      onClick={() => handleItemCancel(item)}
                                      className="text-[9px] md:text-[10px] px-4 py-2 bg-rose-600 text-white font-black uppercase rounded-xl shadow-lg active:scale-95"
                                    >
                                      {isItemCancelling ? "..." : "Confirm"}
                                    </button>
                                    <button onClick={() => setConfirmingItemId(null)} className="text-[9px] md:text-[10px] px-3 py-2 text-slate-400 font-bold uppercase hover:text-slate-600">
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmingItemId(item.ID)}
                                    className="text-[9px] md:text-[10px] px-4 py-2 bg-rose-50 border border-rose-100 text-rose-500 font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
                                  >
                                    Cancel Item
                                  </button>
                                )}
                              </div>
                            )}

                            {canReturnItem(item) && (
                              <button
                                onClick={() => {
                                  setSelectedItemForReturn(item);
                                  setReturnModalOpen(true);
                                }}
                                className="text-[9px] md:text-[10px] px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-500 font-black uppercase rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                              >
                                Return Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-y-3 mt-4 pt-3 border-t border-slate-50">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.return_status_id != null && (
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-sm backdrop-blur-md transition-all ${{
                              44: "border-amber-200 bg-amber-50/80 text-amber-700",
                              45: "border-blue-200 bg-blue-50/80 text-blue-700",
                              46: "border-rose-200 bg-rose-50/80 text-rose-700",
                              47: "border-indigo-200 bg-indigo-50/80 text-indigo-700",
                              48: "border-slate-300 bg-slate-100/80 text-slate-700",
                              55: "border-slate-300 bg-slate-200/80 text-slate-800",
                              56: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
                              57: "border-rose-300 bg-rose-100/80 text-rose-700"
                            }[item.return_status_id] || "border-indigo-200 bg-indigo-50/80 text-indigo-700"
                              }`}>
                              <span className="relative flex h-2 w-2">
                                {(item.return_status_id !== 56 && item.return_status_id !== 57) && (
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${{
                                    44: "bg-amber-400", 45: "bg-blue-400", 46: "bg-rose-400", 47: "bg-indigo-400"
                                  }[item.return_status_id] || "bg-slate-400"
                                    }`}></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${{
                                  44: "bg-amber-500", 45: "bg-blue-500", 46: "bg-rose-500", 47: "bg-indigo-500",
                                  48: "bg-slate-500", 55: "bg-slate-700", 56: "bg-emerald-500", 57: "bg-rose-600"
                                }[item.return_status_id] || "bg-indigo-500"
                                  }`}></span>
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-wider">
                                Return {item.return_status_text || "Processing"}
                              </span>
                            </div>
                          )}

                          {/* Unified Refund Success / Status Tag */}
                          {(item.refund_status_id === 56 || item.return_status_id === 56 || item.ItemStatus === 23) ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold shadow-sm backdrop-blur-md">
                              <CheckCircle2 size={10} />
                              <span className="text-[8px] uppercase tracking-wider">Refund Success</span>
                            </div>
                          ) : (
                            <>
                              {(item.ItemStatus === 22 || item.ItemStatus === 51) && (
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-sm backdrop-blur-md transition-all ${(isPaid && !isCOD) ? "border-sky-200 bg-sky-50 text-sky-700 font-black" : "border-slate-200 bg-slate-100 text-slate-400"}`}>
                                  {(isPaid && !isCOD) && <RefreshCcw size={10} className="animate-spin-slow" />}
                                  <span className="text-[8px] uppercase tracking-wider">{(isPaid && !isCOD) ? "Refund Pending" : "Item Cancelled"}</span>
                                </div>
                              )}
                            </>
                          )}
                          {orderStatus === 10 && <span className="text-[8px] font-bold text-amber-500 uppercase italic leading-none self-center bg-amber-50 px-2 py-1 rounded-md border border-amber-100">Shipped • No Cancel</span>}
                        </div>

                        {/* Unified Detail Toggle Button (Universal) */}
                        {(item.return_status_id != null || ((isPaid && !isCOD) && (item.ItemStatus === 22 || item.ItemStatus === 51 || item.ItemStatus === 23))) && (
                          <button
                            onClick={() => setExpandedItemId(expandedItemId === item.ID ? null : item.ID)}
                            className={`text-[10px] font-bold px-4 py-1.5 rounded-full transition-all flex items-center gap-2 group shadow-sm active:scale-95 ${item.refund_status_id === 56 || item.return_status_id === 56 || item.ItemStatus === 23 ? 'text-emerald-600 bg-white border border-emerald-100 hover:bg-emerald-600 hover:text-white' : 'text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                          >
                            {expandedItemId === item.ID ? (item.refund_status_id === 56 || item.return_status_id === 56 || item.ItemStatus === 23 ? 'Close Details' : 'Hide Progress') : 'View Details'}
                            <ChevronDown size={12} className={`transition-transform duration-300 ${expandedItemId === item.ID ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                      {(item.return_status_id != null || ((isPaid && !isCOD) && (item.ItemStatus === 22 || item.ItemStatus === 51)) || item.ItemStatus === 23) && expandedItemId === item.ID && (
                        <div className="animate-in zoom-in-95 fade-in duration-300">
                          <div className={`mt-2 text-left ml-0 sm:ml-[80px] p-4 sm:p-6 rounded-[24px] bg-white border ${item.refund_status_id === 56 || item.return_status_id === 56 ? 'border-emerald-100 shadow-emerald-100/50' : 'border-slate-100'} shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative mb-2 overflow-hidden group/timeline animate-in fade-in slide-in-from-top-4 duration-500`}>
                            <div className={`absolute -right-10 -top-10 w-40 h-40 ${item.refund_status_id === 56 || item.return_status_id === 56 ? 'bg-emerald-50' : 'bg-indigo-50'} rounded-full blur-3xl opacity-50 group-hover/timeline:opacity-100 transition-opacity duration-700`}></div>

                            <div className="flex items-center gap-2 mb-6 relative z-10 w-max">
                              <div className={`p-1.5 rounded-lg ${item.refund_status_id === 56 || item.return_status_id === 56 ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                <Package size={14} />
                              </div>
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800 shadow-slate-100/50 drop-shadow-sm">
                                {item.refund_status_id === 56 || item.return_status_id === 56 ? 'Refund Success' : ([22, 51].includes(Number(item.ItemStatus)) ? 'Refund Progress' : 'Return Progress')}
                              </h4>
                            </div>

                            {(item.refund_status_id === 56 || item.return_status_id === 56 || item.ItemStatus === 23) ? (
                              <HorizontalRefundTracker
                                item={item}
                                orderItems={selectedOrder.items}
                                isOrderFullyTerminated={isOrderFullyTerminated}
                                orderLevelRefundable={totalRefundValue}
                              />
                            ) : (
                              <div className="relative pl-8 pt-2">
                                <div className="absolute left-[3.5px] top-[4px] bottom-[8px] w-[2px] bg-gradient-to-b from-indigo-200 via-slate-100 to-transparent z-0"></div>
                                <div className="flex flex-col gap-6 relative z-10 w-full">
                                  {[22, 51, 23].includes(Number(item.ItemStatus)) ? (
                                    <>
                                      <div className="flex justify-between items-center text-[11px] w-full group/item opacity-100">
                                        <div className="flex items-center">
                                          <span className="w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm absolute left-[0px] bg-sky-400"></span>
                                          <span className="font-bold ml-4 text-slate-800">CANCELLATION CONFIRMED</span>
                                        </div>
                                        <span className="text-slate-500 text-[10px] font-bold ml-4">Done ✓</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[11px] w-full group/item opacity-100">
                                        <div className="flex items-center">
                                          <span className={`w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm absolute left-[0px] ${item.refund_status_id === 56 || item.ItemStatus === 23 ? 'bg-sky-400' : 'bg-sky-400 animate-pulse'}`}></span>
                                          <span className={`font-bold ml-4 text-slate-800 uppercase`}>Refund Initiated</span>
                                        </div>
                                        <span className="text-sky-500 uppercase tracking-widest text-[9px] bg-sky-50 px-2 py-0.5 rounded font-black animate-pulse ml-4">ACTIVE</span>
                                      </div>
                                      <div className="flex justify-between items-center text-[11px] w-full group/item opacity-40">
                                        <div className="flex items-center">
                                          <span className="w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm absolute left-[0px] bg-slate-200"></span>
                                          <span className="font-bold ml-4 text-slate-400">AMOUNT CREDITED</span>
                                        </div>
                                        <span className="text-slate-400 font-bold ml-4 tracking-tighter italic uppercase">Pending</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      <div className={`flex justify-between items-center text-[11px] w-full group/item ${item.return_status_id >= 44 ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className="flex items-center">
                                          <span className={`w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm absolute left-[0px] transition-transform duration-300 ${item.return_status_id >= 44 ? 'bg-indigo-400 group-hover/item:scale-125' : 'bg-slate-200'}`}></span>
                                          <span className={`font-bold ml-4 ${item.return_status_id >= 44 ? 'text-slate-800' : 'text-slate-400'}`}>Request Raised</span>
                                        </div>
                                        <span className="text-slate-400 font-bold ml-4 text-right truncate">
                                          {item.return_requested_at ? new Date(item.return_requested_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-- / --'}
                                        </span>
                                      </div>
                                      {item.return_status_id === 57 && (
                                        <div className="flex justify-between items-center text-[11px] w-full group/item opacity-100 mt-6">
                                          <div className="flex items-center">
                                            <span className="w-3.5 h-3.5 rounded-full ring-4 ring-rose-50 absolute left-[-2px] bg-rose-500"></span>
                                            <span className="font-black text-rose-600 ml-4">Request Rejected</span>
                                          </div>
                                          <span className="text-rose-500 font-black ml-4 text-[9px] uppercase tracking-wider">Rejected ✕</span>
                                        </div>
                                      )}
                                      {item.return_status_id !== 57 && (
                                        <div className={`flex justify-between items-center text-[11px] w-full group/item ${item.return_status_id >= 46 && item.return_status_id <= 56 ? 'opacity-100' : 'opacity-40'}`}>
                                          <div className="flex items-center">
                                            <span className={`w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm absolute left-[0px] transition-transform duration-300 ${item.return_status_id >= 46 && item.return_status_id <= 56 ? 'bg-indigo-500 group-hover/item:scale-125' : 'bg-slate-200'}`}></span>
                                            <span className={`font-bold ml-4 ${item.return_status_id >= 46 && item.return_status_id <= 56 ? 'text-slate-800' : 'text-slate-400'}`}>Return Picked Up</span>
                                          </div>
                                          <span className="text-slate-400 font-bold ml-4 text-right truncate uppercase">
                                            {item.return_status_id === 46 ? 'ACTIVE' : (item.return_status_id > 46 ? 'Done ✓' : '-- / --')}
                                          </span>
                                        </div>
                                      )}
                                      {item.return_status_id === 56 && (
                                        <div className="flex justify-between items-center text-[11px] w-full group/item opacity-100">
                                          <div className="flex items-center">
                                            <span className="w-3.5 h-3.5 rounded-full ring-4 ring-emerald-50 absolute left-[-2px] bg-emerald-500"></span>
                                            <span className="font-black text-emerald-600 ml-4">Refund Completed</span>
                                          </div>
                                          <span className="text-emerald-500 font-black ml-4">Done ✓</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div>

            {/* 3. ADDRESS & SETTLEMENT */}
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
              <div className="w-full md:w-[45%] bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Shipping To</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 font-black text-slate-900 text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600">
                      <User size={14} />
                    </div>
                    {selectedOrder.customer_name}
                  </div>
                  <div className="flex items-center gap-3 font-bold text-slate-500 text-xs">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-blue-500">
                      <Phone size={14} />
                    </div>
                    +91 {selectedOrder.customer_phone}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex gap-3">
                    <MapPin size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-relaxed">{selectedOrder.flat_address}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {selectedOrder.City}, {selectedOrder.State} - {selectedOrder.Pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SETTLEMENT CARD */}
              <div
                className={`flex-1 rounded-[32px] p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px] transition-colors duration-500 ${isTerminated ? "bg-slate-800 text-white" : isPaid ? "bg-slate-900 text-white" : isCOD ? "bg-indigo-600 text-white" : "bg-amber-600 text-white"}`}
              >
                <div className="flex justify-between items-start">
                  <h3
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isTerminated ? "text-slate-400" : isPaid ? "text-indigo-400" : "text-amber-200"}`}
                  >
                    <ReceiptText size={14} /> Order Summary
                  </h3>

                  {isCancelled ? (
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 border border-white/10">Cancelled</div>
                  ) : isFullyRefunded ? (
                    <div className="px-3 py-1 bg-rose-500/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-rose-300 border border-rose-500/30">Returned</div>
                  ) : isRefundInProcess ? (
                    <div className="px-3 py-1 bg-sky-500/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-sky-300 border border-sky-500/30">Refund Processing</div>
                  ) : isPartialRefund ? (
                    <div className="px-3 py-1 bg-indigo-500/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-300 border border-indigo-500/30">Partial Refund</div>
                  ) : (
                    <div className={`px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 ${isPaid ? "text-indigo-300" : (isCOD ? "text-amber-100" : "text-rose-200")}`}>
                      {isPaid ? (isCOD ? "Collected" : "Settled") : (isCOD ? "Cash on Delivery" : "Payment Pending")}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mt-8">
                  <div className="flex justify-between text-[11px] font-bold opacity-60 uppercase">
                    <span>Total MRP</span> <span>₹{Math.round(baseCalcTotalMRP).toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between text-[11px] font-bold uppercase ${baseCalcTotalDiscount > 0 ? "text-emerald-400" : "text-white"}`}>
                    <span>Discount</span> <span>-₹{Math.round(baseCalcTotalDiscount).toLocaleString()}</span>
                  </div>

                  {originalCouponDiscount > 0 && (
                    <div className="flex justify-between text-[11px] font-black uppercase text-emerald-400">
                      <span>Coupon Applied ({selectedOrder.CouponCode})</span>
                      <span>-₹{Math.round(originalCouponDiscount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-black uppercase text-indigo-300 border-y border-white/5 py-2 my-1">
                    <span>Product Subtotal</span> <span>₹{Math.round(calcProductSubtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold opacity-60 uppercase">
                    <span>Shipping Fee</span> <span>₹{Math.round(shippingFee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold opacity-60 uppercase">
                    <span>Handling Fee</span> <span>₹{Math.round(platformFee).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold opacity-60 uppercase">
                    <div className="flex flex-col">
                      <span>GST Price</span>
                      <span className="text-[8px] opacity-70">(18% Inclusive)</span>
                    </div>
                    <span>₹{Math.round(breakdownTotalTax).toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] my-4 bg-white/10" />

                  {hasDeductions && (
                    <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {/* Group items by their status label to avoid duplicate rows */}
                      {(() => {
                        const groupedDeductions = (selectedOrder.items || [])
                          .filter(item => {
                            // Online orders: Show anything with a refund record or cancellation total
                            if (isPaid) return Number(item.refund_amount || item.TotalAmount || 0) > 0;
                            // COD orders: ONLY show if an explicit refund record exists (Return)
                            return isCOD && Number(item.refund_amount || 0) > 0;
                          })
                          .reduce((acc, item) => {
                            const statusCode = item.refund_status_id || item.return_status_id;
                            const config = PAYMENT_STATUS_CONFIG[statusCode];
                            const label = config?.label || item.return_status_text || item.item_status_text || "Refund Processing";
                            const color = config?.color || "text-rose-400";

                            // POLICY: We use the actual recorded refund amount. 
                            // If isPaid (Online), we might fallback to TotalAmount for pre-delivery cancellations.
                            const itemAmt = Number(item.refund_amount || (isPaid ? item.TotalAmount : 0) || 0);

                            if (!acc[label]) acc[label] = { amount: 0, color };
                            acc[label].amount += itemAmt;
                            return acc;
                          }, {});

                        let itemRefundsSum = Object.values(groupedDeductions).reduce((s, b) => s + b.amount, 0);

                        // COD PRE-SHIP ABSORPTION FIX:
                        // If fully terminated COD order, the item amounts alone miss the uncharged fees (Shipping/Platform).
                        // We absorb this gap into the cancellation label to show the full bill amount (e.g. 529 instead of 479).
                        if (isCOD && !isPaid && isOrderFullyTerminated) {
                          const codGap = Math.max(0, originalGrandTotal - itemRefundsSum);
                          if (codGap > 0) {
                            const firstKey = Object.keys(groupedDeductions)[0];
                            if (firstKey) {
                              groupedDeductions[firstKey].amount += codGap;
                              itemRefundsSum += codGap;
                            }
                          }
                        }

                        // GAP CALCULATION: Any difference between Ledger and Item Sum is "Fees & Service" 
                        // (Usually only happens for cancellations where fees were also refunded)
                        const orderAdjustmentGap = Math.max(0, totalRefundValue - itemRefundsSum);

                        const rows = Object.entries(groupedDeductions).map(([label, data], idx) => (
                          <div key={idx} className={`flex justify-between text-[11px] font-black uppercase ${data.color}`}>
                            <span>{label}</span>
                            <span>-₹{Math.round(data.amount).toLocaleString()}</span>
                          </div>
                        ));

                        // 1. Fee Refund Row (Indigo) - Only if fees were actually refunded (Pre-ship)
                        // Ignore small 1-2 rupee rounding gaps which are just floating math artifacts
                        if (orderAdjustmentGap > 2) {
                          rows.push(
                            <div key="adj" className="flex justify-between text-[11px] font-black uppercase text-indigo-400">
                              <span>Fee & Service Refund</span>
                              <span>-₹{Math.round(orderAdjustmentGap).toLocaleString()}</span>
                            </div>
                          );
                        }

                        // 2. Non-Refundable Disclosure (Text-only UI simplification)
                        const expectedFees = Number(selectedOrder.ShippingFee || 0) + Number(selectedOrder.PlatformFee || 0);
                        let unrefundedFees = Math.max(0, originalGrandTotal - itemRefundsSum);

                        // If there is a legitimate fee gap left unrefunded, show a simple text disclaimer instead of complex math
                        if (isOrderFullyTerminated && expectedFees > 0 && unrefundedFees >= (expectedFees - 2)) {
                          rows.push(
                            <div key="unref" className="flex justify-center text-center mt-3 text-[9px] font-black uppercase text-slate-500/70 tracking-widest italic">
                              * Shipping & Platform Fees are non-refundable
                            </div>
                          );
                        }

                        return rows;
                      })()}

                      {/* Explicit row for PRE-SHIP COD Cancellations ONLY (Where no refund record exists) */}
                      {isCOD && !isPaid && cancelledAdjustmentAmount > 0 && (
                        <div className="flex justify-between text-[11px] font-black uppercase text-rose-400 animate-in fade-in slide-in-from-bottom-1 duration-700">
                          <span>{isOrderFullyTerminated && selectedOrder.items?.every(i => !i.refund_amount) ? "Order Cancelled" : "Item Cancelled"}</span>
                          <span>-₹{Math.round(cancelledAdjustmentAmount).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-start gap-3 mt-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className={`text-[11px] font-black uppercase leading-snug ${isFullyRefunded || (isTerminated && isPaid) ? "text-emerald-400" : (isCancelled ? "text-rose-400" : "text-amber-200")}`}>
                        {isFullyRefunded || (isTerminated && isPaid) ? "Total Credited Back" : (isCancelled ? "Final Amount" : isPartialRefund ? "Net Settlement" : isPaid ? "Amount Paid" : (isCOD ? "Collectable Amount" : "Payable Amount"))}
                      </p>
                      <span className="text-[9px] opacity-50 uppercase font-bold italic tracking-tighter leading-snug">
                        {isFullyRefunded || (isTerminated && isPaid) ? "Full order refunded" : isCancelled ? "No amount charged" : (isPaid ? (isCOD ? "Paid in Cash" : "Paid via Online") : (isCOD ? "Payable in Cash" : "Payable via Online"))}
                      </span>
                    </div>
                    <span className={`text-2xl md:text-3xl font-black italic tracking-tighter shrink-0 ${isCancelled && isPaid || isFullyRefunded ? "text-emerald-400" : (isFullyRefunded ? "text-slate-500 line-through" : "text-white")}`}>
                      ₹{Math.round((isFullyRefunded || (isTerminated && isPaid)) ? Math.min(totalRefundValue, originalGrandTotal) : calcNetSettlement).toLocaleString()}
                    </span>
                  </div>

                  {/* Master UTR Badge for Settlement */}
                  {(isFullyRefunded || (isTerminated && isPaid)) && selectedOrder.items?.find(i => i.refund_txn_id) && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Transaction Ref</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-black tracking-tighter text-emerald-300 font-mono">
                          {selectedOrder.items.find(i => i.refund_txn_id).refund_txn_id}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. ORDER LEVEL CANCEL SECTION */}
            <div className="space-y-4">
              {canCancelOrder && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-[24px] p-5 border ${isConfirming ? "bg-slate-900 border-slate-800" : "bg-rose-50/40 border-rose-100"}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isConfirming ? "bg-rose-500 text-white" : "bg-white border border-rose-100 text-rose-500"}`}
                      >
                        {isConfirming ? <AlertCircle size={20} className="animate-pulse" /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <h4 className={`text-[10px] font-black uppercase tracking-wider ${isConfirming ? "text-white" : "text-rose-900"}`}>
                          {isConfirming ? "Are you sure?" : "Cancel Full Order?"}
                        </h4>
                        <p className={`text-[9px] font-bold uppercase mt-1 ${isConfirming ? "text-slate-400" : "text-rose-400"}`}>This action cannot be undone.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isConfirming ? (
                        <button
                          onClick={() => setIsConfirming(true)}
                          className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 text-[9px] font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                          Cancel Full Order
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setIsConfirming(false)} className="px-4 py-2.5 text-slate-400 text-[9px] font-black uppercase hover:text-white transition-colors">
                            No, Keep it
                          </button>
                          <button
                            disabled={isCancelling}
                            onClick={() => handleAction("CANCEL")}
                            className="px-6 py-2.5 bg-rose-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-rose-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                          >
                            {isCancelling ? "Processing..." : "Yes, Cancel Now"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* SECURE FOOTER */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 rounded-full border border-slate-100">
                <ShieldCheck size={14} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">256-bit Secure Gateway</span>
              </div>
            </div>
          </motion.div>
        )
        }
      </AnimatePresence >
      <ReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setReturnModalOpen(false);
          setSelectedItemForReturn(null);
          setCancelModalType(null);
        }}
        selectedOrder={selectedOrder}
        selectedItem={selectedItemForReturn}
        type={cancelModalType ? "CANCEL" : "RETURN"}
        setSelectedOrder={setSelectedOrder}
      />
    </motion.div >
  );
}
