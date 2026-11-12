import { useState } from "react";
import paymentService from "../../services/payment.service";
import toast from "react-hot-toast";

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const startPayment = async (orderData) => {
    setIsProcessing(true);
    try {
      const data = await paymentService.initiatePayment(orderData);
      return data;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
 
  const cancelPayment = async (txnId) => {
    try {
      const data = await paymentService.cancelPayment(txnId);
      return data;
    } catch (error) {
      console.error("Verification error", error);
      return null;
    }
  };

  return { startPayment,cancelPayment, isProcessing };
};
