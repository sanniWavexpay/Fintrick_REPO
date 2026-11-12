import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: <Truck size={28} />,
    title: "Free Express Shipping",
    desc: "Swift dispatch on orders over ₹799",
  },
  {
    icon: <RotateCcw size={28} />,
    title: "Easy 7-Day Exchange",
    desc: "Doorstep pickup & hassle-free swaps",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "100% Secure Checkout",
    desc: "UPI, Cards & NetBanking protected",
  },
  {
    icon: <Headphones size={28} />,
    title: "Direct Helpdesk",
    desc: "+91 9292024432 | Daily 10 AM - 7 PM",
  },
];

export function BrandTrust() {
  return (
    <div className="bg-[#FAF7EE] py-12 px-4 md:px-10 border-y border-[#E8DFD0]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C26D43] bg-[#C26D43]/10 px-3 py-1 rounded-full border border-[#C26D43]/20">
          The Fintrick Promise
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917] mt-3">
          Thoughtful Quality, Honest Service
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto">
          Every garment is inspected for premium fabric strength, breathable comfort, and lasting durability.
        </p>
      </motion.div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="bg-[#F3EFE6] rounded-2xl p-5 border border-[#E8DFD0] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-[#FAF7EE] rounded-xl shadow-xs text-[#C26D43] border border-[#E8DFD0] group-hover:bg-[#C26D43] group-hover:text-white transition-all duration-300 shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#1C1917] uppercase tracking-wider text-xs">
                  {item.title}
                </h3>
                <p className="text-[#78716C] text-[11px] mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
