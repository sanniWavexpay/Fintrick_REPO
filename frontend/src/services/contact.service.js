import api from "./api";

/**
 * Send contact form message to backend
 * @param {Object} formData { name, email, subject, message }
 */
export const sendContactMessage = async (formData) => {
  try {
    const response = await api.post("/contact-us", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send message. Please try again.";
  }
};
