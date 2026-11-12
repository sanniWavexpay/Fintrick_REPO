import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "../../services/product.service";

export const useProductDetails = (slug) => {
  return useQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug, // Jab tak slug na mile, API mat maaro
    staleTime: 1000 * 60 * 5, // 5 minute tak data fresh rahega
  });
};