import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    Accept: "application/json",
    'ngrok-skip-browser-warning': 'true'
  },
});

// 1. Request Interceptor (Jo aapne likha hai, ek dum sahi hai)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (config.url.includes("/cart/merge")) {
    console.warn("🔍 MERGE CALL TRACE:");
    console.trace();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor (Combined 401 and 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session Expired (Unauthorized)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/user-auth";
    }

    // Account Deactivated (Forbidden)
    if (error.response && error.response.status === 403) {
      const message = error.response.data.message || "Your account is no longer active.";
      // Note: window.location se pehle toast shayad hi dikhe kyunki page refresh ho jata hai
      // Isliye hum logout logic handle kar rahe hain
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Redirect with a query param to show message on login page
      window.location.href = "/user-auth?status=deactivated";
    }

    return Promise.reject(error);
  },
);
export default api;
