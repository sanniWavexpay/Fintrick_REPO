import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Phone, Mail, Home, Building2, CheckCircle2, Plus, ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { useAddress } from "../../features/address/useAddress";
import ProfileAddressForm from "./ProfileAddressForm";
import toast from "react-hot-toast";
import ConfirmationModal from "../ui/ConfirmationModal";

export default function Address() {
  const { addresses = [], isLoading, deleteAddress } = useAddress();

  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addrToDelete, setAddrToDelete] = useState(null);

  const handleEdit = (e, addr) => {
    e.stopPropagation();
    setEditData(addr);
    setIsOpenAddressForm(true);
  };
  const handleAddNew = () => {
    setEditData(null);
    setIsOpenAddressForm(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setAddrToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!addrToDelete) return;
    try {
      await deleteAddress(addrToDelete);
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Could not delete");
    } finally {
      setIsDeleteModalOpen(false);
      setAddrToDelete(null);
    }
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

  if (isLoading) return <div className="p-10 text-center font-black uppercase tracking-widest text-slate-300 animate-pulse">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Saved Addresses</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addresses.length} Locations Saved</p>
        </div>
        <button
          onClick={isOpenAddressForm ? () => setIsOpenAddressForm(false) : handleAddNew}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${isOpenAddressForm ? "bg-slate-100 text-slate-500" : "bg-black text-white shadow-xl shadow-slate-200"
            }`}
        >
          {isOpenAddressForm ? (
            <>
              <ArrowLeft size={14} /> Back
            </>
          ) : (
            <>
              <Plus size={14} /> Add New
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isOpenAddressForm ? (
          <motion.div key="list" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => {
              const Icon = getIcon(addr.Type);
              const isSelected = selectedAddrId === addr.ID;
              return (
                <label key={addr.ID} className="cursor-pointer group block w-full" onClick={() => setSelectedAddrId(addr.ID)}>
                  <input type="radio" name="address" className="peer hidden" checked={isSelected} readOnly />
                  <div
                    className="relative p-5 rounded-[32px] border-2 border-slate-100 bg-white
                    transition-all duration-300
                    peer-checked:border-green-500
                    peer-checked:bg-green-50/20
                    peer-checked:shadow-[0_15px_40px_-15px_rgba(34,197,94,0.15)]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm transition-colors ${isSelected ? "bg-green-500 text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        <Icon size={12} /> {addr.Type}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full bg-green-500 text-white shadow-sm">
                          SELECTED <CheckCircle2 size={12} />
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <User size={14} className="text-primary" />
                        {addr.Name}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <p className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                          <Phone size={13} className="text-accent" />
                          {addr.Phone}
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                          <Mail size={13} className="text-success" />
                          {addr.Email}
                        </p>
                      </div>
                      <div className="relative pl-8 mt-2">
                        <MapPin size={14} className="absolute left-0 top-1 text-warning shrink-0" />
                        <span
                          className="block line-clamp-2 break-words text-[11px] font-bold text-slate-600 leading-relaxed"
                          title={`${addr.Address}, ${addr.City}, ${addr.State} - ${addr.Pincode}`}
                        >
                          {addr.Address}, {addr.City}, {addr.State} - <b className="text-slate-900">{addr.Pincode}</b>
                        </span>
                      </div>
                    </div>

                    {/* MINI ACTIONS */}
                    <div className="absolute bottom-1 right-6 flex gap-1">
                      <button
                        onClick={(e) => handleEdit(e, addr)}
                        className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:text-black hover:bg-white hover:shadow-md transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, addr.ID)}
                        className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-md transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </label>
              );
            })}
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <ProfileAddressForm initialData={editData} onCancel={() => setIsOpenAddressForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Address?"
        message="Are you sure you want to remove this address from your saved locations?"
        confirmLabel="Delete"
        cancelLabel="Keep It"
      />
    </motion.div>
  );
}
