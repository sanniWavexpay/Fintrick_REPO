import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ShoppingBag, Settings, MapPin, Heart, LogOut, ArrowLeft, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/userAuth.slice";
import { getImageUrl } from "../../utils/image";

const ProfileLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const capitalizeWords = (str) => {
    return str
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const menuItems = [
    { id: "profile", label: "My Profile", icon: <User size={20} />, to: "/profile" },
    { id: "orders", label: "My Orders", icon: <ShoppingBag size={20} />, to: "/profile/orders" },
    { id: "wishlist", label: "Wishlist", icon: <Heart size={20} />, to: "/profile/wishlist" },
    { id: "address", label: "Addresses", icon: <MapPin size={20} />, to: "/profile/address" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, to: "/profile/settings" },
  ];

  return (
    <div className="fixed inset-0 z-[2000] md:relative md:inset-auto md:z-0 md:min-h-screen bg-[#f8fafc] md:p-2 flex items-center justify-center font-sans md:overflow-visible overflow-hidden ">
      <motion.div
        initial={window.innerWidth < 768 ? { x: "100%" } : { opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full h-full md:max-w-6xl md:h-[750px] bg-white md:rounded-[40px] md:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] md:overflow-visible overflow-hidden flex flex-col md:flex-row md:border border-slate-100"
      >
        {/* --- Sidebar: Desktop Only --- */}
        <div className="hidden md:flex w-1/4 bg-black border-r border-slate-100 p-8 flex-col justify-between shrink-0">
          <div>
            <div className="mb-4 text-center">
              <div className="relative w-28 h-28 mx-auto group">
                {/* Outer Glowing Ring - Modern Hexagonal Look */}
                <div 
                  className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 blur-lg opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"
                  style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
                ></div>

                {/* Inner Container - Hexagonal Shape */}
                <div 
                   className="relative w-full h-full bg-slate-900 border-2 border-white/10 flex items-center justify-center overflow-hidden"
                   style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
                >
                  {user?.ProfileImage ? (
                    <img
                      src={getImageUrl(user.ProfileImage)}
                      alt="Profile"
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://ui-avatars.com/api/?name=" + user?.Name; // Fallback agar image path galat ho
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-600 to-purple-600 bg-slate-50">
                      {user?.Name?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Small Verified Badge or Online Indicator - Targeted for Hexagon Corner */}
                <div className="absolute bottom-[-2px] right-[4px] w-5 h-5 bg-green-500 border-4 border-slate-900 rounded-full z-10"></div>
              </div>

              {/* User Info Section */}
              <div className="mt-6 space-y-1">
                <h2 className="text-white font-black tracking-tight text-2xl uppercase italic drop-shadow-md">{capitalizeWords(user?.Name)}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <p className="text-[9px] text-cyan-400 uppercase tracking-[0.3em] font-black">Premium Member</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.to === "/profile"}
                  className="relative block w-full group" // 'group' add kiya hai animations ke liye
                >
                  {({ isActive }) => (
                    <div
                      className={`relative w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                        isActive ? "bg-white text-purple-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                    >
                      {/* Content */}
                      <div className="flex items-center gap-4">
                        <span>{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </div>

                      {/* --- The Moving Dot --- */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorDot"
                          className="w-1.5 h-1.5 rounded-full bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]"
                          style={{ originY: "0px" }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 text-slate-400 font-bold hover:text-red-500 hover:bg-red-50/10 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-180 transition-all duration-500" />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* --- Content Area --- */}
        <div className="flex-1 overflow-y-auto bg-white no-scrollbar flex flex-col h-full">
          {/* Mobile Overlay Header */}
          <div className="md:hidden flex items-center justify-between px-6 py-5 border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur-lg z-[50]">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 flex items-center gap-2 active:scale-95 transition-transform">
              <ArrowLeft size={22} className="text-slate-900" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back</span>
            </button>
            <h1 className="text-sm mr-5 font-black uppercase tracking-[0.1em] text-slate-900 ">Account</h1>
            <button onClick={() => navigate("/")} className="p-2 bg-slate-50 rounded-full">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          <div className="p-2 md:p-4 flex-1">
            <Outlet />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileLayout;
