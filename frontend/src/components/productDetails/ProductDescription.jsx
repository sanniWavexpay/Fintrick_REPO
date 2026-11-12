import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductDescription = ({ apiData }) => {
  const [showAll, setShowAll] = useState(false);

  // Agar backend se HTML aa raha hai (Image 3 jaisa)
  return (
    <div className="border-t border-zinc-100 py-8">
      <h3 className="text-[16px] font-bold text-black mb-4">Product Details</h3>

      {/* Long Description (Grid ya List) */}
      <div className={`overflow-hidden transition-all duration-500 ${showAll ? "max-h-[2000px]" : "max-h-[200px]"}`}>
        <div
          className="prose prose-sm max-w-none text-[12px]" // Tailwind Typography plugin use karein
          dangerouslySetInnerHTML={{ __html: apiData }}
        />
      </div>

      <button onClick={() => setShowAll(!showAll)} className="text-blue-600 font-bold text-[12px] mt-4">
        {showAll ? "Show Less" : "View all details"}
      </button>
    </div>
  );
};

export default ProductDescription;
