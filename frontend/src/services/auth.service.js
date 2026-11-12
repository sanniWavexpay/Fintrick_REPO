import api from "./api";

export const authService = {
  // 1. Email bhejo OTP ke liye
  sendOtp: async (email) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },

  // 2. OTP verify karke token lo
  verifyOtp: async ({ email, otp }) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    console.log("response",response.data);
    return response.data; // Isme Sanctum Token milega
  },

  // 3. Naya banda register karo
  register: async (userData) => {
    console.log("userDAta", userData);
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // 4. Deactivate account
  deactivateAccount: async () => {
    const response = await api.post("/deactivate-account");
    return response.data;
  },
};
