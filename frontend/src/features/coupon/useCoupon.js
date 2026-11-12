import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { couponService } from "../../services/coupon.service";

export const useCoupon = (cartAmount, setSummary, refreshCartSummary) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 1. GET: Available Coupons List (Automatic Fetch)
  const {
    data: availableCoupons = [],
    isLoading: listLoading,
    refetch: refreshCoupons,
  } = useQuery({
    queryKey: ["availableCoupons"],
    queryFn: () => couponService.getAvailable(),
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data || [],
  });

  // 2. POST: Apply Coupon Mutation
  const applyMutation = useMutation({
    mutationFn: (code) => couponService.apply(code, cartAmount),
    onSuccess: (result, code) => {
      if (result.status) {
        // A) Coupon basic info save karo state mein
        setAppliedCoupon({
          id: result.coupon_id,
          code: code.toUpperCase(),
        });

        // B) Backend se aayi updated summary ko UI state mein set karo
        // Isse Tax, Fees aur Final Payable turant change ho jayenge
        if (result.summary) {
          setSummary(result.summary);
        }

        toast.success(result.message || "Coupon Applied!");
      } else {
        toast.error(result.message || "Invalid Coupon");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  // 3. REMOVE: Coupon hatane ka logic
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    // Jab coupon hatega, toh humein original summary (bina discount wali) wapas chahiye.
    // Iske liye hum getCart() wali API ko dobara call kar sakte hain.
    if (refreshCartSummary) {
      refreshCartSummary();
    }
    toast.dismiss();
    toast("Coupon Removed", { icon: "ℹ️" });
  }, [refreshCartSummary]);

  return {
    applyCoupon: applyMutation.mutate,
    removeCoupon,
    appliedCoupon,
    availableCoupons,
    isApplying: applyMutation.isPending,
    listLoading,
    refreshCoupons,
  };
};
