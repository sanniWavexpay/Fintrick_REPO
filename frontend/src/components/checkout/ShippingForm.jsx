import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, MapPin, Phone, User, Home, Building2, Hash, Building, Mail } from "lucide-react";
import { Button } from "../common/Button";
import AddressForm from "./AddressForm";
import { useAddress } from "../../features/address/useAddress";
import toast from "react-hot-toast";

export const ShippingForm = ({ setStep, selectedAddrId, setSelectedAddrId }) => {
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);
  const [editData, setEditData] = useState(null); // Edit ke liye state
  const { addresses, addAddress, updateAddress, deleteAddress, isLoading } = useAddress();
  // Baaki logic same rahega... bas Continue button par validation laga dena
  const handleContinue = () => {
    if (!selectedAddrId) {
      toast.error("Please select a delivery address");
      return;
    }
    setStep(2);
  };
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "home":
        return Home;
      case "work":
        return Building2;
      default:
        return MapPin;
    }
  };

  // 3. Selected Address Type nikalne ke liye logic fix
  const selectedType = addresses?.find((a) => a.ID === selectedAddrId)?.Type || "None";
  console.log("selectedType", selectedType);

  const handleSaveNewAddress = async (formData) => {
    const finalAddressData = {
      Type: formData.addressType,
      Name: formData.fullName,
      Email: formData.email, // Added missing email field
      Phone: formData.phone,
      Pincode: formData.pincode,
      Address: formData.address,
      State: formData.state,
      City: formData.city,
      Landmark: formData.landmark || "",
    };

    try {
      await addAddress(finalAddressData);
      setIsOpenAddressForm(false);
    } catch (error) {
      console.error("Mutation failed", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-8">
        {!isOpenAddressForm && (
          <div className="md:hidden flex justify-between items-center mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 animate-pulse">Swipe ({addresses?.length || 0}) ➔</p>
            <div className="badge badge-outline text-black border-zinc-300 font-bold text-[9px] uppercase py-3">Selected: {selectedType}</div>
          </div>
        )}

        <div className="flex overflow-x-auto no-scrollbar pb-4 gap-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:gap-6">
          {!isOpenAddressForm &&
            (addresses || []).map((addr) => {
              const Icon = getIcon(addr.Type); // Dynamic Icon
              return (
                <label key={addr.ID} className="cursor-pointer group shrink-0 w-[100%] md:w-full" onClick={() => setSelectedAddrId(addr.ID)}>
                  {/* ID bind kiya check ke liye */}
                  <input type="radio" name="address" className="peer hidden" checked={selectedAddrId === addr.ID} readOnly />
                  <div
                    className="relative p-4 rounded-3xl border-2 border-zinc-200 bg-white
                    transition-all duration-300
                    peer-checked:border-success
                    peer-checked:bg-gradient-to-br peer-checked:from-white peer-checked:to-zinc-50
                    peer-checked:shadow-[0_10px_50px_-20px_rgba(34,197,94,0.2)]"
                  >
                    {/* TYPE BADGE - Bind with addr.Type */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow bg-slate-500 text-white transition-colors group-has-[:checked]:bg-success">
                        <Icon size={12} /> {addr.Type}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] opacity-0 font-black tracking-widest px-3 py-1 rounded-full shadow bg-success text-white transition-all group-has-[:checked]:opacity-100">
                        DELIVER HERE <CheckCircle2 size={12} />
                      </span>
                    </div>

                    {/* Bind with Capital keys from API */}
                    <p className="text-sm font-black text-zinc-900 flex items-center gap-2">
                      <User size={14} className="text-pink-500" />
                      {addr.Name}
                    </p>
                    <p className="text-xs font-bold text-zinc-600 mt-2 flex items-center gap-2">
                      <Phone size={14} className="text-blue-500" />
                      {addr.Phone}
                    </p>
                    <p className="text-xs font-bold text-zinc-600 mt-2 flex items-center gap-2">
                      <Mail size={14} className="text-blue-500" />
                      {addr.Email}
                    </p>
                    <p className="text-[12px] font-bold text-zinc-700 mt-1 leading-relaxed flex items-start gap-2">
                      <MapPin size={14} className="text-purple-500 mt-0.5" />
                      {addr.Address}, {addr.City}, {addr.State} - {addr.Pincode}
                    </p>
                  </div>
                </label>
              );
            })}
        </div>
        {!isOpenAddressForm && (
          <button
            onClick={() => setIsOpenAddressForm(true)}
            className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed 
                border-zinc-300 bg-gradient-to-br from-zinc-50 to-zinc-100
                hover:border-pink-500 text-black hover:text-pink-600 transition-all"
          >
            <Plus size={24} className="mb-2 text-pink-500" />
            <span className="text-[10px] text-black uppercase tracking-widest">Add New Address</span>
          </button>
        )}
        {/* ADD ADDRESS FORM - Mobile par Drawer, Desktop par Normal */}
        <AnimatePresence>
          {isOpenAddressForm && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="
                  fixed inset-0 z-[400] bg-white
                  overflow-y-auto p-3 md:p-8
                  md:relative md:inset-auto md:z-0
                  md:rounded-3xl md:border-2 md:border-zinc-200 md:mt-6
                "
            >
              {/* Mobile Handle Bar (Indication for drawer) */}
              <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setIsOpenAddressForm(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
              <h2 className="text-xl text-black font-bold uppercase tracking-[0.1rem] mb-6">Add New Address</h2>
              <AddressForm
                onCancel={() => setIsOpenAddressForm(false)}
                onSubmit={handleSaveNewAddress} // Seedha onSubmit pass karo
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* CONTINUE BUTTON - Always at the bottom (Desktop) */}
      {!isOpenAddressForm && (
        <div className="mt-10 pt-6 border-t border-zinc-100 hidden md:block">
          <Button
            label={selectedAddrId ? "Confirm Address" : "Select Address"}
            variant="primary"
            size="lg"
            // 1. Agar address select nahi hai toh disable kar do
            disabled={!selectedAddrId}
            // 2. Styling ko state ke hisaab se toggle karo
            className={`w-full transition-all duration-300  ${!selectedAddrId ? "opacity-50 cursor-not-allowed grayscale shadow-none" : "shadow-xl shadow-pink-100 active:scale-95 cursor-pointer"
              }`}
            onClick={handleContinue}
          />

          {/* Helper text taaki user ko pata chale kyu band hai */}
          {!selectedAddrId && <p className="text-[9px] text-center mt-3 font-bold text-zinc-400 uppercase tracking-widest">Please select a delivery address to continue</p>}
        </div>
      )}
    </div>
  );
};
