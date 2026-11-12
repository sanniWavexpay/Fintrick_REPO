import { X, RotateCw } from "lucide-react";
import { ProductCard } from "../home/ProductCard";
import { Link, useSearchParams } from "react-router-dom";
import { ProductSkeleton } from "../common/Loader";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export default function ShopProducts({ products, isLoading, totalCount, isFetching, handleLoadMore }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // 1. Tags nikalne ka logic
  const activeFilters = Array.from(searchParams.entries());

  // 2. Filter delete karne ka logic
  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    // Agar category delete ho rahi hai toh subcategory bhi hata do
    if (key === "category") newParams.delete("subcategory");
    setSearchParams(newParams);
  };

  const clearAll = () => setSearchParams({});

  // if (activeFilters.length === 0) return null; // Agar koi filter nahi toh ye section mat dikhao

  return (
    <div className="w-full">
      {/* --- 1. ACTIVE FILTERS TAGS --- */}
      {activeFilters.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full border-b border-zinc-100 pb-6">
          {/* Left Side: Label + Tags Container */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mr-1">Applied:</span>

            <AnimatePresence mode="popLayout">
              {activeFilters.map(([key, value]) => {
                let displayLabel = value;
                if (key === "max_price") displayLabel = `Under ₹${value}`;
                if (key === "type") {
                  const typeLabels = {
                    latest: "New Arrivals",
                    trending: "Trending",
                    most_buyed: "Best Sellers",
                  };
                  displayLabel = typeLabels[value] || value;
                }

                if (key === "discount") {
                  if (value.includes("-")) {
                    // 20-30 ko "20% - 30% Off" banayega
                    const [min, max] = value.split("-");
                    displayLabel = `${min}% - ${max}% Off`;
                  } else if (value.includes("+")) {
                    // 40+ ko "More than 40% Off" banayega
                    const val = value.replace("+", "");
                    displayLabel = `More than ${val}% Off`;
                  } else {
                    displayLabel = `${value}% Off`;
                  }
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="bg-white border border-zinc-200 py-1.5 px-3 gap-2 flex items-center rounded-xl shadow-sm hover:border-zinc-300 transition-all"
                  >
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{key.replace("_", " ")}:</span>
                    <span className="text-[10px] font-bold text-black uppercase tracking-tight">
                      {key === "discount" || key === "max_price" ? displayLabel : displayLabel.toString().replace("-", " ")}
                    </span>{" "}
                    <button onClick={() => removeFilter(key)} className="hover:bg-zinc-100 p-0.5 rounded-full transition-colors ml-1">
                      <X size={12} className="text-red-500" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Side: Clear All Button (Ab ye alignment nahi todega) */}
          <div className="flex items-center">
            <button
              onClick={clearAll}
              className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary/5 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-primary/10 whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      {/* --- 2. PRODUCT GRID AREA --- */}
      <div className="min-h-[60vh] md:min-h-[140vh]">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-2">
          {/* --- PRODUCT LISTING --- */}
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : products?.length > 0 ? (
            products?.map((item) => (
              <div key={item.id} className="min-w-[47%] sm:min-w-[30%] md:min-w-0 snap-start">
                <ProductCard item={item} />
              </div>
            ))
          ) : searchParams.get("sort") === "top_rated" ? (
            /* --- PREMIUM EMPTY STATE FOR TOP RATED --- */
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mb-6 border border-amber-200 shadow-inner"
              >
                <div className="text-amber-500 font-black text-4xl">★</div>
              </motion.div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black">Our Community is Growing! 🌟</h3>
              <p className="text-zinc-500 text-sm max-w-[320px] mt-2 font-medium leading-relaxed">
                Be the trendsetter! No products have been rated yet. Help other fashion lovers by rating your favorites.
              </p>

              <button
                onClick={() => removeFilter("sort")}
                className="mt-8 bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-zinc-200"
              >
                Explore All Collections
              </button>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100 shadow-inner">
                <RotateCw size={40} className="text-primary animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black">Coming Soon...</h3>
              <p className="text-zinc-500 text-sm max-w-[280px] mt-2 font-medium">We'll be back with more products soon.</p>

              <button onClick={clearAll} className="mt-8 bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-lg">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
      {/* --- 3. LOAD MORE / PAGINATION --- */}
      {!isLoading && products?.length > 0 && (
        <div className="mt-20 mb-10 flex flex-col items-center border-t border-zinc-100 pt-10 w-full">
          <div className="flex flex-col items-center mb-3 gap-3">
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              {products.length === totalCount ? `All ${totalCount} Products Viewed` : `You've viewed ${products.length} of ${totalCount} products`}
            </p>

            {/* Progress bar sirf tab dikhao jab products bache hon, 
          warna ek clean line ya tick icon dikha sakte ho */}
            {products.length < totalCount && (
              <progress className="progress progress-primary w-64 h-1.5 shadow-inner" value={(products.length / totalCount) * 100} max="100"></progress>
            )}
          </div>

          {/* Button hamesha check karega ki aur products hain ya nahi */}
          {products.length < totalCount ? (
            <button
              onClick={handleLoadMore}
              disabled={isFetching} // 👈 Request ke waqt button lock kar do
              className="group relative flex items-center gap-3 bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {/* 👈 Spinner logic: Agar fetch ho raha hai toh rotate icon ko spin karao */}
              <RotateCw size={14} className={`${isFetching ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`} />

              {isFetching ? "Loading More..." : "Load More Styles"}
            </button>
          ) : (
            <div className="py-2 px-6 bg-zinc-50 rounded-full border border-zinc-100">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">End of Collection</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
