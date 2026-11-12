import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addReviewService } from "../../services/review.service";

// useReview.js
export const useAddReview = (Slug) => {
  // 🟢 slug receive karo
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReviewService,

    // Success hone par sahi wali key ko invalidate karo
    onSuccess: () => {
      toast.success("Review posted successfully!");

      // 🟢 Key ekdum same honi chahiye: ["product-detail", slug]
      queryClient.invalidateQueries({
        queryKey: ["product-detail", Slug],
      });
    },

    onError: (err) => {
      toast.error("Failed to post review");
    },
  });
};
