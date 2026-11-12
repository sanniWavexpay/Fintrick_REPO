import api from "./api";

const wishlistService = {
  getWishlist: async () => {
    const response = await api.get("/wishlist");
    console.log(
      "wishlist",response.data
    );
    
    return response.data;
  },
  toggleWishlist: async (productId) => {
    const response = await api.post("/wishlist/toggle", { product_id: productId });
    return response.data;
  },
};
export default wishlistService;