import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw, ChevronRight, Tag, Bookmark, DollarSign, Percent, Search, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { useCategories } from "../../features/category/useCategories";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const discountRange = [
  { label: "Upto 10%", value: "0-10" },
  { label: "10% - 20%", value: "10-20" },
  { label: "20% - 30%", value: "20-30" },
  { label: "30% - 40%", value: "30-40" },
  { label: "Upto 60%", value: "0-60" },
  { label: "More than 60%", value: "60+" },
];
const typeOptions = [
  { label: "Trending", value: "trending" },
  { label: "Most Bought", value: "most_buyed" },
  { label: "New Arrivals", value: "latest" },
];

export default function ShopFilters({ isMobile, open, onClose }) {
  const navigate = useNavigate();
  const { catSlug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Category");
  const [subSearch, setSubSearch] = useState("");
  const [priceInput, setPriceInput] = useState(searchParams.get("max_price") || "");

  const { data: categories, isLoading } = useCategories();

  // 2. URL Query OR Path Params se current values lo
  const selectedCat = catSlug || searchParams.get("category");
  const selectedSub = subSlug || searchParams.get("subcategory");
  const selectedDiscount = searchParams.get("discount");
  const selectedSort = searchParams.get("type");
  // Dynamic Tabs Configuration for Mobile
  const mobileTabs = [
    { id: "Category", label: "Category", icon: <Tag size={18} /> },
    { id: "SubCategory", label: "Sub-Cat", icon: <Bookmark size={18} /> },
    { id: "Price", label: "Price", icon: <IndianRupee size={18} /> },
    { id: "Discount", label: "Offers", icon: <Percent size={18} /> },
  ];
  const allSubCategories = categories?.data?.flatMap((cat) => cat.subcategories) || [];
  const subCategoriesToShow = selectedCat ? categories?.data?.find((cat) => cat.Slug === selectedCat)?.subcategories || [] : allSubCategories;

  const filteredSubs = subCategoriesToShow.filter((s) => s.CategoryName.toLowerCase().includes(subSearch.toLowerCase()));

  // 4. Handle Filter Change (Clean and SEO-Friendly)
  const handleFilterChange = (key, value) => {
    const filterKey = key.toLowerCase();
    const newParams = new URLSearchParams(searchParams);

    // Agar hum Category ya Subcategory change kar rahe hain, toh PATH change hoga
    if (filterKey === "category" || filterKey === "subcategory") {
      let newCat = catSlug || searchParams.get("category");
      let newSub = subSlug || searchParams.get("subcategory");

      if (filterKey === "category") {
        if (newCat === value) {
          // Uncheck Category -> Go back to all products
          navigate("/shop?" + newParams.toString());
          return;
        } else {
          newCat = value;
          newSub = ""; // Category badli toh subcategory clear
        }
      } else if (filterKey === "subcategory") {
        if (newSub === value) {
          // Uncheck Subcategory -> Go back to parent category
          newSub = "";
        } else {
          newSub = value;
          // 🔥 NEW: Agar catSlug nahi hai (e.g. /shop se aaye ho), toh sub ke data se parentSlug nikalo
          if (!newCat || newCat === "undefined") {
            const subData = allSubCategories.find(s => s.Slug === value);
            if (subData?.parentSlug) {
              newCat = subData.parentSlug;
            }
          }
        }
      }

      // Query string se redundant category parameters hatao
      newParams.delete("category");
      newParams.delete("subcategory");

      // 🛡️ Safeguard: Kabhi bhi "undefined" string URL mein na jaye
      if (!newCat || newCat === "undefined") {
        navigate("/shop?" + newParams.toString());
        return;
      }

      // Clean Path construction
      const path = newSub ? `/category/${newCat}/${newSub}` : `/category/${newCat}`;
      const queryString = newParams.toString();
      
      navigate(queryString ? `${path}?${queryString}` : path);
    } else {
      // Baaki filters (discount, type) query string mein hi rahenge
      if (newParams.get(filterKey) === value) {
        newParams.delete(filterKey);
      } else {
        newParams.set(filterKey, value);
      }
      setSearchParams(newParams);
    }
  };
  const handlePriceFilter = (key, rawValue) => {
    const value = rawValue === "" ? "" : parseInt(rawValue, 10);

    // ❌ NaN ya negative block
    if (value !== "" && (isNaN(value) || value < 0)) return;

    // ❌ Max limit
    if (value !== "" && value > 100000) return;

    setPriceInput(rawValue);

    const newParams = new URLSearchParams(searchParams);

    if (rawValue === "") {
      newParams.delete(key); // clear
    } else {
      newParams.set(key, value);
    }

    setSearchParams(newParams);
  };
  const handleReset = () => {
    setPriceInput("");
    setSubSearch("");
    navigate("/shop");
  };
  useEffect(() => {
    const priceFromUrl = searchParams.get("max_price");
    if (!priceFromUrl) {
      setPriceInput("");
    } else {
      setPriceInput(priceFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isMobile && open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [open, isMobile]);

  return (
    <>
      {/* ================= DESKTOP VIEW ================= */}
      {!isMobile && (
        <aside className="sticky top-32 h-fit pr-4 w-[300px] hidden lg:block">
          <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                  <SlidersHorizontal size={12} />
                </div>
                <h3 className="text-primary font-bold text-xs uppercase tracking-widest">Filters</h3>
              </div>
              <button
                className="text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
                onClick={() => handleReset()}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="space-y-10">
              {/* Category */}
              <div>
                <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-5">Categories</h4>
                <div className="flex flex-col gap-4 pl-1">
                  {categories?.data?.map((cat) => (
                    <label key={cat.ID} className="flex items-center gap-3 cursor-pointer group/label">
                      <input
                        type="checkbox"
                        checked={selectedCat === cat.Slug}
                        onChange={() => handleFilterChange("category", cat.Slug)}
                        className="checkbox checkbox-xs rounded-md border-zinc-200 text-white checked:bg-primary"
                      />
                      <span className="text-[11px] font-bold text-zinc-500 group-hover/label:text-black uppercase tracking-tight">{cat.CategoryName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sub-Category Search */}
              <div>
                <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-4">{selectedCat ? "Related Sub-Category" : "All Sub-Categories"}</h4>{" "}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
                  <input
                    type="text"
                    placeholder="Search sub..."
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2.5 pl-9 pr-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-zinc-200 text-black"
                    value={subSearch}
                    onKeyDown={(e) => e.stopPropagation()} // Space/Arrow keys support
                    onChange={(e) => setSubSearch(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-3.5 pl-1 max-h-[180px] overflow-y-auto no-scrollbar">
                  {filteredSubs.map((sub) => (
                    <label key={sub.ID} className="flex items-center gap-3 cursor-pointer group/label">
                      <input
                        type="checkbox"
                        checked={selectedSub === sub.Slug} // ✅ URL se bind
                        onChange={() => handleFilterChange("subcategory", sub.Slug)}
                        // disabled={!selectedCat} // ✅ category ke bina disable
                        className="checkbox checkbox-xs rounded-md border-zinc-200 text-white checked:bg-primary disabled:opacity-40"
                      />
                      <span className="text-[11px] font-bold text-zinc-500 group-hover/label:text-black uppercase tracking-tight truncate">{sub.CategoryName}</span>
                    </label>
                  ))}
                  {filteredSubs.length === 0 && <span className="text-[10px] text-info ">No subcategory found</span>}
                </div>
              </div>
              <div className="flex flex-col gap-4 pl-1">
                <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-2">Product Sort</h4>
                {typeOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group/label">
                    <input
                      type="checkbox"
                      checked={selectedSort === opt.value}
                      onChange={() => handleFilterChange("type", opt.value)}
                      className="checkbox checkbox-xs rounded-md border-zinc-200 text-white checked:bg-primary"
                    />
                    <span className="text-[11px] font-bold text-zinc-500 group-hover/label:text-black uppercase tracking-tight">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="group">
                <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-4">Price</h4>

                {/* Custom Price Search Input */}
                <div className="relative mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px] font-bold">₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="100000"
                    placeholder="Enter Max Price..."
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl py-2.5 pl-7 pr-4 text-[11px] focus:outline-none focus:ring-1 focus:ring-zinc-200 text-black transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={priceInput}
                    onKeyDown={(e) => {
                      e.stopPropagation();

                      // ❌ invalid keys block
                      if (["-", "+", "e", "E", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => handlePriceFilter("max_price", e.target.value)}
                  />
                </div>

                {/* Active Filter Chip */}
                <AnimatePresence>
                  {priceInput && parseInt(priceInput) > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mb-4">
                      <label className="flex items-center justify-between p-2 bg-success/30 border border-success/10 rounded-lg cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked readOnly className="checkbox checkbox-xs border-success text-white checked:bg-success" />
                          <span className="text-[10px] font-bold text-success">Under ₹{priceInput}</span>
                        </div>
                        <button onClick={() => setPriceInput("")} className="text-[10px] text-zinc-400">
                          ✕
                        </button>
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* --- 4. DISCOUNT (Direct Selection) --- */}
              <div className="group mt-10">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em]">Discount</h4>
                  {/* <button className="text-[9px] font-bold text-primary uppercase">Clear</button> */}
                </div>

                <div className="flex flex-col gap-4 pl-1">
                  {discountRange.map((disc, id) => (
                    <label key={id} className="flex items-center justify-between cursor-pointer group/label">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedDiscount === disc.value}
                          onChange={() => handleFilterChange("discount", disc.value)}
                          className="checkbox checkbox-xs rounded-md border-zinc-200 text-white checked:bg-primary"
                        />
                        <span className="text-[11px] font-bold text-zinc-500 group-hover/label:text-black transition-colors uppercase tracking-tight">{disc.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ================= MOBILE VIEW (DYNAMIC DATA) ================= */}
      <AnimatePresence>
        {isMobile && open && (
          <motion.div className="fixed inset-0 bg-white z-[500] flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 -ml-2">
                  <ChevronRight className="rotate-180 text-primary" />
                </button>
                <h3 className="text-black font-bold uppercase text-sm">Filter By</h3>
              </div>
              <button onClick={handleReset} className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-500 transition-colors">
                Reset All
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-[100px] bg-zinc-50 border-r border-zinc-100 flex flex-col">
                {mobileTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-6 gap-2 border-b transition-all ${activeTab === tab.id ? "bg-white text-primary border-r-4 border-r-primary" : "text-zinc-400"
                      }`}
                  >
                    {tab.icon}
                    <span className="text-[8px] font-black uppercase">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Content Area */}
              <div className="flex-1 bg-white overflow-y-auto p-6 no-scrollbar">
                {/* Category Tab */}
                {activeTab === "Category" && (
                  <div className="flex flex-col gap-6">
                    {categories?.data?.map((cat) => (
                      <label key={cat.ID} className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-bold text-zinc-600 uppercase">{cat.CategoryName}</span>
                        <input
                          type="checkbox"
                          checked={selectedCat === cat.Slug}
                          onChange={() => handleFilterChange("category", cat.Slug)}
                          className="checkbox checkbox-md border-zinc-300 rounded-xl text-white checked:bg-primary"
                        />
                      </label>
                    ))}
                  </div>
                )}

                {/* SubCategory Tab */}
                {activeTab === "SubCategory" && (
                  <div className="flex flex-col gap-6">
                    {filteredSubs.map((sub) => (
                      <label key={sub.ID} className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-bold text-zinc-600 uppercase">{sub.CategoryName}</span>
                        <input
                          type="checkbox"
                          checked={selectedSub === sub.Slug}
                          onChange={() => handleFilterChange("subcategory", sub.Slug)}
                          className="checkbox checkbox-md border-zinc-300 rounded-xl text-white checked:bg-primary"
                        />
                      </label>
                    ))}
                    {filteredSubs.length === 0 && <p className="text-xs text-center text-zinc-400">Select a category first</p>}
                  </div>
                )}

                {/* Price Tab */}
                {/* Price Tab in Mobile */}
                {activeTab === "Price" && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Set Max Price</h4>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">₹</span>
                      <input
                        type="number"
                        className="w-full p-4 pl-10 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="E.g. 5000"
                        value={priceInput}
                        onChange={(e) => handlePriceFilter("max_price", e.target.value)}
                      />
                    </div>

                    {/* ✅ Ye hai wo Cyan Alert/Chip jo missing tha */}
                    <AnimatePresence>
                      {priceInput && parseInt(priceInput) > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="mt-4">
                          <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                              <span className="text-xs font-bold text-primary">Under ₹{priceInput}</span>
                            </div>
                            <button onClick={() => handlePriceFilter("max_price", "")} className="p-1 hover:bg-white rounded-full transition-colors">
                              <X size={14} className="text-primary" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-[10px] text-zinc-400 leading-relaxed">Prices will be filtered up to the maximum amount entered above.</p>
                  </div>
                )}
                {/* Discount Tab */}
                {activeTab === "Discount" && (
                  <div className="flex flex-col gap-6">
                    {discountRange.map((disc) => (
                      <label key={disc.value} className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-bold text-zinc-600 uppercase">{disc.label}</span>
                        <input
                          type="checkbox"
                          checked={selectedDiscount === disc.value}
                          onChange={() => handleFilterChange("discount", disc.value)}
                          className="checkbox checkbox-md border-zinc-300 rounded-xl text-white checked:bg-primary"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 pb-10 bg-white border-t flex gap-4">
              <button onClick={onClose} className="flex-1 py-4 text-[10px] text-black uppercase font-bold border rounded-2xl">
                Close
              </button>
              <button onClick={onClose} className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase rounded-2xl shadow-xl">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
