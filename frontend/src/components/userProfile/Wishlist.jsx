import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "../home/ProductCard";
import { Heart, ShoppingBag, Loader2 } from "lucide-react"; // Loader2 add kiya
import { useWishlist } from "../../features/wishlist/useWishlist";
import SEO from "../common/SEO";
import { siteConfig } from "../../config/siteConfig";

export default function Wishlist() {
  // 1. Variable names ko hook ke according fix kiya
  const { wishlistItems = [], isLoading } = useWishlist();

  // 2. Loading State handle kari
  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-slate-300" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <SEO 
        title={`My Wishlist | Save Your Favorites | ${siteConfig.name}`} 
        description={`Save and manage your favorite products in your ${siteConfig.name} wishlist. Shop anytime from your saved items.`} 
      />
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[0.03em] text-slate-900 md:text-4xl">My Wishlist</h1>
          <p className="text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Products you've saved for later.</p>
          <div className="flex items-center gap-2 mt-2">
            <Heart size={14} className="text-pink-500 fill-pink-500" />
            {/* 3. wishlistItems.length use kiya */}
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">{wishlistItems.length} Items Saved</p>
          </div>
        </div>

        {/* {wishlistItems.length > 0 && (
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
            <ShoppingBag size={14} /> Add All To Cart
          </button>
        )} */}
      </header>

      {/* --- GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
        <AnimatePresence mode="popLayout">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((product, index) => (
              <motion.div
                key={product.id || index} // Unique key fix
                layout // Smooth layout transitions for removal
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} // Item remove hote waqt animation
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <ProductCard item={product} />
              </motion.div>
            ))
          ) : (
            /* --- EMPTY STATE --- */
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30"
            >
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200 mb-6">
                <Heart size={40} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Your wishlist is empty!</p>
              <button
                onClick={() => (window.location.href = "/shop")} // Redirect logic
                className="mt-6 text-[10px] font-black text-blue-600 underline decoration-2 underline-offset-4 uppercase tracking-widest"
              >
                Start Shopping
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
