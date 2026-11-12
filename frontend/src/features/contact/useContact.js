import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../../services/contact.service";
import toast from "react-hot-toast";

/**
 * Custom hook to handle contact form submission
 */
export const useContactMutation = (onSuccessCallback) => {
  return useMutation({
    mutationFn: sendContactMessage,
    onSuccess: (data) => {
      toast.success(data.message || "Message sent successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    },
  });
};
