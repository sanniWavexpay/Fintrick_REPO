import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useOrder } from "../../../features/order/useOrder";
import OrderDetailView from "./OrderDetailView";
import OrderList from "./OrderList";
import SEO from "../../common/SEO";
import { siteConfig } from "../../../config/siteConfig";

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders, isOrdersLoading } = useOrder();
  console.log("orderorderoder", orders);

  useEffect(() => {
    if (orders && selectedOrder) {
      const updatedOrder = orders.find((o) => o.ID === selectedOrder.ID);

      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders]);

  if (isOrdersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-full max-w-3xl mx-auto px-1 md:px-4 py-0 md:py-6 mb-4 md:mb-6 font-sans antialiased">
      <SEO
        title={`My Orders | Track Your Orders | ${siteConfig.name}`}
        description={`Check your order history, track deliveries, and manage your purchases on ${siteConfig.name}.`}
      />
      <AnimatePresence mode="wait">
        {!selectedOrder ? (
          <OrderList key="list" orders={orders} setSelectedOrder={setSelectedOrder} />
        ) : (
          <OrderDetailView key="details" selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
        )}
      </AnimatePresence>
    </div>
  );
}
