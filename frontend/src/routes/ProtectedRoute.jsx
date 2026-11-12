import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access this page", {
        id: "protected-route-toast", // Dublicate toast rokne ke liye
      });
    }
  }, [token]);

  // Agar user login nahi hai, toh login page pe bhej do
  if (!token) {
    return <Navigate to="/user-auth" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;