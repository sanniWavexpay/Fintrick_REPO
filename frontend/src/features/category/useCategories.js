import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../../services/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"], // Cache key
    queryFn: getAllCategories, // Fetcher function
  });
};
// export const useProductsByCategory = () => {
//   // 1. Pehle URL se slugs nikalo
//   const { catSlug, subSlug } = useParams();

//   return useQuery({  
//     // 2. QueryKey mein slugs dalo (Taki slug badalne par API hit ho)
//     queryKey: ["category-products", catSlug, subSlug],

//     // 3. Service function ko params pass karo
//     queryFn: () => getProductsBySlug(catSlug, subSlug),

//     // 4. Protection: Jab tak catSlug na ho, API mat chalao
//     enabled: !!catSlug,
//   });
// };
