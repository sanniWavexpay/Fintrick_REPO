import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"; // location ki zarurat nahi useSearchParams hai
import { useProduct } from "../features/product/useProduct";
import ShopProducts from "../components/category/ShopProducts";
import ShopFilters from "../components/category/ShopFilters";
import ShopHero from "../components/category/ShopHero";
import { BANNER_MAPPING } from "../constants/banners";
import SEO from "../components/common/SEO";
import { siteConfig } from "../config/siteConfig";
// import shop_banner from "../assets/image/shop_banner4.png";

export default function ShopPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [limit, setLimit] = useState(12);
  const { catSlug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Saare Params Query String OR URL Params se lo
  const category = catSlug || searchParams.get("category");
  const subcategory = subSlug || searchParams.get("subcategory");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort");

  // 1.1 Dynamic Banner Logic
  const bannerConfig = BANNER_MAPPING[subcategory] || BANNER_MAPPING[category] || BANNER_MAPPING["default"];
  const currentBanner = bannerConfig.src;
  const bannerPosition = bannerConfig.position;

  // Build dynamic filters object (remove null/empty values)
  const filters = Object.fromEntries(
    Object.entries({
      category,
      subcategory,
      search,
      type, // Filter by flag (Trending, New Arrival)
      sort, // Order by logic (Price, Rating)
      max_price: searchParams.get("max_price"),
      discount: searchParams.get("discount"),
      limit: limit,
    }).filter(([_, v]) => v != null && v !== "")
  );

  const { data: response, isLoading, isFetching } = useProduct(filters);

  const products = response?.data?.data || [];
  const totalCount = response?.data?.total || 0;

  // 2. Page Title Logic
  let pageTitle = "All Clothing Collections";
  let metaTitle = `Buy Trendy Apparel & Designer Clothing Online | ${siteConfig.name}`;
  let metaDescription = `Explore our exclusive collection of premium clothing, dresses, jackets, ethnic wear and casual apparel for men and women at ${siteConfig.name}. Premium quality and trending styles.`;

  // SEO Text Mapping
  const seoMapping = {
    "mens-wear": {
      title: `Buy Men’s Clothing Online | Shirts, Trousers & Jackets | ${siteConfig.name}`,
      description: `Shop the latest men’s fashion apparel at ${siteConfig.name}. Discover stylish jeans, jackets, shirts and ethnic wear perfect for every occasion.`
    },
    "t-shirts": {
      title: `Men’s T-Shirts & Polos | Casual & Graphic Tees | ${siteConfig.name}`,
      description: `Shop trendy casual t-shirts and polo shirts for men at ${siteConfig.name}. Premium fabric and stylish fits.`
    },
    "casual-shirts": {
      title: `Men’s Casual Shirts | Cotton & Linen Shirts | ${siteConfig.name}`,
      description: `Explore comfortable and trendy casual shirts for men at ${siteConfig.name}. Best prices and premium quality.`
    },
    "formal-shirts": {
      title: `Men’s Formal Shirts | Office & Business Wear | ${siteConfig.name}`,
      description: `Shop crisp formal shirts for men at ${siteConfig.name}. Look sharp and professional everyday.`
    },
    "jeans": {
      title: `Men’s Jeans & Denim | Slim, Straight & Tapered | ${siteConfig.name}`,
      description: `Find your perfect denim fit at ${siteConfig.name}. Quality stretch and comfortable denim jeans.`
    },
    "jackets-blazers": {
      title: `Men’s Jackets & Blazers | Outerwear & Layering | ${siteConfig.name}`,
      description: `Elevate your style with jackets, coats and blazers for men at ${siteConfig.name}.`
    },
    "womens-wear": {
      title: `Buy Women’s Clothes Online | Dresses, Tops & Ethnic Wear | ${siteConfig.name}`,
      description: `Explore beautiful women’s apparel at ${siteConfig.name}. Find elegant dresses, chic tops, sarees and casual wear to match your style.`
    },
    "dresses": {
      title: `Women’s Dresses & Gowns | Casual, Party & Maxi | ${siteConfig.name}`,
      description: `Discover stunning dresses for women at ${siteConfig.name}. Perfect outfits for casual outings and parties.`
    },
    "tops-tunics": {
      title: `Women’s Tops & Tunics | Stylish Blouses & Tees | ${siteConfig.name}`,
      description: `Shop chic women’s tops, shirts, and tunics online at ${siteConfig.name}.`
    },
    "kurtis-ethnic": {
      title: `Women’s Kurtis & Ethnic Wear | Festive & Daily Wear | ${siteConfig.name}`,
      description: `Embrace elegance with our women’s ethnic collection and designer kurtis at ${siteConfig.name}.`
    },
    "sarees": {
      title: `Women’s Sarees | Traditional & Modern Drapes | ${siteConfig.name}`,
      description: `Shop authentic and designer sarees for women at ${siteConfig.name}.`
    }
  };

  // 2. SEO Logic: Prioritize Subcategory Slug, then Category Slug
  const activeKey = (subcategory || category || "").toLowerCase();
  
  if (seoMapping[activeKey]) {
    metaTitle = seoMapping[activeKey].title;
    metaDescription = seoMapping[activeKey].description;
  }

  if (search) {
    // 🔥 NEW: Banner shows the Category/Subcategory name if active, or 'SEARCH RESULTS'
    if (subcategory) {
      pageTitle = subcategory.replace(/-/g, " ").toUpperCase();
    } else if (category) {
      pageTitle = category.replace(/-/g, " ").toUpperCase();
    } else {
      pageTitle = "Search Results";
    }
    metaTitle = `Search results for "${search}" | ${siteConfig.name}`;
  } else if (type === "latest") {
    pageTitle = "New Arrivals";
    metaTitle = `New Arrivals | Latest Apparel & Fashion Collection | ${siteConfig.name}`;
  } else if (type === "trending") {
    pageTitle = "Trending Now";
    metaTitle = `Trending Fashion | Popular Styles | ${siteConfig.name}`;
  } else if (type === "most_buyed") {
    pageTitle = "Best Sellers";
  } else if (subcategory) {
    pageTitle = subcategory.replace(/-/g, " ").toUpperCase();
  } else if (category) {
    pageTitle = category.replace(/-/g, " ").toUpperCase();
  }

  const handleLoadMore = () => setLimit((prev) => prev + 10);

  const handleSortChange = (sortValue) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortValue) newParams.set("sort", sortValue);
    else newParams.delete("sort");

    setSearchParams(newParams);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const sortLabels = {
    price_asc: "Price: Low to High",
    price_desc: "Price: High to Low",
    top_rated: "Top Rated",
  };
  const currentSort = searchParams.get("sort");

  return (
    <div className="bg-base-100 min-h-screen">
      <SEO title={metaTitle} description={metaDescription} />
      <ShopHero title={pageTitle || "Loading..."} subtitle={`Explore our latest collection in ${pageTitle}`} background={currentBanner} position={bannerPosition} />

      <div className="max-w-[1440px] mx-auto px-2 md:px-10 py-4 md:py-8">
        {/* --- TOP TOOLBAR (DaisyUI Integrated) --- */}
        <div className="flex items-center justify-between mb-4 md:mb-8 sticky top-[64px] bg-base-100/90 backdrop-blur-md z-30 py-3 md:py-4 border-b border-base-200">
          {/* Left: Product Count */}
          <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
            <p className="text-base-content/60 ">
              Showing <span className="text-base-content text-primary">{totalCount}</span> Products
            </p>
          </div>

          {/* Center: Mobile Filter Button */}
          <button onClick={() => setOpenFilter(true)} className="lg:hidden btn btn-white btn-sm rounded-full gap-2 px-6 uppercase tracking-widest text-[10px]">
            <SlidersHorizontal size={14} /> Filter
          </button>

          {/* Right: Sort Dropdown (DaisyUI) */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-white btn-sm rounded-xl border border-base-300 gap-2 font-bold uppercase text-[10px] tracking-widest">
              {/* Dynamic Label dikhayega: Agar kuch select hai toh wo, warna default "Sort By" */}
              {currentSort ? sortLabels[currentSort] : "Sort By"} <ChevronDown size={14} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-2xl z-[100] w-52 p-2 mt-2 shadow-2xl border border-base-200 font-bold uppercase text-[10px] tracking-widest"
            >

              <li>
                <button onClick={() => handleSortChange("price_asc")} className={`py-3 ${currentSort === "price_asc" ? "text-primary" : "text-black"}`}>
                  Price: Low to High
                </button>
              </li>
              <li>
                <button onClick={() => handleSortChange("price_desc")} className={`py-3 ${currentSort === "price_desc" ? "text-primary" : "text-black"}`}>
                  Price: High to Low
                </button>
              </li>
              <li>
                <button onClick={() => handleSortChange("top_rated")} className={`py-3 ${currentSort === "top_rated" ? "text-primary" : "text-black"}`}>
                  Top Rated
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
          {/* DESKTOP SIDEBAR (Visible only on LG) */}
          <aside className="hidden lg:block">
            <div className="sticky top-[140px]">
              <ShopFilters />
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main>
            <ShopProducts
              products={products}
              isLoading={isLoading}
              isFetching={isFetching} // Extra loader ke liye
              totalCount={totalCount}
              handleLoadMore={handleLoadMore}
            />
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER (Controlled by DaisyUI Backdrop logic via props) */}
      <ShopFilters isMobile open={openFilter} onClose={() => setOpenFilter(false)} />
    </div>
  );
}
