import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const usePincode = () => {
  const [pincode, setPincode] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pincode", pincode],
    queryFn: async () => {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await res.json();
      return result[0];
    },
    enabled: shouldFetch && pincode.length === 6, // Sirf tab chalega jab hum trigger karenge
    retry: false,
    onSuccess: () => setShouldFetch(false), // Fetch hone ke baad stop
  });

  const handleCheck = () => {
    if (pincode.length === 6) {
      setShouldFetch(true);
      refetch(); // Manual trigger
    }
  };

  // Logic to determine status
  const status = isLoading ? "loading" : data?.Status === "Success" ? "valid" : data?.Status === "Error" || isError ? "invalid" : "idle";

  return { pincode, setPincode, status, handleCheck, data };
};
