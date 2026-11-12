import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import ProfileUpdateForm from "./ProfileUpdateForm";
import SEO from "../common/SEO";
import { siteConfig } from "../../config/siteConfig";

export default function ProfileHome() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center"
    >
      <SEO 
        title={`My Profile | Manage Your Account | ${siteConfig.name}`} 
        description={`View and manage your personal details, addresses, and account settings easily on your ${siteConfig.name} profile.`} 
      />
      {/* --- Profile Header Section --- */}
      <div className="w-full max-w-2xl">
        <header className="mb-3 text-center relative">
          {/* Decorative Background Element */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-100/50 blur-3xl rounded-full -z-10" />

          <h1 className="text-2xl font-black uppercase  tracking-[0.03em] text-slate-900">
            My Profile
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p className="text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">
              Verified Account Details
            </p>
          </div>
        </header>

        {/* --- Modern Form Wrapper --- */}
        <div className=" md:rounded-[40px] transition-all">
          <ProfileUpdateForm />
        </div>

        {/* --- Bottom Note (Optional but looks Pro) --- */}
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
            {siteConfig.name} Security • 2026
          </p>
        </footer>
      </div>
    </motion.div>
  );
}