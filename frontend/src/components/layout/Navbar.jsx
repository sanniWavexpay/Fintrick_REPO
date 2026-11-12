import {
  BellRing,
  Menu,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Heart,
  Package,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowLeft,
  X,
  History as HistoryIcon,
  MoveUpLeft,
  Sparkles,
  Phone,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCategories } from "../../features/category/useCategories";
import { getImageUrl } from "../../utils/image";
import { useProduct } from "../../features/product/useProduct";
import { useDispatch, useSelector } from "react-redux";
import { addSearchTerm, clearHistory } from "../../features/search/search.slice";
import { logout } from "../../features/auth/userAuth.slice";
import toast from "react-hot-toast";
import { useCart } from "../../features/cart/useCart";
import { cartActions } from "../../features/cart/Cart.slice";
import { queryClient } from "../../app/queryClient";
import { siteConfig } from "../../config/siteConfig";

export default function Navbar({ toggleCart }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: categories } = useCategories();

  // Custom Local Category Filtering based on search
  const searchLower = searchTerm.trim().toLowerCase();

  const matchedCategories = searchLower
    ? (categories?.data || [])
        .filter((cat) => cat.CategoryName.toLowerCase().includes(searchLower))
        .slice(0, 3)
    : [];

  const matchedSubcategories = searchLower
    ? (categories?.data || [])
        .flatMap((cat) =>
          (cat.subcategories || []).map((sub) => ({
            ...sub,
            parentSlug: cat.Slug,
            parentName: cat.CategoryName,
          }))
        )
        .filter(
          (sub) =>
            sub.CategoryName.toLowerCase().includes(searchLower) ||
            sub.parentName.toLowerCase().includes(searchLower)
        )
        .slice(0, 8)
    : [];

  // API call: Triggered when user enters > 2 characters
  const { data: suggestionData, isFetching: isSearching } = useProduct(
    { search: searchTerm, limit: 5 },
    searchTerm.length > 2
  );
  const suggestions = suggestionData?.data?.data || [];
  const searchHistory = useSelector((state) => state.search.history);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Close dropdown/menu on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { cartItems } = useCart();
  const totalItems = cartItems?.items?.length || 0;

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      dispatch(addSearchTerm(searchTerm.trim()));
      setIsSearchModalOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (text) => {
    dispatch(addSearchTerm(text));
    setIsSearchModalOpen(false);
    navigate(`/shop?search=${encodeURIComponent(text)}`);
    setSearchTerm("");
  };

  const handleLogout = () => {
    dispatch(cartActions.clearCart());
    dispatch(logout());
    queryClient.clear();
    localStorage.clear();
    window.location.href = "/";
  };

  const closeMenu = () => setIsMenuOpen(false);
  const closeDropdown = () => {
    setIsDropdownOpen(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="drawer">
      <div className="drawer-content flex flex-col">
        {/* ================= 1. WARM LUXURY TOP UTILITY TICKER ================= */}
        <div className="fixed top-0 left-0 right-0 z-[115] bg-[#1C1917] text-[#FAF7EE] text-[11px] font-medium py-1.5 px-4 border-b border-[#292524] hidden sm:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C26D43] animate-pulse"></span>
              <span className="tracking-wide">
                Free Express Delivery across India on orders above ₹799
              </span>
            </div>
            <div className="flex items-center gap-4 text-[#FAF7EE]/70">
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Truck size={12} className="text-[#C26D43]" />
                <span>Express Pan-India Delivery</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={12} className="text-[#C26D43]" />
                <a href={`tel:${siteConfig.phone}`}>+91 {siteConfig.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. MAIN WARM LUXURY NAVBAR ================= */}
        <nav
          className="fixed top-0 sm:top-[28px] left-0 right-0 z-[110] 
          bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#E8DFD0] 
          transition-all duration-300 h-16 px-4 md:px-8 flex items-center justify-between"
        >
          {/* LEFT: Fintrick Brand Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={siteConfig.logo}
                alt={siteConfig.name}
                className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02] py-0.5"
              />
            </Link>
          </div>

          {/* CENTER: Modern Minimalist Navigation */}
          <div className="hidden lg:flex items-center">
            <ul className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] text-[#292524]">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#C26D43] transition-colors py-2 relative"
                >
                  Home
                </Link>
              </li>

              {/* MEGA MENU: Categories */}
              <li
                className="relative py-2 group/mega"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#C26D43] transition-colors">
                  <span>Collections</span>
                  <span
                    className={`transition-transform duration-300 text-[10px] ${
                      isMenuOpen ? "rotate-180 text-[#C26D43]" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {/* Clean, Simple & Elegant Category Dropdown */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-[540px] max-w-[95vw] 
                  bg-[#FAF7EE] shadow-[0_20px_50px_-15px_rgba(28,25,23,0.18)] 
                  rounded-2xl border border-[#E8DFD0] p-5 transition-all duration-200 z-[120]
                  ${
                    isMenuOpen
                      ? "opacity-100 visible translate-y-1"
                      : "opacity-0 invisible translate-y-2 pointer-events-none"
                  }`}
                >
                  {/* Top Bar inside Dropdown */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8DFD0]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C26D43]">
                      Curated Wardrobe
                    </span>
                    <Link
                      to="/shop"
                      onClick={closeMenu}
                      className="text-[11px] font-bold text-[#1C1917] hover:text-[#C26D43] transition-colors"
                    >
                      View All Catalog →
                    </Link>
                  </div>

                  {/* Clean Columns Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {categories?.data?.slice(0, 2).map((cat) => (
                      <div key={cat.ID} className="space-y-2.5">
                        <Link
                          to={`/category/${cat.Slug}`}
                          onClick={closeMenu}
                          className="flex items-center gap-2 text-xs font-black text-[#1C1917] uppercase tracking-wider hover:text-[#C26D43] transition-colors pb-1 border-b border-[#E8DFD0]/60"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C26D43]" />
                          <span>{cat.CategoryName}</span>
                        </Link>

                        <ul className="space-y-1.5">
                          {cat?.subcategories?.map((sub) => (
                            <li key={sub.ID}>
                              <Link
                                to={`/category/${cat.Slug}/${sub.Slug}`}
                                onClick={closeMenu}
                                className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] hover:translate-x-1 transition-all inline-block py-0.5"
                              >
                                {sub.CategoryName}
                              </Link>
                            </li>
                          ))}
                          {(!cat?.subcategories || cat.subcategories.length === 0) && (
                            <li className="text-[11px] text-[#A8A29E] italic">
                              New styles coming soon
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Minimal Trust Strip */}
                  <div className="mt-4 pt-3 border-t border-[#E8DFD0] flex items-center justify-between text-[10px] text-[#78716C]">
                    <span>⚡ Free shipping on orders &gt; ₹799</span>
                    <span>✓ 7-Day Exchange</span>
                  </div>
                </div>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="hover:text-[#C26D43] transition-colors py-2"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-[#C26D43] transition-colors py-2"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT: Search, Wishlist, Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search"
              className="w-10 h-10 rounded-full bg-[#F3EFE6] hover:bg-[#E8DFD0] border border-[#E8DFD0] text-[#1C1917] flex items-center justify-center transition-all cursor-pointer"
            >
              <Search size={17} />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={toggleCart}
              aria-label="View Shopping Bag"
              className="relative w-10 h-10 rounded-full bg-[#F3EFE6] hover:bg-[#E8DFD0] border border-[#E8DFD0] text-[#1C1917] flex items-center justify-center transition-all cursor-pointer"
            >
              <motion.div
                key={totalItems}
                initial={{ scale: 1 }}
                animate={
                  totalItems > 0
                    ? {
                        scale: [1, 1.35, 1],
                        rotate: [0, -12, 12, -12, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                <ShoppingCart size={17} />
              </motion.div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C26D43] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div
                  ref={dropdownRef}
                  className={`dropdown dropdown-end ${isDropdownOpen ? "dropdown-open" : ""}`}
                >
                  <button
                    tabIndex={0}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-[#1C1917] text-[#FAF7EE] flex items-center justify-center border border-[#E8DFD0] shadow-sm font-bold text-xs uppercase cursor-pointer"
                  >
                    {user?.ProfileImage ? (
                      <img
                        src={getImageUrl(user.ProfileImage)}
                        alt="profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user?.Name?.charAt(0) || "U"}</span>
                    )}
                  </button>

                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-[#1C1917] text-[#FAF7EE] rounded-2xl z-[120] mt-3 w-60 p-2 shadow-2xl border border-[#292524]"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-[#292524]">
                      <p className="text-[10px] text-[#A8A29E] uppercase tracking-widest font-bold">
                        Welcome Back
                      </p>
                      <p className="text-sm font-bold text-[#FAF7EE] truncate">
                        {user?.Name || "Customer"}
                      </p>
                      <p className="text-[10px] text-[#C26D43] truncate">{user?.Email}</p>
                    </div>

                    <li>
                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="py-2.5 flex items-center gap-3 hover:bg-[#292524] rounded-xl text-[#FAF7EE]"
                      >
                        <User size={14} className="text-[#C26D43]" />
                        <span className="text-xs font-semibold">My Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/orders"
                        onClick={closeDropdown}
                        className="py-2.5 flex items-center gap-3 hover:bg-[#292524] rounded-xl text-[#FAF7EE]"
                      >
                        <Package size={14} className="text-[#C26D43]" />
                        <span className="text-xs font-semibold">My Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/wishlist"
                        onClick={closeDropdown}
                        className="py-2.5 flex items-center gap-3 hover:bg-[#292524] rounded-xl text-[#FAF7EE]"
                      >
                        <Heart size={14} className="text-[#C26D43]" />
                        <span className="text-xs font-semibold">My Wishlist</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/settings"
                        onClick={closeDropdown}
                        className="py-2.5 flex items-center gap-3 hover:bg-[#292524] rounded-xl text-[#FAF7EE]"
                      >
                        <Settings size={14} className="text-[#C26D43]" />
                        <span className="text-xs font-semibold">Settings</span>
                      </Link>
                    </li>

                    <div className="h-[1px] bg-[#292524] my-1 mx-2" />

                    <li>
                      <button
                        onClick={handleLogout}
                        className="py-2.5 flex items-center gap-3 text-[#E07A5F] hover:bg-[#292524] rounded-xl w-full"
                      >
                        <LogOut size={14} />
                        <span className="text-xs font-bold">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  to="/user-auth"
                  state={{ from: location.pathname }}
                  aria-label="Sign In"
                  className="w-10 h-10 sm:w-auto sm:px-5 py-2.5 bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <User size={16} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* ================= 3. MOBILE STICKY SEARCH BAR ================= */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-[105] bg-[#FAF7EE] px-4 py-2.5 border-b border-[#E8DFD0]">
          <div
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-3 bg-[#F3EFE6] px-4 py-2.5 rounded-full text-[#78716C] cursor-pointer border border-[#E8DFD0] active:scale-95 transition-transform"
          >
            <Search size={15} className="text-[#C26D43]" />
            <span className="text-xs font-medium">Search shirts, dresses, trousers...</span>
          </div>
        </div>

        {/* ================= 4. SEARCH DRAWER OVERLAY ================= */}
        <AnimatePresence>
          {isSearchModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchModalOpen(false)}
                className="fixed inset-0 bg-[#1C1917]/50 backdrop-blur-sm z-[190]"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed z-[200] bg-[#FAF7EE] text-[#1C1917] flex flex-col shadow-2xl inset-0 md:left-auto md:right-0 md:w-[480px] border-l border-[#E8DFD0]"
              >
                {/* Search Input Header */}
                <div className="flex items-center gap-3 p-4 border-b border-[#E8DFD0] bg-[#F3EFE6]">
                  <button
                    onClick={() => setIsSearchModalOpen(false)}
                    className="p-2 hover:bg-[#E8DFD0] rounded-full transition-colors text-[#1C1917]"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex-1 bg-[#FAF7EE] rounded-full border border-[#E8DFD0] flex items-center px-4 focus-within:border-[#C26D43] transition-all">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search apparel, linen, cottons..."
                      maxLength={100}
                      className="w-full h-11 bg-transparent focus:outline-none text-[#1C1917] text-xs font-medium placeholder-[#A8A29E]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleSearch}
                    />
                    <Search
                      size={16}
                      className={`transition-colors ${
                        searchTerm ? "text-[#C26D43]" : "text-[#A8A29E]"
                      }`}
                    />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Recent Searches */}
                    {!searchTerm && (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black uppercase text-[#78716C] tracking-widest">
                            Recent Searches
                          </p>
                          {searchHistory.length > 0 && (
                            <button
                              onClick={() => dispatch(clearHistory())}
                              className="text-[10px] uppercase font-bold text-[#C26D43] hover:underline cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {searchHistory.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {searchHistory.map((item) => (
                              <button
                                key={item}
                                onClick={() => handleSuggestionClick(item)}
                                className="px-4 py-2 rounded-full bg-[#F3EFE6] border border-[#E8DFD0] text-[#1C1917] text-xs font-semibold hover:bg-[#1C1917] hover:text-[#FAF7EE] transition-all flex items-center gap-2"
                              >
                                <HistoryIcon size={12} className="opacity-60" />
                                <span>{item}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#78716C] italic bg-[#F3EFE6] p-4 rounded-2xl text-center border border-[#E8DFD0]">
                            Search for trending apparel, shirts, dresses or cotton basics.
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Live Matching Results */}
                    {searchTerm && (
                      <motion.div
                        key="suggestions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[10px] font-black uppercase text-[#78716C] tracking-widest">
                            Matching Collections & Styles
                          </p>
                          {isSearching && (
                            <span className="loading loading-spinner loading-xs text-[#C26D43]"></span>
                          )}
                        </div>

                        {/* Matched Categories */}
                        {matchedCategories.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {matchedCategories.map((cat) => (
                              <button
                                key={`cat-${cat.ID}`}
                                onClick={() => {
                                  setIsSearchModalOpen(false);
                                  navigate(`/category/${cat.Slug}`);
                                }}
                                className="px-3 py-1.5 rounded-full bg-[#C26D43]/10 border border-[#C26D43]/30 text-[#C26D43] text-xs font-bold hover:bg-[#C26D43] hover:text-white transition-all"
                              >
                                #{cat.CategoryName}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Product Results */}
                        <div className="space-y-3">
                          {suggestions.length > 0 ? (
                            suggestions.map((product) => (
                              <div
                                key={product.ID}
                                onClick={() => {
                                  setIsSearchModalOpen(false);
                                  navigate(`/product/${product.Slug}`);
                                }}
                                className="flex items-center gap-4 p-3 hover:bg-[#F3EFE6] rounded-2xl cursor-pointer group border border-transparent hover:border-[#E8DFD0] transition-all"
                              >
                                <div className="w-14 h-16 rounded-xl bg-[#E8DFD0] overflow-hidden shrink-0 relative">
                                  <img
                                    src={getImageUrl(product.Thumbnail)}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C26D43]">
                                    {product.CategoryName || "Apparel"}
                                  </p>
                                  <p className="text-xs font-bold text-[#1C1917] truncate">
                                    {product.Title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-black text-[#1C1917]">
                                      ₹{Math.round(product.SellingPrice)}
                                    </span>
                                    {product.MRP > product.SellingPrice && (
                                      <span className="text-[10px] text-[#78716C] line-through">
                                        ₹{Math.round(product.MRP)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            !isSearching &&
                            searchTerm.length > 2 && (
                              <div className="text-center py-8">
                                <p className="text-xs font-bold text-[#1C1917]">
                                  No apparel found matching "{searchTerm}"
                                </p>
                                <p className="text-[11px] text-[#78716C] mt-1">
                                  Try searching for shirts, trousers, tops or sarees
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Height Spacers */}
        <div className="h-16 sm:h-[92px]"></div>
        <div className="h-12 lg:hidden"></div>
      </div>
    </div>
  );
}
