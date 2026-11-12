import { Routes, Route } from "react-router-dom";
import ProfileLayout from "../components/layout/ProfileLayout";
import ProfileHome from "../components/userProfile/ProfileHome";
import Orders from "../components/userProfile/order/Orders";
import Wishlist from "../components/userProfile/Wishlist";
import Address from "../components/userProfile/Address";
import Settings from "../components/userProfile/Settings";
import ProtectedRoute from "./ProtectedRoute";

export default function ProfileRoutes() {
  return (
    <Routes>
      {/* Yahan 'path' ke andar dobara /profile nahi likhna hai kyunki parent mein pehle se hai */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProfileLayout />}>
          <Route index element={<ProfileHome />} /> {/* Ye handle karega /profile */}
          <Route path="orders" element={<Orders />} /> {/* /profile/orders */}
          <Route path="wishlist" element={<Wishlist />} /> {/* /profile/wishlist */}
          <Route path="address" element={<Address />} /> {/* /profile/address */}
          <Route path="settings" element={<Settings />} /> {/* /profile/settings */}
        </Route>
      </Route>
    </Routes>
  );
}
