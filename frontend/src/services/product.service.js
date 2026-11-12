import api from "./api";

export const getProduct = async (params) => {
  try {
    const response = await api.get("/products/filter", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Product not loading";
  }
};
// 👇 Ye Detail Page ke liye SPECIFIC hai
export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`/product/${slug}`);
    console.log("first", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Product not found";
  }
};
