import { useQuery } from "@tanstack/react-query";
import paymentService from "../../services/payment.service";

export const usePaymentStatus = (txnId, isOpen) => {
  return useQuery({
    queryKey: ["paymentStatus", txnId],
    queryFn: () => paymentService.checkPaymentStatus(txnId),

    // 1. Sirf tab chalega jab txnId ho AUR modal khula ho
    enabled: !!txnId && isOpen, 

    refetchInterval: (query) => {
      const data = query.state.data; // React Query me data aise milta hai interval me
      
      // 2. Stop polling if success (27), failed (28), or expired (42)
      if (data?.status === 27 || data?.status === 28 || data?.status === 42) {
        return false;
      }
      
      // 3. Agar modal band ho gaya, tab bhi stop
      if (!isOpen) return false;

      return 3000; // 3 sec polling
    },
    // Window focus hone par turant fetch karega (User App switch karke wapas aaye tab)
    refetchOnWindowFocus: true, 
  });
};