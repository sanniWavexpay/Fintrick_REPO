import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

/**
 * ModernInfoLayout - A premium layout for informational pages.
 * Features: Animated Hero, Section Icons, and responsive design.
 */
const ModernInfoLayout = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div className="bg-white text-zinc-900 min-h-screen font-sans selection:bg-primary/20 selection:text-primary">

      {/* 🏙️ PREMIUM CURVED HERO SECTION */}
      <section className="pt-32 pb-24 px-6 text-center bg-zinc-950 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--color-primary)_rgba(0,0,0,0.1),_transparent_50%)]"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-primary mb-8"
          >
            {Icon ? <Icon size={16} /> : <Sparkles size={16} />}
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Policy</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black leading-none uppercase tracking-tighter"
          >
            {title.split(" ").map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "text-primary italic block md:inline" : "block md:inline"}>
                {word}{" "}
              </span>
            ))}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 font-medium text-sm md:text-lg mt-8 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* --- THE CURVE --- */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 120"
            className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]"
            fill="white"
            preserveAspectRatio="none"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* 📄 CONTENT AREA */}
      <section className="px-6 py-16 max-w-4xl mx-auto relative z-10 -mt-10 md:-mt-20">
        <div className="space-y-6">
          {children}
        </div>
      </section>


    </div>
  );
};

export const InfoSection = ({ title, icon: Icon, children, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary/5 text-primary border-primary/10",
    blue: "bg-blue-50 text-blue-500 border-blue-100",
    green: "bg-emerald-50 text-emerald-500 border-emerald-100",
    zinc: "bg-zinc-50 text-zinc-500 border-zinc-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-100 shadow-sm hover:shadow-md transition-all group lg:flex items-start gap-8"
    >
      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 mb-6 lg:mb-0 ${colorMap[color] || colorMap.primary}`}>
        {Icon && <Icon size={28} />}
      </div>
      <div className="space-y-4 w-full">
        <h3 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
          {title}
        </h3>
        <div className="text-zinc-600 font-medium leading-relaxed prose-sm md:prose-base prose-strong:text-black prose-strong:font-black">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default ModernInfoLayout;
