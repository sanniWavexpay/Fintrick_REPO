import api from "./api"; // Aapka Axios instance (Sanctum/Interceptors ke saath)

const cartService = {
  // 1. User ka pura cart fetch karne ke liye
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data; // Backend ka success true, data: [] return hoga
    } catch (error) {
      // Laravel se aane wala error message ya default message
      throw error.response?.data?.message || "Cart load nahi ho payi";
    }
  },

  // 2. Naya item add karne ke liye
  addToCart: async (cartData) => {
    try {
      const response = await api.post("/cart/add", cartData);
      console.log("response",response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Product add nahi ho paya";
    }
  },

  // 3. Quantity update (Plus/Minus) ke liye
  updateQuantity: async (data) => {
    console.log("hello",data);
    try {
      const response = await api.post("/cart/update-quantity", data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Quantity update fail ho gayi";
    }
  },

  // 4. Item remove karne ke liye
  removeItem: async (cartId) => {
    try {
      const response = await api.delete(`/cart/remove/${cartId}`);
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Item remove nahi ho paya";
    }
  },

  // 5. Login ke baad Guest Cart ko DB se merge karne ke liye
  mergeCart: async (items) => {
    try {
      const response = await api.post("/cart/merge", { items });
      console.log("merged  data",response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Cart merge fail ho gaya";
    }
  }
};

export default cartService;