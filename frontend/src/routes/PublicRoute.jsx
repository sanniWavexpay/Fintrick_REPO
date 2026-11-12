import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const from = location.state?.from || "/";

  // Agar user ALREADY login hai, toh use login page mat dikhao
  // Use seedha Home ya Dashboard bhej do
  if (token) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
