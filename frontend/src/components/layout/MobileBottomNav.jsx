import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const MobileBottomNav = ({ toggleCart, totalItems, isCartOpen }) => {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-[#FAF7EE]/95 backdrop-blur-xl border-t border-[#E8DFD0] flex justify-around items-center pt-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] z-[100] shadow-[0_-8px_25px_rgba(28,25,23,0.06)]"
      style={{ transform: "translateZ(0)", willChange: "transform" }}
    >
      {/* Home Link */}
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 transition-colors ${
          location.pathname === "/" ? "text-[#C26D43]" : "text-[#78716C]"
        }`}
      >
        <Home size={19} strokeWidth={location.pathname === "/" ? 2.5 : 2} />
        <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
      </Link>

      {/* Shop Catalog */}
      <Link
        to="/shop"
        className={`flex flex-col items-center gap-1 transition-colors ${
          location.pathname === "/shop" ? "text-[#C26D43]" : "text-[#78716C]"
        }`}
      >
        <LayoutGrid size={19} strokeWidth={location.pathname === "/shop" ? 2.5 : 2} />
        <span className="text-[9px] font-bold uppercase tracking-wider text-center">Shop</span>
      </Link>

      {/* Cart Drawer */}
      <div
        onClick={toggleCart}
        className={`flex flex-col items-center gap-1 relative cursor-pointer transition-colors ${
          isCartOpen ? "text-[#C26D43]" : "text-[#78716C]"
        }`}
      >
        <ShoppingBag size={19} strokeWidth={isCartOpen ? 2.5 : 2} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C26D43] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FAF7EE]">
            {totalItems}
          </span>
        )}
        <span className="text-[9px] font-bold uppercase tracking-wider">Bag</span>
      </div>

      {/* Profile Sidebar */}
      <label
        htmlFor="mobile-sidebar"
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          location.pathname === "/profile" ? "text-[#C26D43]" : "text-[#78716C]"
        }`}
      >
        <User size={19} strokeWidth={location.pathname === "/profile" ? 2.5 : 2} />
        <span className="text-[9px] font-bold uppercase tracking-wider">Account</span>
      </label>
    </nav>
  );
};
