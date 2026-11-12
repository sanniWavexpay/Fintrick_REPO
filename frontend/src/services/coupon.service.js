import api from "./api"; // Tumhara custom axios instance jisme Sanctum/Token set hai

// coupon.service.js (Updated with your exact routes)
export const couponService = {
  getAvailable: async () => {
    try {
      const response = await api.get("coupon/my-coupon");
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to fetch coupons";
    }
  },

  apply: async (code, cartAmount) => {
    try {
      const response = await api.get("coupon/apply-coupon", {
        params: {
          code: code,
          cart_amount: cartAmount,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Invalid Coupon";
    }
  },
};
