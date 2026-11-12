import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../features/auth/useAuth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { siteConfig } from "../config/siteConfig";

// Local high-res fashion assets
import loginVisual from "../assets/image/hero/couple_wear.jpg";
import registerVisual from "../assets/image/hero/womens_wear.jpg";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", otp: "" });
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();
  const origin = location.state?.from || "/";
  const { sendOtpMutation, verifyOtpMutation, registerMutation } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "deactivated") {
      toast.error("Your account has been deactivated by Admin.");
    }
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);

  const toggleAuthMode = (mode) => {
    setIsLogin(mode);
    setShowOTP(false);
    setOtpValues(new Array(6).fill(""));
    setFormData({ ...formData, otp: "" });
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    setFormData({ ...formData, otp: newOtp.join("") });
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email address.");
      return;
    }
    sendOtpMutation.mutate(formData.email, {
      onSuccess: () => {
        setShowOTP(true);
        setTimer(60);
        setCanResend(false);
      },
    });
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    sendOtpMutation.mutate(formData.email, {
      onSuccess: () => {
        setTimer(60);
        setCanResend(false);
        setOtpValues(new Array(6).fill(""));
        setFormData({ ...formData, otp: "" });
        toast.success("New verification code sent to your email!");
      },
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (formData.otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code.");
      return;
    }
    verifyOtpMutation.mutate(
      { email: formData.email, otp: formData.otp },
      {
        onSuccess: () => {
          toast.success("Welcome back to Fintrick!");
          navigate(origin, { replace: true });
        },
      }
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name || formData.name.trim().length < 3) {
      toast.error("Full Name (minimum 3 characters) is required.");
      return;
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Valid 10-digit mobile number is required.");
      return;
    }

    registerMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Account created successfully! Please login with your email.");
        setIsLogin(true);
        setShowOTP(false);
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF7EE] text-[#1C1917] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      
      {/* Ambient Warm Luxury Radial Lights */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#C26D43]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[#D4A373]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Split Authentication Card */}
      <div className="relative w-full max-w-4xl bg-white border border-[#E8DFD0] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#1C1917]/5 flex flex-col md:flex-row z-10">
        
        {/* ================= LEFT: AUTH FORM SECTION ================= */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white z-20">
          
          {/* Header & Logo */}
          <div className="mb-6 sm:mb-8 text-center md:text-left">
            <Link to="/" className="inline-block mb-3">
              {siteConfig.logo ? (
                <img src={siteConfig.logo} alt={siteConfig.name} className="h-8 sm:h-9 w-auto object-contain" />
              ) : (
                <span className="font-serif font-bold text-xl text-[#1C1917] tracking-wider uppercase">
                  {siteConfig.name}
                </span>
              )}
            </Link>

            {/* Mode Toggle Switcher (Login vs Register) */}
            {!showOTP && (
              <div className="flex items-center p-1 bg-[#F3EFE6] rounded-full border border-[#E8DFD0] max-w-xs mx-auto md:mx-0 mt-3 mb-4">
                <button
                  type="button"
                  onClick={() => toggleAuthMode(true)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isLogin
                      ? "bg-[#1C1917] text-[#FAF7EE] shadow-sm"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => toggleAuthMode(false)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    !isLogin
                      ? "bg-[#1C1917] text-[#FAF7EE] shadow-sm"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={showOTP ? "otp-header" : isLogin ? "login-header" : "register-header"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1917]">
                  {showOTP ? (
                    <>Verify <span className="text-[#C26D43] italic">Identity</span></>
                  ) : isLogin ? (
                    <>Welcome <span className="text-[#C26D43] italic">Back</span></>
                  ) : (
                    <>Join the <span className="text-[#C26D43] italic">Club</span></>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-[#78716C] mt-1 leading-relaxed">
                  {showOTP
                    ? `Enter the 6-digit verification code sent to ${formData.email}`
                    : isLogin
                    ? "Enter your email to receive a secure one-time passcode."
                    : "Create an account to track orders and save your favorites."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.form
                key={isLogin ? "login-form" : "register-form"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={isLogin ? handleSendOtp : handleRegister}
                className="space-y-4"
              >
                {/* Full Name (Registration only) */}
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        maxLength={50}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-[#F3EFE6] border border-[#E8DFD0] focus:border-[#C26D43] focus:bg-white rounded-xl text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] font-medium outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      maxLength={100}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-[#F3EFE6] border border-[#E8DFD0] focus:border-[#C26D43] focus:bg-white rounded-xl text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] font-medium outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone (Registration only) */}
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                      10-Digit Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={formData.phone}
                        maxLength={13}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.startsWith("0")) val = val.substring(1);
                          if (val.startsWith("91") && val.length > 10) val = val.substring(2);
                          setFormData({ ...formData, phone: val.slice(0, 10) });
                        }}
                        className="w-full pl-11 pr-4 py-3 bg-[#F3EFE6] border border-[#E8DFD0] focus:border-[#C26D43] focus:bg-white rounded-xl text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] font-medium outline-none transition-all"
                      />
                    </div>
                    {formData.phone && formData.phone.length > 0 && formData.phone.length < 10 && (
                      <p className="text-[9px] text-[#C26D43] font-bold pl-2 pt-0.5">
                        ⚠️ Please enter exactly 10 digits
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLogin ? sendOtpMutation.isPending : registerMutation.isPending}
                  className="w-full py-3.5 sm:py-4 bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLogin ? (
                    sendOtpMutation.isPending ? (
                      <span>Sending Code...</span>
                    ) : (
                      <>
                        <span>Send Login Code</span>
                        <ArrowRight size={14} />
                      </>
                    )
                  ) : registerMutation.isPending ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Join Fintrick</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* Bottom Assistance Link */}
                <p className="text-center text-xs text-[#78716C] pt-2">
                  {isLogin ? (
                    <>
                      New to Fintrick?{" "}
                      <button
                        type="button"
                        onClick={() => toggleAuthMode(false)}
                        className="font-bold text-[#C26D43] hover:underline cursor-pointer"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => toggleAuthMode(true)}
                        className="font-bold text-[#C26D43] hover:underline cursor-pointer"
                      >
                        Sign in here
                      </button>
                    </>
                  )}
                </p>
              </motion.form>
            ) : (
              /* ================= OTP VERIFICATION FORM ================= */
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* 6-Cell OTP Inputs */}
                <div className="flex justify-center gap-2 sm:gap-2.5">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      maxLength="1"
                      ref={(el) => (inputRefs.current[idx] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpBackspace(e, idx)}
                      className="w-10 h-13 sm:w-12 sm:h-15 bg-[#F3EFE6] border-2 border-[#E8DFD0] focus:border-[#C26D43] focus:bg-white rounded-xl text-center text-lg sm:text-xl font-black text-[#1C1917] outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyOtpMutation.isPending}
                  className="w-full py-3.5 sm:py-4 bg-[#1C1917] hover:bg-[#C26D43] text-[#FAF7EE] text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {verifyOtpMutation.isPending ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify & Enter</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* Resend Code & Back Controls */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E8DFD0]">
                  <button
                    type="button"
                    onClick={() => setShowOTP(false)}
                    className="flex items-center gap-1 text-[#78716C] hover:text-[#1C1917] font-semibold cursor-pointer"
                  >
                    <ArrowLeft size={13} />
                    <span>Change Email</span>
                  </button>

                  <div>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={sendOtpMutation.isPending}
                        className="font-bold text-[#C26D43] hover:underline cursor-pointer"
                      >
                        {sendOtpMutation.isPending ? "Resending..." : "Resend Code"}
                      </button>
                    ) : (
                      <span className="text-[#A8A29E] font-medium">
                        Resend in <span className="font-bold text-[#1C1917]">{timer}s</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ================= RIGHT: LUXURY EDITORIAL IMAGE SHOWCASE ================= */}
        <div className="hidden md:block md:w-1/2 relative bg-[#1C1917] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-bg" : "register-bg"}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={isLogin ? loginVisual : registerVisual}
                alt="Contemporary Apparel"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/90 via-[#1C1917]/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Overlay Luxury Copy */}
          <div className="relative z-20 h-full flex flex-col justify-between p-10 lg:p-12 text-[#FAF7EE]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C26D43] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8DFD0]">
                Contemporary Fashion Edit
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl lg:text-4xl font-serif leading-tight">
                Quiet luxury in <span className="italic text-[#C26D43]">earth tones</span> & breathable cottons.
              </h3>
              <p className="text-xs text-[#E8DFD0]/80 leading-relaxed font-normal">
                Discover relaxed silhouettes, resort linens, and handcrafted styles engineered for modern everyday comfort.
              </p>

              {/* Minimal Trust Strip */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-4 text-[11px] text-[#FAF7EE]/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#C26D43]" />
                  <span>Free Shipping</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <RotateCcw size={13} className="text-[#C26D43]" />
                  <span>7-Day Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
