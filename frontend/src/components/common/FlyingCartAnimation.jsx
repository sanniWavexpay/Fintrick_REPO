import { motion } from "framer-motion";
import { createPortal } from "react-dom";

export const FlyingCartAnimation = ({ startPos, endPos, image, onComplete }) => {
  const peakY = Math.min(startPos.y, endPos.y) - 10;

  const content = (
    <motion.div
      initial={{
        top: startPos.y,
        left: startPos.x,
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        top: [startPos.y, peakY, endPos.y],
        left: [startPos.x, (startPos.x + endPos.x) / 2, endPos.x],
        scale: [0.5, 1.2, 0.2, 0],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.4, 1],
      }}
      onAnimationComplete={onComplete}
      className="fixed z-[99999] pointer-events-none"
      style={{
        position: "fixed",
        width: "64px",
        height: "64px",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-[#C26D43]/30 blur-xl rounded-full scale-150"></div>
        <img
          src={image}
          alt="flying"
          className="w-full h-full rounded-2xl object-cover border-2 border-white shadow-2xl relative z-10"
        />
      </div>
    </motion.div>
  );

  return createPortal(content, document.body);
};
