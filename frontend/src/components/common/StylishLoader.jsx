import { motion } from "framer-motion";
import logo from "../../assets/image/fintrick-logo.svg";

export const StylishLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAF7EE] z-[99999]">
      <div className="flex flex-col items-center max-w-xs text-center space-y-5 px-6">
        
        {/* Brand Logo with Gentle Breathing Pulse */}
        <motion.div
          animate={{
            scale: [0.98, 1.02, 0.98],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex items-center justify-center"
        >
          <img
            src={logo}
            alt="Fintrick"
            className="h-12 w-auto object-contain drop-shadow-xs"
          />
        </motion.div>

        {/* Minimalist Terracotta Progress Line */}
        <div className="w-36 h-[2px] bg-[#E8DFD0] rounded-full overflow-hidden relative">
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1/2 h-full bg-[#C26D43] rounded-full"
          />
        </div>

        {/* Subtle Tagline */}
        <p className="text-[10px] font-semibold tracking-[0.25em] text-[#78716C] uppercase">
          Curating Your Style...
        </p>

      </div>
    </div>
  );
};
