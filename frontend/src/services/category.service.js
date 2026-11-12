import api from "./api";

// Saari categories lane ke liye
export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Categories load nahi ho payi";
  }
};

