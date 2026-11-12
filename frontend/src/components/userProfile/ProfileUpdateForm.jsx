import React, { useRef } from "react";
import { User, Mail, Phone, Camera, CheckCircle, AlertCircle } from "lucide-react";
import { useProfileUser } from "../../features/userProfile/useProfileUser";
import { getImageUrl } from "../../utils/image";

const ProfileUpdateForm = () => {
  const fileInputRef = useRef(null);
  const { formData, handleInputChange, handleImageChange, previewUrl, loading, errors, handleUpdate, user } = useProfileUser();

  // Helper function to render validation icon
  const renderStatusIcon = (field, value) => {
    if (errors[field]) return <AlertCircle size={16} className="text-primary" />;
    if (value && value.length >= (field === "phone" ? 10 : 3)) {
      return <CheckCircle size={16} className="text-emerald-500" />;
    }
    return null;
  };

  return (
    <div className="max-w-xl mx-auto p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-zinc-100 bg-white">
      {/* Avatar Section remain same */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="w-32 h-32 rounded-[38%] bg-zinc-100 overflow-hidden border-4 border-white shadow-2xl transition-transform active:scale-95">
            {previewUrl ? (
              <img src={getImageUrl(previewUrl)} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50 font-bold text-2xl">
                {user?.Name?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute bottom-1 right-1 bg-zinc-900 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg group-hover:bg-black">
            <Camera size={16} />
          </div>
          <input type="file" ref={fileInputRef} hidden onChange={(e) => handleImageChange(e.target.files[0])} accept="image/*" />
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase ml-1">Account Holder Name</label>
          <div className={`flex items-center bg-zinc-50 rounded-2xl border-2 transition-all px-4 py-1 
            ${errors.fullName ? "border-primary bg-primary/5" : "border-transparent focus-within:border-zinc-900"}`}>
            <User size={18} className={errors.fullName ? "text-primary" : "text-zinc-400"} />
            <input
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              maxLength={50}
              className="w-full p-3 bg-transparent outline-none font-bold text-sm text-zinc-800"
              placeholder="Full Name"
            />
            {renderStatusIcon("fullName", formData.fullName)}
          </div>
          {errors.fullName && <p className="text-[10px] text-primary font-bold ml-2 italic">{errors.fullName}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase ml-1">Email Address</label>
          <div className={`flex items-center bg-zinc-50 rounded-2xl border-2 transition-all px-4 py-1 
            ${errors.email ? "border-primary bg-primary/5" : "border-transparent focus-within:border-zinc-900"}`}>
            <Mail size={18} className={errors.email ? "text-primary" : "text-zinc-400"} />
            <input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              maxLength={100}
              className="w-full p-3 bg-transparent outline-none font-bold text-sm text-zinc-800"
              placeholder="Email"
            />
            {renderStatusIcon("email", formData.email)}
          </div>
          {errors.email && <p className="text-[10px] text-primary font-bold ml-2 italic">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase ml-1">Phone Number</label>
          <div className={`flex items-center bg-zinc-50 rounded-2xl border-2 transition-all px-4 py-1 
            ${errors.phone ? "border-primary bg-primary/5" : "border-transparent focus-within:border-zinc-900"}`}>
            <Phone size={18} className={errors.phone ? "text-primary" : "text-zinc-400"} />
            <input
              value={formData.phone}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.startsWith("0")) val = val.substring(1);
                if (val.startsWith("91") && val.length > 10) val = val.substring(2);
                handleInputChange("phone", val.slice(0, 10));
              }}
              maxLength={13}
              className="w-full p-3 bg-transparent outline-none font-bold text-sm text-zinc-800"
              placeholder="10-Digit Mobile"
            />
            {renderStatusIcon("phone", formData.phone)}
          </div>
          {errors.phone && <p className="text-[10px] text-primary font-bold ml-2 italic">{errors.phone}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-black hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? "Please wait..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;