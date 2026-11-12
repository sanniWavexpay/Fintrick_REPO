import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wishlistService from "../../services/wishlist.service";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  // 1. Fetch Wishlist Query
  const { data: wishlistResponse, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: !!user, 
  });

  const wishlistItems = wishlistResponse?.data || [];

  const toggleWishlistMutation = useMutation({
    mutationFn: (productId) => wishlistService.toggleWishlist(productId),

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old) => {
        const currentItems = old?.data || [];
        const exists = currentItems.some((item) => Number(item.ID) === Number(productId));

        let newData;
        if (exists) {
          newData = currentItems.filter((item) => Number(item.ID) !== Number(productId));
          toast.success("Removed from Wishlist");
        } else {
          newData = [...currentItems, { ID: productId }];
          toast.success("Added to Wishlist ❤️");
        }
        return { ...old, data: newData };
      });
      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(["wishlist"], context.previousWishlist);
      toast.error("Network error: Could not update wishlist");
    },

    // 5. Success ho ya Error, last mein server se fresh data sync kar lo
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
  // 3. Helper: Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => Number(item.ID) === Number(productId));
  };

  return {
    wishlistItems,
    isLoading,
    toggleWishlist: toggleWishlistMutation.mutate,
    isInWishlist,
  };
};
