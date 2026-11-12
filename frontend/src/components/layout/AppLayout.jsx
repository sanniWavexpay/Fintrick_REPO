import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import MobileSidebar from "./MobileSidebar";
import { SlideOutCart } from "../common/SlideOutCart";
import { useCart } from "../../features/cart/useCart";
// 👇 Ye dono imports zaroori hain
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../features/cart/Cart.slice";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // 👇 Redux se state yahan lo (Top level par)
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const { cartItems } = useCart();
  const totalItems = cartItems?.items?.length || 0;

  const isCheckout = location.pathname === "/checkout";
  const isProduct = location.pathname.startsWith("/product");

  // 👇 Toggle function ab simple ho jayega
  const toggleCart = () => {
    dispatch(cartActions.toggleCart());
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <input id="mobile-sidebar" type="checkbox" className="drawer-toggle" />

      <Navbar toggleCart={toggleCart} />

      <main>{children}</main>

      {!isCheckout && <Footer />}

      {!isCheckout && !isProduct && (
        <MobileBottomNav
          isCartOpen={isCartOpen}
          toggleCart={toggleCart}
          totalItems={totalItems}
        />
      )}

      <MobileSidebar />

      {/* SlideOutCart ko ab Redux wali state mil rahi hai */}
      <SlideOutCart isOpen={isCartOpen} toggleCart={toggleCart} />
    </div>
  );
};

export default AppLayout;