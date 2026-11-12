import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/auth.service";
import { setCredentials } from "./userAuth.slice";
import { cartActions } from "../cart/Cart.slice";
import { toast } from "react-hot-toast"; // 1. Toast import kiya
import cartService from "../../services/cart.service";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { items: guestItems } = useSelector((state) => state.cart);
  const queryClient = useQueryClient();

  // 1. Mutation ko define karte waqt hi logic daalo (Behtar approach)
  const { mutate: mergeCartItems } = useMutation({
    mutationFn: (items) => cartService.mergeCart(items),
    onSuccess: () => {
      // 🔥 Sabse pehle guest cart clear karo
      dispatch(cartActions.clearCart());
      // 🔥 Phir server se fresh data fetch karo
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      console.log("✅ Cart Merged and Refetched");
    },
  });
  // Mutation for Sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: (email) => authService.sendOtp(email),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully to your email.");
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(errorMsg);
    },
  });

  // Mutation for Verifying OTP
  const verifyOtpMutation = useMutation({
    mutationFn: (otpData) => authService.verifyOtp(otpData),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.access_token }));
      // 3. Merge Logic check
      if (guestItems && guestItems.length > 0) {
        mergeCartItems(guestItems); // Upar wala logic trigger hoga
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },

    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Invalid OTP. Please check and try again.";
      toast.error(errorMsg);
    },
  });

  // Mutation for Registration
  const registerMutation = useMutation({
    mutationFn: (userData) => authService.register(userData),
    onSuccess: (data) => {
      toast.success("Account created successfully! You can now log in.");
    },
    onError: (error) => {
      // Handles duplicate email/phone errors from Laravel
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    },
  });

  return { sendOtpMutation, verifyOtpMutation, registerMutation };
};
