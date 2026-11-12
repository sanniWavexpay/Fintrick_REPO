import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, ShieldCheck, Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { logout } from "../../features/auth/userAuth.slice";
import toast from "react-hot-toast";
import ConfirmationModal from "../ui/ConfirmationModal";
import SEO from "../common/SEO";
import { siteConfig } from "../../config/siteConfig";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    try {
      await authService.deactivateAccount();
      toast.success("Account deactivated. Logging out...");
      dispatch(logout());
      navigate("/user-auth?status=deactivated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate account");
      setIsDeactivating(false);
      setIsModalOpen(false);
    }
  };
  return (
    <motion.div 
      key="settings" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 max-w-xl mx-auto"
    >
      <SEO 
        title={`Account Settings | Manage Preferences | ${siteConfig.name}`} 
        description={`Update your account settings, notifications, and preferences easily on ${siteConfig.name} for a better shopping experience.`} 
      />
      <header>
        <h1 className="text-2xl font-black font-bold text-slate-900 uppercase ">Settings</h1>
        <p className="text-slate-400 font-medium mt-1 text-sm">Manage your security and preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Toggle Option: Notifications */}
        <div className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[30px] transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <Bell size={20} />
            </div>
            <div>
              <h4 className="text-slate-800 font-bold">Email Notifications</h4>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Receive updates about orders</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-purple-600 rounded-full relative p-1 cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
          </div>
        </div>

        {/* Security Section */}
        {/* <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[35px] space-y-6">
          <div className="flex items-center gap-3 text-slate-800 font-black uppercase text-sm mb-2">
            <ShieldCheck size={20} className="text-purple-500" />
            <span>Security & Password</span>
          </div>
          
          <div className="space-y-4">
            <DashboardInput label="Current Password" type="password" placeholder="••••••••" />
            <DashboardInput label="New Password" type="password" placeholder="Enter new password" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl font-black text-white shadow-xl shadow-slate-200 uppercase tracking-widest text-[11px] mt-4"
          >
            Update Security
          </motion.button>
        </div> */}

        {/* Danger Zone */}
        <div className="flex items-center justify-between p-6 bg-red-50/30 border border-red-100 rounded-[30px]">
          <div>
            <h4 className="text-red-500 font-bold">Delete Account</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Permanently remove your data</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            Deactivate
          </button>
        </div>
      </div>

      {/* Modern Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => !isDeactivating && setIsModalOpen(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Account?"
        message="This will permanently disable your account and log you out. You'll need to contact support to reactivate."
        confirmLabel="Deactivate NOW"
        cancelLabel="Keep My Account"
        isLoading={isDeactivating}
      />
    </motion.div>
  );
};

// Reusable Input Component (Aap isse alag file mein bhi rakh sakte hain)
const DashboardInput = ({ label, type, placeholder }) => (
  <div className="space-y-2.5">
    <label className="text-[10px] text-slate-400 uppercase font-black tracking-[0.15em] ml-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-white border border-slate-100 rounded-[20px] px-6 py-4 text-slate-700 font-bold focus:border-purple-400 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all shadow-sm placeholder:text-slate-300 text-sm"
    />
  </div>
);

export default Settings;