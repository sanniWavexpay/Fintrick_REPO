import api from "./api";

export const addressService = {
  getAddresses: async () => {
    const { data } = await api.get("/checkout/addresses");
    return data;
  },
  
  addAddress: async (addressData) => {
    const { data } = await api.post("/checkout/address/store", addressData);
    return data;
  },

  // Update Address
  updateAddress: async (addressData) => {
    const { data } = await api.post("/checkout/address/update", addressData);
    return data;
  },

  // Remove Address
  removeAddress: async (id) => {
    const { data } = await api.post("/checkout/address/remove", { id });
    return data;
  }
};