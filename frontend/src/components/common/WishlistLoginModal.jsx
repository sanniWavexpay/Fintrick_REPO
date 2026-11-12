import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const WishlistLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Background Image/Overlay */}
        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1556740734-7f1a62791f4b?q=80&w=1000')] bg-cover bg-center">
          <div className="flex h-full w-full items-center justify-center bg-black/40">
            <Heart size={48} className="text-white animate-pulse" fill="white" />
          </div>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Save your favorites!</h2>
          <p className="mt-2 text-gray-600">Please login to add items to your wishlist and access them from any device.</p>

          <button
            onClick={() => {
              onClose();
              navigate("/user-auth", { state: { from: location.pathname } });
            }}
            className="mt-6 w-full rounded-full bg-black py-3 font-semibold text-white hover:bg-gray-800 transition-all cursor-pointer"
          >
            Login to Continue
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onClose();
            }}
            className="mt-3 text-sm text-gray-500 hover:underline underline cursor-pointer"
          >
            Not now, just browsing
          </button>
        </div>
      </div>
    </div>
  );
};
