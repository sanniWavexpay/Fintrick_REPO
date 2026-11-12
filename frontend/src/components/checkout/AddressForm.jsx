import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Phone, Home, Building, MapPin, Briefcase, Hash, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

const AddressForm = ({ onCancel, onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      addressType: "home",
    },
  });
  const { user } = useSelector((state) => state.auth);

  // --- PINCODE AUTO-FILL LOGIC ---
  const watchedPincode = watch("pincode");

  const { data: pincodeData, isFetching: isPincodeLoading } = useQuery({
    queryKey: ["pincode-lookup", watchedPincode],
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
      setValue("city", details.District, { shouldValidate: true });
      setValue("state", details.State, { shouldValidate: true });
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
  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-zinc-100 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
        {/* ADDRESS TYPE */}
        <div className="space-y-2">
          <div className="flex gap-2">
            {["Home", "Work", "Other"].map((type) => (
              <label key={type} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  value={type.toLowerCase()}
                  {...register("addressType", {
                    required: "Please select an address type",
                  })}
                  className="peer hidden"
                />

                <div
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 font-bold text-[10px] uppercase
                  ${errors.addressType ? "border-error bg-error/5 text-error" : "border-zinc-100 bg-zinc-50 text-zinc-400"}
                  peer-checked:border-green-500
                  peer-checked:bg-green-500/5
                  peer-checked:text-green-500`}
                >
                  {type === "Home" ? <Home size={18} /> : type === "Work" ? <Briefcase size={18} /> : <MapPin size={18} />}
                  {type}
                </div>
              </label>
            ))}
          </div>

          {errors.addressType && <p className="text-[10px] text-error font-bold italic px-2">⚠️ {errors.addressType.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FULL NAME */}
          <div className="form-control">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2
              ${errors.fullName ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <User size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="Full Name"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s,\-\/]/g, "");
                }}
                {...register("fullName", { required: "Name is required" })}
              />
            </label>

            {errors.fullName && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.fullName.message}</span>}
          </div>

          {/* Email */}
          <div className="form-control">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2
              ${errors.email ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <Mail size={18} className="opacity-50" />

              <input
                {...register("email")}
                defaultValue={user?.Email || ""}
                type="email" // Type email rakho taaki mobile keyboard @ dikhaye
                placeholder="Please Enter Email"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    // Standard Email Regex
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </label>

            {errors.email && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.email.message}</span>}
          </div>

          <div className="form-control">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2
              ${errors.phone ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <Phone size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="10-Digit Mobile"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^[6-9][0-9]{9}$/,
                    message: "Valid 10-digit number required",
                  },
                })}
                onInput={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.startsWith("0")) val = val.substring(1);
                  if (val.startsWith("91") && val.length > 10) val = val.substring(2);
                  e.target.value = val.slice(0, 10);
                }}
              />
            </label>

            {errors.phone && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.phone.message}</span>}
          </div>

          {/* PINCODE (Reordered First) */}
          <div className="form-control">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2
              ${errors.pincode ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <Hash size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="Pincode"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                {...register("pincode", {
                  required: "Pincode required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "6 Digits only",
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                }}
              />
              {isPincodeLoading && <Loader2 size={16} className="animate-spin text-primary" />}
            </label>

            {errors.pincode && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.pincode.message}</span>}
          </div>

          {/* CITY (Reordered Second) */}
          <div className="form-control">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2
              ${errors.city ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <Building size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="City"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                {...register("city", { required: "City required" })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                }}
              />
            </label>

            {errors.city && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.city.message}</span>}
          </div>

          {/* STATE (Reordered Third) */}
          <div className="form-control">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2
              ${errors.state ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <Building size={18} className="opacity-50" />

              <input
                type="text"
                placeholder="State"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                {...register("state", { required: "State required" })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                }}
              />
            </label>

            {errors.state && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.state.message}</span>}
          </div>

          {/* ADDRESS (Detailed) */}
          <div className="form-control md:col-span-2 w-full">
            <label
              className={`input input-bordered rounded-xl flex items-center gap-2 bg-zinc-50 border-2 w-full
              ${errors.address ? "border-error focus-within:border-error" : "border-success focus-within:border-success"}`}
            >
              <input
                type="text"
                placeholder="House No / Street / Area"
                className="grow text-black font-medium focus:outline-none focus:ring-0"
                maxLength={100}
                {...register("address", { 
                  required: "Address required",
                  maxLength: { value: 100, message: "Max 100 characters" }
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s,\-\/]/g, "").slice(0, 100);
                }}
              />
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold tabular-nums ${watch("address")?.length >= 100 ? "text-error" : "text-zinc-300"}`}>
                  {watch("address")?.length || 0}/100
                </span>
                <Home size={18} className="opacity-50" />
              </div>
            </label>

            {errors.address && <span className="text-[10px] text-error font-bold mt-1 px-2 italic uppercase">{errors.address.message}</span>}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onCancel} className="btn btn-ghost rounded-2xl flex-1 font-bold">
            CANCEL
          </button>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary rounded-2xl flex-[2] font-black tracking-widest shadow-lg shadow-primary/20">
            {isSubmitting ? "SAVING..." : "SAVE ADDRESS"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
