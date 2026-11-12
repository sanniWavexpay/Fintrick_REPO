import React from "react";

export const Button = ({
  label,
  variant = "primary", // primary, outline, secondary, dark
  size = "md", // sm, md, lg
  icon: Icon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-300 rounded-full active:scale-95 shadow-sm hover:shadow-md cursor-pointer";

  // Fintrick Warm Luxury Variants
  const variants = {
    // Terracotta Solid for main actions
    primary:
      "bg-[#C26D43] hover:bg-[#D47A53] text-[#FAF7EE] shadow-md shadow-[#C26D43]/20 hover:scale-[1.02]",
    // Outline for secondary actions
    outline:
      "border border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FAF7EE] bg-transparent",
    // Deep Espresso for "Add to Bag"
    dark: "bg-[#1C1917] text-[#FAF7EE] hover:bg-[#292524]",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-7 py-3 text-xs",
    lg: "w-full py-4 text-sm font-black", // Full width for checkout buttons
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {label}
      {Icon && (
        <Icon className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform ml-2" size={16} />
      )}
    </button>
  );
};
