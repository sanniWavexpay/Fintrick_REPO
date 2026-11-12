import api from "./api";

const paymentService = {
  // 1. Gateway se UPI_URL mangwane ke liye
  initiatePayment: async (orderData) => {
    console.log("orderDAta", orderData);

    try {
      const response = await api.post("/payment/initiate", orderData);
      console.log(response);
      return response.data; // { success: true, upi_url: "...", txn_id: "..." }
    } catch (error) {
      throw error.response?.data || "Payment initiation failed";
    }
  },

  // 2. Agar user manual check button dabaye ya polling karni ho
  checkPaymentStatus: async (txnId) => {
    try {
      const response = await api.get(`/payment/check-status/${txnId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Status check failed";
    }
  },
  cancelPayment: async (txnId) => {
    try {
      const response = await api.post("/payment/cancel", { txnId });
      return response.data;
    } catch (error) {
      console.error("Cancel error", error);
    }
  },
};

export default paymentService;
