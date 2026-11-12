import api from "./api";

const userProfileService = {
  updateProfile: async (formData) => {
    const response = await api.post("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default userProfileService;