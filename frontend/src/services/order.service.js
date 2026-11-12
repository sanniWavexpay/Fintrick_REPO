import api from "./api";

const orderService = {
  // Main Order Placement API
  placeOrder: async (orderPayload) => {
    const response = await api.post("/checkout/place-order", orderPayload);
    console.log("Order Placed:", response.data);
    return response.data;
  },

  calculateSummary: async (payload) => {
    const response = await api.post("/calculate-summary", payload);
    return response.data;
  },

  // (Optional) Order history fetch karne ke liye
  getMyOrders: async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
  },

  // 3. Cancel Order (Status 8, 9 ke liye)
  cancelOrder: async (data) => {
    // If it's pure ID, send as object. If it's FormData, send as is.
    const payload = (data instanceof FormData) ? data : { order_id: data };
    const response = await api.post("/orders/cancel-order", payload, {
      headers: (data instanceof FormData) ? { "Content-Type": "multipart/form-data" } : {}
    });
    return response.data;
  },
  cancelItem: async (data) => {
    const payload = (data instanceof FormData) ? data : { id: data };
    const response = await api.post("orders/cancel-single-item", payload, {
      headers: (data instanceof FormData) ? { "Content-Type": "multipart/form-data" } : {}
    });
    return response.data;
  },

  // 4. Return Request (Status 11 ke liye - Multipart/Form-Data)
  submitReturn: async (formData) => {
    console.log("Submitting Return Request with FormData:", [...formData.entries()]);
    const response = await api.post("/orders/return-request", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Images ke liye zaroori hai
      },
    });
    return response.data;
  },
};

export default orderService;
