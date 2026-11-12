import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ye line magic karegi: Har page change par scroll up
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // "smooth" bhi kar sakte ho, par "instant" e-com ke liye better hai
    });
  }, [pathname]); // Jab bhi path badlega, ye chalega

  return null;
}
