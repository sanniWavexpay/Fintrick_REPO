import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../../services/product.service";

export const useProduct = (params = {}, isVisible = true) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => {
      // 1. Direct clean object banayein (Null ya empty values ko filter out karke)
      const finalParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== ""));

      console.log("🚀 Requesting with params:", finalParams);
      return getProduct(finalParams);
    },
    enabled: isVisible,
    placeholderData: (previousData) => previousData,
  });
};
