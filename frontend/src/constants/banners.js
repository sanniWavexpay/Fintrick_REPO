import shop_banner from "../assets/image/shop_banner.png";

export const BANNER_MAPPING = {
  // Main Clothing Categories
  "men": { src: shop_banner, position: "object-center" },
  "women": { src: shop_banner, position: "object-center" },
  "mens-wear": { src: shop_banner, position: "object-center" },
  "womens-wear": { src: shop_banner, position: "object-center" },
  "clothing": { src: shop_banner, position: "object-center" },

  // Subcategories (Clothing)
  "t-shirts": { src: shop_banner, position: "object-center" },
  "casual-shirts": { src: shop_banner, position: "object-center" },
  "formal-shirts": { src: shop_banner, position: "object-center" },
  "jeans": { src: shop_banner, position: "object-center" },
  "trousers": { src: shop_banner, position: "object-center" },
  "jackets-blazers": { src: shop_banner, position: "object-center" },
  "dresses": { src: shop_banner, position: "object-center" },
  "tops-tunics": { src: shop_banner, position: "object-center" },
  "kurtis-ethnic": { src: shop_banner, position: "object-center" },
  "sarees": { src: shop_banner, position: "object-center" },

  // Fallback
  "default": { src: shop_banner, position: "object-center" },
};
