import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AnimatedRoutes from "./routes/AnimatedRoutes";
import { StylishLoader } from "./components/common/StylishLoader";
import AppLayout from "./components/layout/AppLayout";
import ScrollToTop from "./components/common/ScrollToTop";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import { siteConfig } from "./config/siteConfig";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(location.pathname);

  // --- Dynamic Theme & Branding Initialization ---
  useEffect(() => {
    // Apply theme globally
    document.documentElement.setAttribute("data-theme", siteConfig.theme);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // 1. Agar hum Shop ya Category ke andar hi navigate kar rahe hain, toh Loading MAT dikhao
    const isShopNavigation = 
      (currentPath.startsWith("/shop") || currentPath.startsWith("/category")) && 
      (prevPath.current.startsWith("/shop") || prevPath.current.startsWith("/category"));

    // 2. Profile ke andar bhi loading nahi chahiye
    const isInsideProfile = currentPath.startsWith("/profile") && prevPath.current.startsWith("/profile");

    if (!isShopNavigation && !isInsideProfile) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 800);
      prevPath.current = currentPath;
      return () => clearTimeout(timer);
    }
    prevPath.current = currentPath;
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      {loading && <StylishLoader />}
      <ScrollToTop /> {/* 👈 Ye sabse upar rahega */}
      <div>
        <Toaster containerStyle={{ zIndex: 10001 }} />
      </div>
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;
