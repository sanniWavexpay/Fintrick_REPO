import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, Camera, Trash2, AlertCircle } from "lucide-react";
import { useOrderActions } from "../../../features/order/useOrderActions";
import toast from "react-hot-toast";

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Yes Bank",
  "Union Bank of India",
  "Canara Bank",
  "IDFC First Bank",
  "AU Small Finance Bank",
  "Bandhan Bank",
];

const ReturnModal = ({ isOpen, onClose, selectedOrder, selectedItem, type = "RETURN", setSelectedOrder }) => {
  const { submitReturn, cancelOrder, cancelItem, isReturning } = useOrderActions(setSelectedOrder);
  const isCancel = type === "CANCEL";
  
  // States
  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState([]);
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({ name: "", bankName: "", accNo: "", ifsc: "" });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageMsg, setImageMsg] = useState("");

  const isCOD = selectedOrder?.payment_mode === 49;

  const validateField = (name, value, currentImages = selectedImages) => {
    let err = "";
    switch (name) {
      case "reason":
        if (!value) err = isCancel ? "Please select a reason for cancellation" : "Please select a reason";
        break;
      case "upiId":
        if (!value) err = "UPI ID is required";
        else if (!/^[\w.-]+@[\w.-]+$/.test(value)) err = "Invalid UPI ID format";
        break;
      case "name":
        if (!value) err = "Account holder name required";
        break;
      case "bankName":
        if (!value) err = "Please select a bank";
        break;
      case "accNo":
        if (!value) err = "Account number required";
        else if (value.length < 9 || value.length > 18) err = "Must be 9–18 digits";
        break;
      case "ifsc":
        if (!value) err = "IFSC required";
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) err = "Invalid IFSC (e.g. SBIN0001234)";
        break;
      case "images":
        // Images are optional for cancellation
        if (!isCancel && currentImages.length === 0) err = "Please upload at least 1 proof image";
        break;
      default:
        break;
    }
    return err;
  };

  const handleUpdate = (field, value) => {
    if (field === "reason") setReason(value);
    else if (field === "upiId") setUpiId(value);
    else setBankDetails((prev) => ({ ...prev, [field]: value }));

    const error = validateField(field, value);
    setErrors((prev) => {
      const newErrs = { ...prev };
      if (error) newErrs[field] = error;
      else delete newErrs[field];
      return newErrs;
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let valid = [];
    let msg = "";

    files.forEach((file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/avif"];
      if (!allowedTypes.includes(file.type)) msg = "Only JPG, PNG, WEBP, AVIF allowed";
      else if (file.size > 2 * 1024 * 1024) msg = "Image must be less than 2MB";
      else valid.push(file);
    });

    if (selectedImages.length + valid.length > 6) {
      msg = "Maximum 6 images allowed";
      valid = valid.slice(0, 6 - selectedImages.length);
    }

    const newImages = [...selectedImages, ...valid];
    setSelectedImages(newImages);
    setPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
    setImageMsg(msg);
    if (newImages.length > 0) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n.images;
        return n;
      });
    }
    e.target.value = null;
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    const updated = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updated);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (updated.length === 0) {
      setErrors((prev) => ({ ...prev, images: "Please upload at least 1 proof image" }));
    }
  };

  const resetForm = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setReason("");
    setRefundMethod("upi");
    setUpiId("");
    setBankDetails({ name: "", bankName: "", accNo: "", ifsc: "" });
    setSelectedImages([]);
    setPreviews([]);
    setErrors({});
    setImageMsg("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const reasonErr = validateField("reason", reason);
    if (reasonErr) newErrors.reason = reasonErr;
    const imgErr = validateField("images", null, selectedImages);
    if (imgErr) newErrors.images = imgErr;

    if (isCOD) {
      if (refundMethod === "upi") {
        const upiErr = validateField("upiId", upiId);
        if (upiErr) newErrors.upiId = upiErr;
      } else {
        ["name", "bankName", "accNo", "ifsc"].forEach((f) => {
          const err = validateField(f, bankDetails[f]);
          if (err) newErrors[f] = err;
        });
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields ❌");
      return;
    }

    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("refund_reason", reason);
    formData.append("refund_method", refundMethod);

    if (refundMethod === "upi") formData.append("upi_id", upiId);
    else {
      formData.append("account_holder_name", bankDetails.name);
      formData.append("bank_name", bankDetails.bankName);
      formData.append("account_no", bankDetails.accNo);
      formData.append("ifsc_code", bankDetails.ifsc);
    }

    if (isCancel) {
      if (selectedItem) {
        formData.append("id", selectedItem.ID);
        await cancelItem(formData);
      } else {
        formData.append("order_id", selectedOrder.ID);
        await cancelOrder(formData);
      }
    } else {
      formData.append("order_id", selectedOrder.ID);
      formData.append("order_item_id", selectedItem.ID);
      selectedImages.forEach((img) => formData.append("images[]", img));
      await submitReturn(formData);
    }
    resetForm();
    onClose();
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] pt-0 md:pt-22 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="bg-[#0f111a] w-screen h-screen md:w-full md:max-w-lg md:h-auto md:max-h-[85vh] rounded-none md:rounded-[2rem] border-0 md:border border-white/10 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#0f111a] z-30">
            <h3 className="text-xl font-black text-white uppercase italic">{isCancel ? 'Cancel Order' : 'Return Request'}</h3>
            <button onClick={handleClose} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} id="return-form" className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 pb-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{isCancel ? 'Reason for Cancellation' : 'Reason for Return'}</label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => handleUpdate("reason", e.target.value)}
                  className={`select select-bordered select-sm w-full bg-[#0f111a] text-white border-white/10 focus:border-cyan-500 ${errors.reason ? "border-rose-500" : ""}`}
                >
                  <option value="" className="bg-[#0f111a] text-white">Select a reason</option>
                  {isCancel ? (
                    <>
                      <option value="Ordered by mistake" className="bg-[#0f111a] text-white">Ordered by mistake</option>
                      <option value="Better price elsewhere" className="bg-[#0f111a] text-white">Better price elsewhere</option>
                      <option value="Changed my mind" className="bg-[#0f111a] text-white">Changed my mind</option>
                    </>
                  ) : (
                    <>
                      <option value="Defective Product" className="bg-[#0f111a] text-white">Defective Product</option>
                      <option value="Wrong Item Received" className="bg-[#0f111a] text-white">Wrong Item Received</option>
                      <option value="Size/Fit Issue" className="bg-[#0f111a] text-white">Size/Fit Issue</option>
                    </>
                  )}
                </select>
              </div>
              {errors.reason && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.reason}</p>}
            </div>

            {!isCancel && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                Upload Proof <span className={selectedImages.length === 6 ? "text-rose-500" : "text-cyan-500"}>({selectedImages.length}/6)</span>
              </label>

              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                <label className="w-20 h-20 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 bg-[#0f111a] sticky left-0 z-10 shrink-0">
                  <Camera size={18} className="text-cyan-500 mb-1" />
                  <input type="file" multiple hidden disabled={selectedImages.length >= 6} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.webp,.avif" />
                </label>

                {selectedImages.map((img, i) => (
                  <motion.div key={i} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 relative shrink-0">
                    <img src={previews[i]} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-rose-600/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
              {errors.images && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.images}</p>}
              {imageMsg && <p className="text-[10px] text-rose-500 font-bold ml-1 animate-pulse italic">{imageMsg}</p>}
            </div>
            )}

            {/* Refund Details: Always show for cancellation if online paid, or if COD return */}
            {(!isCancel || !isCOD) && (
              <div className="pt-4 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Refund Method</p>
                <div className="flex gap-2">
                  {["upi", "bank_transfer"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRefundMethod(m)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${refundMethod === m ? "bg-cyan-500 text-black border-cyan-500" : "border-white/10 text-gray-500"}`}
                    >
                      {m.replace("_", " ")}
                    </button>
                  ))}
                </div>

                {refundMethod === "upi" ? (
                  <div className="space-y-1">
                    <input
                      placeholder="UPI ID (e.g. name@okaxis)"
                      value={upiId}
                      maxLength={100}
                      onChange={(e) => handleUpdate("upiId", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                    />
                    {errors.upiId && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.upiId}</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      placeholder="Account Holder Name"
                      value={bankDetails.name}
                      maxLength={50}
                      onChange={(e) => handleUpdate("name", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                    />
                    {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name}</p>}

                    <select
                      value={bankDetails.bankName}
                      onChange={(e) => handleUpdate("bankName", e.target.value)}
                      className={`select select-bordered w-full bg-[#0f111a] text-white border-white/10 focus:border-cyan-500 ${errors.bankName ? "border-rose-500" : ""}`}
                    >
                      <option value="" className="bg-[#0f111a] text-white">Select Bank</option>
                      {BANKS.map((b, i) => (
                        <option key={i} value={b} className="bg-[#0f111a] text-white">{b}</option>
                      ))}
                    </select>
                    {errors.bankName && <p className="text-[10px] text-rose-500 font-bold">{errors.bankName}</p>}

                    <input
                      placeholder="Account Number"
                      value={bankDetails.accNo}
                      maxLength={20}
                      onChange={(e) => handleUpdate("accNo", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                    />
                    {errors.accNo && <p className="text-[10px] text-rose-500 font-bold">{errors.accNo}</p>}

                    <input
                      placeholder="IFSC Code"
                      value={bankDetails.ifsc}
                      maxLength={15}
                      onChange={(e) => handleUpdate("ifsc", e.target.value.toUpperCase())}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                    />
                    {errors.ifsc && <p className="text-[10px] text-rose-500 font-bold">{errors.ifsc}</p>}
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="p-6 bg-[#0f111a] border-t border-white/5 z-50">
            <button
              type="submit"
              form="return-form"
              disabled={isReturning}
              className="w-full py-4 bg-[#C26D43] hover:bg-[#D47A53] rounded-2xl font-bold text-white uppercase text-xs tracking-widest active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-[#C26D43]/25"
            >
              {isReturning ? <span className="loading loading-spinner"></span> : (isCancel ? "Confirm Cancellation" : "Confirm Return")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default ReturnModal;
