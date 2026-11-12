import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "../../features/category/useCategories";
import { getImageUrl } from "../../utils/image";

export default function CategorySection() {
  const { data: categories } = useCategories();
  const topCategories = categories?.data?.slice(0, 5) || [];

  return (
    <div className="bg-[#FAF7EE] py-12 px-4 md:px-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C26D43]">
              WARDROBE EDITS
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1C1917] mt-1">
              Shop by <span className="text-[#C26D43] italic">Collection</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#C26D43] hover:underline uppercase tracking-wider hidden sm:block"
          >
            All Categories →
          </Link>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 md:gap-6 pt-1 pb-4 lg:pb-0 no-scrollbar snap-x snap-mandatory">
          {topCategories?.map((cat) => (
            <motion.div
              key={cat.ID}
              whileHover={{ y: -5 }}
              className="min-w-[46%] sm:min-w-[30%] lg:min-w-full snap-start group cursor-pointer"
            >
              <Link to={`/category/${cat.Slug}`} className="block cursor-pointer focus:outline-none">
                <div className="relative h-64 md:h-84 w-full overflow-hidden rounded-3xl bg-[#F3EFE6] border border-[#E8DFD0] shadow-sm hover:shadow-xl transition-all duration-500">
                  <img
                    src={getImageUrl(cat.CategoryImg)}
                    alt={cat.CategoryName}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/90 via-[#1C1917]/25 to-transparent flex flex-col justify-end p-4 md:p-5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4A373]">
                      COLLECTION
                    </span>
                    <h3 className="text-[#FAF7EE] font-serif text-sm md:text-base font-semibold leading-tight mt-0.5 group-hover:text-[#E07A5F] transition-colors">
                      {cat.CategoryName}
                    </h3>

                    <div className="md:hidden w-6 h-[2px] bg-[#C26D43] mt-2 opacity-80" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
