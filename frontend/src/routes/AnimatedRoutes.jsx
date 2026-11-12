import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import CheckoutPage from "../pages/Checkout";
import AuthPage from "../pages/AuthPage";
import ProfileRoutes from "./ProfileRoutes";
import ShopPage from "../pages/Shop";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import ContactUs from "../components/contact/ContactUs";
import PrivacyPolicy from "../pages/info/PrivacyPolicy";
import TermsOfService from "../pages/info/TermsOfService";
import ShippingPolicy from "../pages/info/ShippingPolicy";
import ReturnRefundPolicy from "../pages/info/ReturnRefundPolicy";
import CancellationPolicy from "../pages/info/CancellationPolicy";
import AboutUs from "../pages/info/AboutUs";
import Reviews from "../pages/info/Reviews";
import FAQ from "../pages/info/FAQ";
import PublicRoute from "./PublicRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* 🛡️ GUARD 1: Only for Guest (Login ke baad yahan entry band) */}
        <Route element={<PublicRoute />}>
          <Route path="/user-auth" element={<AuthPage />} />
        </Route>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        {/* Unified Shop & Category Routes */}
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/category/:catSlug/:subSlug?" element={<ShopPage />} />
        
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/contact-us" element={<ContactUs />} />
        
        {/* ✅ Information & Legal Pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnRefundPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />

        {/* Protected Routes (e.g. Checkout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Nested Profile Routes */}
          <Route path="/profile/*" element={<ProfileRoutes />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<ErrorPage type="404" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
