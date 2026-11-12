import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function ShopHero({ title, subtitle, background, position = "object-center" }) {
  return (
    <section className="relative h-[250px] md:h-[350px] flex items-center overflow-hidden">
      <motion.img
        src={background}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className={`absolute inset-0 w-full h-full object-cover ${position}`}
      />
      {/* Soft gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-300 mb-4 tracking-wide">
          <span className="hover:text-white cursor-pointer transition-colors">Home</span>
          <ChevronRight size={12} />
          <span className="text-white font-medium">{title}</span>
        </nav>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-4xl font-black text-white uppercase tracking-tighter"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-200 mt-2 max-w-md text-sm md:text-base font-light italic"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}