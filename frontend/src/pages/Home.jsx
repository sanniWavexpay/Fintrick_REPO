import Hero from "../components/home/Hero";
import { BrandTrust } from "../components/home/BrandTrust";
import NewArrivals from "../components/home/NewArrivals";
import TrandingSection from "../components/home/TrandingSection";
import BestSeller from "../components/home/BestSeller";

const Home = () => {
  return (
    <div className="bg-[#FAF7EE] min-h-screen">
      {/* 1. Hero Spotlight Showcase */}
      <Hero />

      {/* 2. Top Priority: Fresh Off The Rack / New Arrivals */}
      <NewArrivals />

      {/* 3. Trending Drops / Trending Now */}
      <TrandingSection />

      {/* 4. Customer Favorites / Best Sellers */}
      <BestSeller />

      {/* 5. Brand Trust & Customer Guarantees */}
      <BrandTrust />
    </div>
  );
};

export default Home;
