import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, MapPin, Building, Hash, Home, Briefcase, Mail, AlertCircle, Flag } from "lucide-react";
import toast from "react-hot-toast";
import { useAddress } from "../../features/address/useAddress";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ProfileAddressForm({ onCancel, initialData }) {
  const { addAddress, updateAddress } = useAddress();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    // Synchronize default values with backend keys
    defaultValues: initialData || { Type: "Home" }
  });

  const watchedAddress = watch("Address") || "";
  const watchedLandmark = watch("Landmark") || "";

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // --- PINCODE AUTO-FILL LOGIC (Synced with Checkout) ---
  const watchedPincode = watch("Pincode");

  const { data: pincodeData, isFetching: isPincodeLoading } = useQuery({
    queryKey: ["pincode-lookup-profile", watchedPincode],
    queryFn: async () => {
      if (!watchedPincode || watchedPincode.length !== 6) return null;
      const res = await fetch(`https://api.postalpincode.in/pincode/${watchedPincode}`);
      const result = await res.json();
      return result[0];
    },
    enabled: watchedPincode?.length === 6,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  useEffect(() => {
    if (pincodeData?.Status === "Success" && pincodeData.PostOffice?.length > 0) {
      const details = pincodeData.PostOffice[0];
      setValue("City", details.District, { shouldValidate: true });
      setValue("State", details.State, { shouldValidate: true });
      toast.success(`Location identified: ${details.District}, ${details.State}`, {
        icon: "📍",
        style: { borderRadius: "10px", background: "#333", color: "#fff", fontSize: "12px" },
      });
    } else if (pincodeData?.Status === "Error") {
      toast.error("Invalid Pincode. Please check again.", {
        style: { borderRadius: "10px", background: "#333", color: "#fff", fontSize: "12px" },
      });
    }
  }, [pincodeData, setValue]);

  const onSubmit = async (formData) => {
    try {
      // Clean mapping logic to ensure backend compatibility
      const payload = {
        ...formData,
        Landmark: formData.Landmark || "",
      };

      if (initialData?.ID) {
        await updateAddress({ ...payload, ID: initialData.ID });
      } else {
        await addAddress(payload);
      }
      
      onCancel(); // Form close on success
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 md:p-6 rounded-[32px] border border-zinc-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] max-w-xl mx-auto overflow-hidden relative">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
      
      <div className="mb-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
          <MapPin size={18} />
        </div>
        <div>
          <h2 className="text-lg font-black text-zinc-900 uppercase tracking-tighter leading-none">
            {initialData ? "Edit Location" : "New Location"}
          </h2>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Efficient Logistics</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TYPE SELECTOR */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-[18px]">
          {["Home", "Work", "Other"].map((t) => (
            <label key={t} className="flex-1 cursor-pointer">
              <input type="radio" value={t} {...register("Type")} className="peer hidden" />
              <div className="py-2.5 rounded-[14px] transition-all duration-300 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-500 peer-checked:bg-primary peer-checked:text-white">
                {t === "Home" ? <Home size={14} /> : t === "Work" ? <Briefcase size={14} /> : <MapPin size={14} />}
                {t}
              </div>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* PERSONAL DETAILS (COMPACTED) */}
          <InputBlock
            label="Full Name"
            icon={<User size={16} />}
            error={errors.Name}
            register={register("Name", { 
              required: "Name is required",
              maxLength: { value: 50, message: "Max 50 characters" },
              pattern: { value: /^[a-zA-Z\s]{3,50}$/, message: "Valid name please" }
            })}
          />

          <InputBlock
            label="10-Digit Mobile"
            icon={<Phone size={16} />}
            error={errors.Phone}
            register={register("Phone", {
              required: "Phone is required",
              pattern: { value: /^[6-9][0-9]{9}$/, message: "Valid 10-digit number required" }
            })}
            onInput={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.startsWith("0")) val = val.substring(1);
              if (val.startsWith("91") && val.length > 10) val = val.substring(2);
              e.target.value = val.slice(0, 10);
            }}
          />

          <div className="md:col-span-2">
            <InputBlock
              label="Email Address"
              icon={<Mail size={16} />}
              error={errors.Email}
              register={register("Email", {
                required: "Email is required",
                pattern: {
                  // Strict Professional Email Regex
                  value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                  message: "Please enter a valid email address"
                }
              })}
            />
          </div>

          {/* ADDRESS DETAILS (SMART GROUPING) */}
          <InputBlock
            label="Pincode"
            icon={<Hash size={16} />}
            error={errors.Pincode}
            isLoading={isPincodeLoading}
            register={register("Pincode", {
              required: "Pincode is required",
              pattern: { value: /^[0-9]{6}$/, message: "6 digits required" }
            })}
            onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
          />

          <InputBlock
            label="City"
            icon={<Building size={16} />}
            error={errors.City}
            register={register("City", { required: "City required" })}
          />

          <div className="md:col-span-1">
            <InputBlock
              label="State"
              icon={<Flag size={16} />}
              error={errors.State}
              register={register("State", { required: "State required" })}
            />
          </div>

          <div className="md:col-span-1">
            <InputBlock
              label="Landmark (Opt)"
              icon={<MapPin size={16} />}
              error={errors.Landmark}
              maxLength={60}
              currentLength={watchedLandmark.length}
              register={register("Landmark", {
                maxLength: { value: 60, message: "Max 60 characters" }
              })}
            />
          </div>

          <div className="md:col-span-2">
            <InputBlock
              label="Detailed Address"
              icon={<Home size={16} />}
              error={errors.Address}
              maxLength={100}
              currentLength={watchedAddress.length}
              register={register("Address", { 
                required: "Address required",
                maxLength: { value: 100, message: "Max 100 characters" }
              })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-5 border-t border-zinc-50">
          <button type="button" onClick={onCancel} className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all">
            Dismiss
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] py-3.5 bg-zinc-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Wait..." : initialData ? "Update Address" : "Save Address"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// InputBlock component for standardized professional inputs
function InputBlock({ label, icon, error, register, onInput, isLoading, maxLength, currentLength }) {
  return (
    <div className="space-y-1 flex-1">
      <div className="relative flex items-center group">
        <div className={`absolute left-4 transition-all duration-300 ${error ? "text-primary" : "text-zinc-300 group-focus-within:text-zinc-950"}`}>{icon}</div>
        <input
          {...register}
          onInput={onInput}
          placeholder={label}
          className={`w-full pl-11 pr-10 py-3 bg-zinc-50/50 border-2 rounded-[18px] text-[13px] font-bold outline-none transition-all placeholder:text-zinc-300 placeholder:font-bold text-zinc-950
            ${error ? "border-primary/30 bg-primary/5 text-primary" : "border-transparent focus:border-zinc-950 focus:bg-white focus:shadow-sm"}
          `}
        />
        <div className="absolute right-4 flex items-center gap-2">
          {isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
          {maxLength && (
            <span className={`text-[9px] font-black tabular-nums transition-colors ${
              currentLength >= maxLength ? "text-primary" : "text-zinc-300"
            }`}>
              {currentLength}/{maxLength}
            </span>
          )}
          {error && <AlertCircle size={16} className="text-primary" />}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[9px] font-black text-primary uppercase tracking-widest pl-4 mt-0.5 italic">
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}