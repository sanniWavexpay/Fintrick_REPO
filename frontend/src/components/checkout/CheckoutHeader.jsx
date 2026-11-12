import { ArrowLeft,Lock } from "lucide-react";

export const CheckoutHeader = () => (
  <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-zinc-100 py-6 px-6 md:px-20 flex justify-between items-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white  shadow-lg">
        <ArrowLeft size={16} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Back to Store</span>
    </div>
    <h1 className="text-2xl font-black  tracking-tighter uppercase bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Secure Checkout</h1>
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full">
      <Lock size={14} className="text-black" />
      <span className="text-[9px] font-black uppercase tracking-widest">256-bit SSL</span>
    </div>
  </div>
);
