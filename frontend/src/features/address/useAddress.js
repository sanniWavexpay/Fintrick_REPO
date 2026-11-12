import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addressService } from "../../services/address.service";

export const useAddress = () => {
  const queryClient = useQueryClient();

  // GET
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.getAddresses,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // Reuse the address from cache for 5 minutes
  });

  // ADD
  const addMutation = useMutation({
    mutationFn: addressService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added!");
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: addressService.updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address updated!");
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: addressService.removeAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address removed!");
    },
  });

  return {
    addresses,
    isLoading,
    addAddress: addMutation.mutateAsync,
    updateAddress: updateMutation.mutateAsync,
    deleteAddress: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
