import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, X, Filter } from "lucide-react";
import SEO from "../../common/SEO";
import OrderCard from "./OrderCard";
import { siteConfig } from "../../../config/siteConfig";

const TABS = [
  { id: "all", label: "All", codes: null },
  { id: "pending", label: "Pending", codes: [8] },
  { id: "ongoing", label: "Ongoing", codes: [9, 10] },
  { id: "delivered", label: "Completed", codes: [11] },
  { id: "cancelled", label: "Cancelled", codes: [12] },
  { id: "refunded", label: "Refunds", codes: [13, 62] },
];

export default function OrderList({ orders, setSelectedOrder }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. FILTER LOGIC - Clean and Optimized
  const filteredOrders = useMemo(() => {
    let result = orders || [];

    // Tab Filter
    const currentTab = TABS.find((t) => t.id === activeTab);
    if (currentTab?.codes) {
      result = result.filter((o) => currentTab.codes.includes(Number(o.OrderStatus)));
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.OrderNo.toLowerCase().includes(q) ||
          o.items?.some((item) => item.ProductTitle.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <SEO
        title={`My Orders | Track Your Orders | ${siteConfig.name}`}
        description={`Check your order history, track deliveries, and manage your purchases on ${siteConfig.name}.`}
      />

      {/* --- STICKY TOP SECTION --- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 pt-6 px-2 md:px-4 pb-4 shadow-sm shadow-slate-200/50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 italic">MY ORDERS</h1>
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600">
                <Package size={16} />
             </div>
             <span className="text-[10px] font-black pr-3 uppercase tracking-widest text-slate-500">
                {orders?.length || 0} Total
             </span>
          </div>
        </div>

        {/* Search Bar - Modern Design */}
        <div className="relative mb-5 group">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-slate-100 rounded-2xl border-2 border-transparent focus-within:border-white focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-indigo-500/10 transition-all duration-300">
            <Search className="ml-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID or Product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none rounded-2xl py-3.5 pl-3 pr-4 text-sm font-bold placeholder:text-slate-400 focus:ring-0"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="mr-3 p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Tabs - High Quality Aesthetics */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {TABS.map((tab) => {
             const isActive = activeTab === tab.id;
             return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 transform active:scale-95 ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 -translate-y-0.5" 
                    : "bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
             );
          })}
        </div>
      </div>

      {/* --- ORDERS LIST --- */}
      <div className="px-2 md:px-4 py-4 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard 
                key={order.ID} 
                order={order} 
                onClick={setSelectedOrder} 
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-slate-400"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-slate-200 rounded-full blur-3xl opacity-50" />
                <Package size={80} strokeWidth={1} className="relative opacity-20" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">
                No matching orders found
              </p>
              <button 
                onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 underline decoration-2 underline-offset-4"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
