import React from "react";
import { ProductCard } from "../home/ProductCard";

const trending = [
  { id: 1, name: "Premium Cotton Tee", price: "$29.00", oldPrice: "$45.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800", badge: "New" },
  { id: 2, name: "Luxury Silk Dress", price: "$120.00", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800", badge: "Hot" },
  { id: 3, name: "Urban Leather Jacket", price: "$199.00", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800" },
  { id: 4, name: "Gold Minimal Rings", price: "$85.00", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800", badge: "Sale" },
  { id: 5, name: "Classic Denim Blue", price: "$55.00", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800" },
];
const RelatedProduct = () => {
  return (
    <section className="mb-0 md:my-5 py-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header with View All Link (UX for scroll sections) */}
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-md md:text-3xl text-black font-black border-l-4 border-primary pl-4 uppercase tracking-tighter">
            Related Product
          </h2>
          <button className="text-[10px] text-primary border-b-2 border-black pb-1 uppercase tracking-widest md:hidden">View All</button>
        </div>

        {/* --- Responsive Wrapper --- */}
        {/* Mobile: Flex-row with overflow-scroll (2 cards visible) */}
        {/* Desktop: Grid system (5 columns) */}
        <div className="flex overflow-x-auto pb-6 gap-2 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6 md:overflow-visible md:pb-0">
          {trending.map((p) => (
            <div key={p.id} className="min-w-[47%] sm:min-w-[30%] md:min-w-0 snap-start">
              <ProductCard item={p} />
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar hide karne ke liye CSS */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
export default RelatedProduct;
