import { Heart, LogOut, Package, ShoppingCart, SlidersHorizontal, User, X, ChevronRight, Globe, ArrowLeft, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useCategories } from "../../features/category/useCategories";
import { getImageUrl } from "../../utils/image";
import { logout } from "../../features/auth/userAuth.slice";
import { cartActions } from "../../features/cart/Cart.slice";
import { queryClient } from "../../app/queryClient";
import toast from "react-hot-toast";

const MobileSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: categoryResponse, isLoading } = useCategories();
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [activeSubId, setActiveSubId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isSubPage = location.pathname.includes("/profile/");
  const categories = categoryResponse?.data || [];
  console.log(categories);

  const toggleCategory = (id) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  };
  const capitalizeWords = (str) => {
    return str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(cartActions.clearCart());
    dispatch(logout());
    queryClient.clear();
    localStorage.clear();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };
  const closeDrawer = () => {
    const drawer = document.getElementById("mobile-sidebar");
    if (drawer) drawer.checked = false;
  };

  return (
    <div className="drawer-side z-[200]">
      <input id="mobile-sidebar" type="checkbox" className="drawer-toggle" />
      <label htmlFor="mobile-sidebar" aria-label="close sidebar" className="drawer-overlay bg-black/40 backdrop-blur-sm"></label>

      <div className="menu p-0 w-full min-h-full bg-white text-base-content flex flex-col no-scrollbar shadow-2xl overflow-hidden relative">
        {/* --- LAYER 1: MAIN MENU --- */}
        <div className={`flex flex-col h-full w-full transition-all duration-300 ${isSubPage ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
          {/* 1. HEADER */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 text-white relative overflow-hidden shrink-0">
            <label
              htmlFor="mobile-sidebar"
              className="absolute right-4 top-4 z-20 cursor-pointer p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all active:scale-90"
            >
              <X size={20} className="text-white" />
            </label>

            <div className="flex items-center gap-4 relative z-10">
              <motion.div whileTap={{ scale: 0.95 }} className="bg-gradient-to-tr from-pink-500 to-violet-500 p-[2px] rounded-full shadow-lg">
                <div className="bg-slate-900 rounded-full p-3 border-2 border-white/10 overflow-hidden w-12 h-12 flex items-center justify-center">
                  {user?.ProfileImage ? (
                    <img src={getImageUrl(user.ProfileImage)} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User size={24} className="text-white" />
                  )}
                </div>
              </motion.div>
              <div>
                <p className="font-black italic text-xl tracking-tight leading-none">
                  Hello, {user ? capitalizeWords(user.Name) : "Guest"}
                </p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2 shadow-sm ${user ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black" : "bg-white/10 text-white/60"}`}>
                  <span className="text-[8px] font-black uppercase tracking-wider">
                    {user ? "Plus Member" : "Enjoy Shopping"}
                  </span>
                </div>
              </div>
            </div>
            {/* Decorative Background Icon */}
            <ShoppingCart size={140} className="absolute -right-10 -bottom-10 text-white/[0.03] -rotate-12 pointer-events-none" />
          </div>

          {/* 2. QUICK ACTIONS */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-zinc-50 border-b border-zinc-100">
            {[
              { label: "Profile", icon: <User size={18} />, color: "text-orange-600", to: "/profile" },
              { label: "Orders", icon: <Package size={18} />, color: "text-blue-600", to: "/profile/orders" },
              { label: "Wishlist", icon: <Heart size={18} fill="#ec4899" />, color: "text-pink-500", to: "/profile/wishlist" },
            ].map((item, i) => (
              <Link to={item.to} key={i} onClick={closeDrawer}>
                <motion.div whileTap={{ scale: 0.95 }} className="flex flex-col items-center justify-center py-4 bg-white rounded-2xl border border-zinc-200/60 shadow-sm">
                  <div className={`${item.color} mb-1.5`}>{item.icon}</div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* 3. MAIN LINKS: Categories & Settings */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-4">
            <p className="px-6 text-[10px] uppercase text-zinc-400 font-black tracking-[0.2em] mb-4">Shop By Category</p>

            <ul className="px-3 space-y-1">
              {categories.map((category) => {
                const hasSub = category.subcategories && category.subcategories.length > 0;
                const isOpen = openCategoryId === category.ID;

                return (
                  <li key={category.ID} className="group/item">
                    <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-zinc-50 transition-all">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/category/${category.Slug}`);
                          closeDrawer();
                        }}
                        className="flex items-center gap-3 flex-1 py-2 pl-2 cursor-pointer active:opacity-60"
                      >
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={getImageUrl(category.CategoryImg)} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className={`font-bold text-sm ${isOpen ? "text-black" : "text-zinc-700"}`}>{category.CategoryName}</span>
                      </div>

                      {hasSub && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(category.ID);
                          }}
                          className={`p-3 ml-2 rounded-xl transition-all cursor-pointer ${isOpen ? "bg-zinc-100 text-black rotate-180" : "text-zinc-400 hover:bg-zinc-100"}`}
                        >
                          <ChevronDown size={16} transition={{ duration: 0.3 }} />
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {hasSub && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col items-start mt-1 mb-3 ml-2 bg-white overflow-hidden"
                        >
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.ID}
                              to={`/category/${category.Slug}/${sub.Slug}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSubId(sub.ID);
                                closeDrawer();
                              }}
                              className={`w-full px-3 py-2 text-sm rounded-lg transition-all duration-200
                                ${activeSubId === sub.ID ? "bg-primary text-white shadow-sm scale-[0.98]" : "text-zinc-700 hover:bg-zinc-100"}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                                  <img src={getImageUrl(sub.CategoryImg)} className="w-full h-full object-cover" alt="" />
                                </div>
                                <span className={`font-bold text-sm ${activeSubId === sub.ID ? "text-white" : "text-zinc-700 hover:bg-zinc-100"}`}>
                                  {sub.CategoryName}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}

              {/* Divider & Settings */}
              <div className="h-[1px] bg-zinc-100 mx-4 my-4" />
              <p className="px-4 text-[10px] uppercase text-zinc-400 font-black tracking-[0.2em] mb-2">Account Settings</p>

              <li>
                <Link to="/profile/address" onClick={closeDrawer} className="flex p-4 font-bold text-zinc-600 text-sm rounded-2xl hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  Address
                </Link>
              </li>
              <li>
                <Link to="/profile/settings" onClick={closeDrawer} className="flex p-4 font-bold text-zinc-600 text-sm rounded-2xl hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. FOOTER: Logout & Language */}
          <div className="p-6 border-t border-zinc-100 bg-white/80 backdrop-blur-md shrink-0">
            {user ? (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl active:scale-[0.98]"
              >
                <LogOut size={18} />
                <span className="text-xs tracking-widest uppercase">Logout</span>
              </button>
            ) : (
              <Link to="/user-auth" onClick={closeDrawer} className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white font-black rounded-2xl active:scale-[0.98]">
                <User size={18} />
                <span className="text-xs tracking-widest uppercase">Login / Register</span>
              </Link>
            )}
          </div>
        </div>

        {/* --- LAYER 2: SUB-PAGE OVERLAY (Profile/Orders Content) --- */}
        <AnimatePresence>
          {isSubPage && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-white z-[300] flex flex-col"
            >
              <div className="px-6 py-5 border-b flex items-center gap-4 bg-white sticky top-0 z-[310] shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-zinc-50 rounded-full active:scale-90">
                  <ArrowLeft size={22} className="text-zinc-900" />
                </button>
                <h1 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 italic">{location.pathname.split("/").pop()}</h1>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-white">
                <Outlet />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileSidebar;
