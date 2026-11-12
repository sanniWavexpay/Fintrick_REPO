import { useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "../../services/order.service";
import toast from "react-hot-toast";

export const useOrderActions = (setSelectedOrder) => {
  const queryClient = useQueryClient();

  // =========================
  // 🔴 1. CANCEL FULL ORDER
  // =========================
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),

    // 🔥 OPTIMISTIC UPDATE (FAST UI)
    onMutate: async (data) => {
      const orderId = (data instanceof FormData) ? data.get('order_id') : data;
      if (typeof setSelectedOrder === "function") {
        setSelectedOrder((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            OrderStatus: 12, // cancelled
            items: prev.items.map((item) => ({
              ...item,
              ItemStatus: 22,
            })),
          };
        });
      }
    },

    // ✅ FINAL SYNC WITH BACKEND
    onSuccess: (response) => {
      if (response?.success) {
        toast.success("Order cancelled");
        if (typeof setSelectedOrder === "function" && response.data) {
          setSelectedOrder(response.data);
        }
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      }
    },

    onError: () => {
      toast.error("Something went wrong while cancelling order");
    },
  });

  // =========================
  // 🟠 2. CANCEL SINGLE ITEM
  // =========================
  const cancelItemMutation = useMutation({
    mutationFn: (itemId) => orderService.cancelItem(itemId),

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (data) => {
      const itemId = (data instanceof FormData) ? parseInt(data.get('id')) : data;
      if (typeof setSelectedOrder === "function") {
        setSelectedOrder((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            items: prev.items.map((item) =>
              item.ID === itemId
                ? { ...item, ItemStatus: 22 }
                : item
            ),
          };
        });
      }
    },

    onSuccess: (response) => {
      if (response?.success) {
        toast.success("Item cancelled");
        if (typeof setSelectedOrder === "function" && response.data) {
          setSelectedOrder(response.data);
        }
        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      }
    },

    onError: () => toast.error("Something went wrong"),
  });

  // =========================
  // 🔵 3. RETURN REQUEST
  // =========================
  const returnRequestMutation = useMutation({
    mutationFn: (formData) => orderService.submitReturn(formData),

    onSuccess: (response) => {
      if (response?.success) {
        toast.success("Return request submitted successfully");

        queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      } else {
        toast.error(response?.message || "Return request failed");
      }
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong while submitting return"
      );
    },
  });

  return {
    cancelOrder: cancelOrderMutation.mutateAsync,
    isCancelling: cancelOrderMutation.isPending,

    cancelItem: cancelItemMutation.mutateAsync,
    isItemCancelling: cancelItemMutation.isPending,

    submitReturn: returnRequestMutation.mutateAsync,
    isReturning: returnRequestMutation.isPending,
  };
};