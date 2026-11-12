import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "../common/Loader";
import { useProduct } from "../../features/product/useProduct";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const TrandingSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.05 });

  let typeName = "trending";
  const { data: products, isLoading } = useProduct({ type: typeName, limit: 10 }, inView);

  return (
    <section ref={sectionRef} className="py-6 sm:py-10 px-3 md:px-10 bg-[#FAF7EE] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C26D43]">
              TRENDING DROPS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mt-1 border-l-4 border-[#C26D43] pl-3">
              Trending <span className="text-[#C26D43] italic">Now</span>
            </h2>
          </div>
          <Link
            to={`/shop?type=${typeName}`}
            className="text-xs font-bold text-[#C26D43] hover:underline uppercase tracking-wider pb-1"
          >
            View All ({products?.data?.total || "All"}) →
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 md:gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : products?.data?.data?.length > 0 ? (
            products?.data?.data?.map((item) => (
              <div key={item.id}>
                <ProductCard item={item} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-[#A8A29E] italic text-xs">
              No trending products at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrandingSection;
