import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import orderService from "../../services/order.service";
import toast from "react-hot-toast";

export const useOrder = () => {
  const queryClient = useQueryClient();

  const placeOrderMutation = useMutation({
    mutationFn: orderService.placeOrder,
    onSuccess: (response) => {
      if (response?.success) {
        // Order hone ke baad orders list ko refresh karo
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      } else {
        toast.error(response?.error || response?.message || "Order failed!");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Order placement failed!");
    },
  });

  // --- 2. Get Orders Query (Naya logic) ---
  const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useQuery({
    queryKey: ["myOrders"],
    queryFn: orderService.getMyOrders,
    select: (response) => response.data || [], // Sirf data array return karo
  });

  return {
    // For placing order
    placeOrder: placeOrderMutation.mutateAsync,
    isPlacingOrder: placeOrderMutation.isPending,
    
    // For fetching orders
    orders,
    isOrdersLoading,
    ordersError
  };
};