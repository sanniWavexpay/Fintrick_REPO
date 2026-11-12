import api from "./api"; // Tumhara custom axios instance

export const addReviewService = async (formData) => {
  try {
    // Yahan 'api' use karo taaki baseURL aur interceptors (like Auth Token) automatically lag jayein
    const response = await api.post("/reviews/store", formData);
    return response.data;
  } catch (error) {
    // Wahi error handling jo tum baaki jagah use kar rahe ho
    throw error.response?.data || "Review submit nahi ho paya";
  } 
};
