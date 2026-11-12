import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { AlertCircle, X } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header with Icon */}
          <div className="p-6 pb-0 flex justify-between items-start">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600">
              <AlertCircle size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-8 pt-4">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
              {title}
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-slate-50/50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationModal;
