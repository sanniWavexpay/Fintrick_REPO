import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";

export default function OfferBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    let endTime = localStorage.getItem("flashSaleEndTime");

    if (!endTime) {
      endTime = new Date().getTime() + 2 * 24 * 60 * 60 * 1000;
      localStorage.setItem("flashSaleEndTime", endTime);
    } else {
      endTime = parseInt(endTime);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      let distance = endTime - now;

      if (distance <= 0) {
        endTime = now + 2 * 24 * 60 * 60 * 1000;
        localStorage.setItem("flashSaleEndTime", endTime);
        distance = endTime - now;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-3 md:px-10 py-6 md:py-10 bg-[#FAF7EE]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[1.5rem] md:rounded-[3rem] bg-[#1C1917] p-6 md:p-12 text-[#FAF7EE] shadow-xl border border-[#292524]"
      >
        {/* Animated Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-48 h-48 md:w-96 md:h-96 bg-[#C26D43] rounded-full blur-[90px] md:blur-[130px]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-14">
          {/* Left Side: Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="flex items-center gap-2 mb-4 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Sparkles className="text-[#E07A5F]" size={14} />
              <span className="uppercase tracking-[0.2em] text-[10px] font-black text-[#FAF7EE]">
                Capsule Seasonal Drop
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-3 leading-[1.15] text-[#FAF7EE]">
              Exclusive Flash Edit: <br />
              <span className="text-[#E07A5F] italic font-normal">Up To 60% Off</span>
            </h2>

            <p className="text-[#A8A29E] text-xs sm:text-base max-w-sm md:max-w-md leading-relaxed">
              Curate your seasonal wardrobe with our handcrafted breathable cottons, resort linens, and chic dresses.
            </p>
          </div>

          {/* Right Side: Countdown + Button */}
          <div className="w-full lg:w-auto flex flex-col items-center gap-6">
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.mins },
                { label: "Secs", val: timeLeft.secs },
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-22 md:h-22 bg-[#292524]/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={unit.val}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="absolute w-full text-center text-xl md:text-3xl font-serif font-bold text-[#FAF7EE]"
                      >
                        {String(unit.val).padStart(2, "0")}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <span className="text-[9px] uppercase mt-2 font-bold tracking-widest text-[#A8A29E]">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/shop?discount=0-60")}
              label="Explore Offer Styles"
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
