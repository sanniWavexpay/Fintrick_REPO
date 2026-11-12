import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { cartActions } from "./Cart.slice";
import cartService from "../../services/cart.service";
import { toast } from "react-hot-toast";

export const useCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const guestCart = useSelector((state) => state.cart.items);
  // 1️⃣ Common Summary Calculator (Reuse it everywhere)
  const getCalculatedSummary = (items) => {
    if (!items || items.length === 0) return { final_payable: 0, total_quantity: 0 };

    let totalMrp = 0,
      totalBasePrice = 0,
      totalTax = 0,
      totalQty = 0;

    items.forEach((item) => {
      const qty = Number(item.Quantity) || 1;
      totalQty += qty;
      totalMrp += (Number(item.MRP) || Number(item.Price)) * qty;
      const basePrice = Number(item.Price) * qty;
      totalBasePrice += basePrice;
      totalTax += (basePrice * (Number(item.GST) || 0)) / 100;
    });

    const platformFee = 10;
    const totalWithTax = totalBasePrice + totalTax;
    const deliveryCharge = (totalBasePrice >= 500 || totalQty === 0) ? 0 : 40;

    return {
      total_mrp: Number(totalMrp.toFixed(2)),
      total_base_price: Number(totalBasePrice.toFixed(2)),
      total_tax: Number(totalTax.toFixed(2)),
      platform_fee: platformFee,
      delivery_charge: deliveryCharge,
      bag_discount: Number((totalMrp - totalBasePrice).toFixed(2)),
      final_payable: Number((totalWithTax + platformFee + deliveryCharge).toFixed(2)),
      total_quantity: totalQty,
    };
  };
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user,
    // refetchInterval: 500,
  });

  // ✅ Data Access Fixed: Ab cartItems seedha {items: [], summary: {}} return karega
  const cartItems = useMemo(() => {
    return user ? data?.data || { items: [], summary: {} } : { items: guestCart, summary: getCalculatedSummary(guestCart) };
  }, [user, data?.data, guestCart]);

  // 1️⃣ Add to Cart (Optimistic)
  const addMutation = useMutation({
    mutationFn: cartService.addToCart,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        // Purana structure: old.data
        // Naya structure: old.data.items
        const oldItems = old?.data?.items || [];

        const existingItem = oldItems.find((item) => Number(item.product_id) === Number(newItem.product_id) && Number(item.variant_id) === Number(newItem.variant_id));

        let newItems;
        if (existingItem) {
          newItems = oldItems.map((item) =>
            item.product_id === newItem.product_id && item.variant_id === newItem.variant_id ? { ...item, Quantity: item.Quantity + (newItem.Quantity || 1) } : item,
          );
        } else {
          newItems = [...oldItems, { ...newItem, Quantity: newItem.Quantity || 1 }];
        }

        // Summary ko abhi touch mat karo, onSettled usey server se fetch kar lega
        return { ...old, data: { ...old?.data, items: newItems } };
      });

      return { previousCart };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onSuccess: () => toast.success("Added to cart!"),
    onError: (err, newItem, context) => {
      queryClient.setQueryData(["cart"], context.previousCart);
      toast.error("Failed to add item");
    },
  });

  // 2️⃣ Update Quantity (OPTIMIZED FOR SPEED)
  const updateMutation = useMutation({
    mutationFn: cartService.updateQuantity,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old?.data?.items) return old;

        // 1. Pehle saare items update karo (Quantity change)
        const updatedItems = old.data.items.map((item) => {
          const id = item.cart_id || item.ID || item.id;
          return String(id) === String(newData.cart_id) ? { ...item, Quantity: newData.Quantity } : item;
        });

        // 🔥 Shared logic use ho rahi hai yahan
        return {
          ...old,
          data: {
            ...old.data,
            items: updatedItems,
            summary: getCalculatedSummary(updatedItems),
          },
        };
      });
      return { previousCart };
    },
    // Error aane par rollback
    onError: (err, newData, context) => {
      queryClient.setQueryData(["cart"], context.previousCart);
      toast.error(err || "Updates failed!");
    },
    // Success ho ya error, server se final data fetch kar lo background mein
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Helper functions (Aapke purane wale hi chalenge)
  const addToCart = (item) => (user ? addMutation.mutate(item) : dispatch(cartActions.addToGuestCart(item)));
  const updateQty = (data) => (user ? updateMutation.mutate(data) : dispatch(cartActions.updateQuantity(data)));
  const removeItem = (id) => (user ? removeMutation.mutate(id) : dispatch(cartActions.removeItem(id)));

  // 3️⃣ Remove Item Logic (Same structured update)
  const removeMutation = useMutation({
    mutationFn: cartService.removeItem,
    onMutate: async (cart_id) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old?.data?.items) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter((item) => String(item.cart_id || item.ID) !== String(cart_id)),
          },
        };
      });
      return { previousCart };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return {
    cartItems, // Now returns { items: [], summary: {} }
    addToCart,
    updateQty,
    removeItem,
    removeItemAsync: removeMutation.mutateAsync, // Added for checkout cleanup
    isLoading,
    isAdding: addMutation.isPending,
    refetchCart: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  };
};
