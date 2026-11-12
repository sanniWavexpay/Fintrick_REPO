import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { Star, Quote, CheckCircle2, Heart, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "../../config/siteConfig";

const Reviews = () => {
  const reviews = [
    { name: "Arun Sharma", rating: 5, date: "2 days ago", comment: "The fabric quality and fit of the shirts are amazing for the price. Delivered in 4 days. Highly recommended!" },
    { name: "Priya Patel", rating: 5, date: "1 week ago", comment: "Beautiful design! I bought a kurti set and the material is soft and breathable. Packaging was premium." },
    { name: "Siddharth Verma", rating: 4, date: "2 weeks ago", comment: "Great collection of streetwear and casual wear. Found exactly what I was looking for. Support was very helpful." },
    { name: "Ananya Goyal", rating: 5, date: "3 weeks ago", comment: "Really fast delivery and the clothes look exactly like the pictures. Will definitely shop again!" },
  ];

  return (
    <ModernInfoLayout 
      title="Customer Reviews" 
      subtitle={`What our community says about their ${siteConfig.name} experience`}
      icon={Star}
    >
      <div className="bg-zinc-900 text-white rounded-[40px] p-8 md:p-12 mb-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="text-center md:text-left space-y-2 shrink-0">
            <h3 className="text-5xl font-black text-primary italic leading-none">4.9 / 5</h3>
            <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-4">Verified 4.8 Rating</p>
          </div>
          <div className="h-20 w-[1px] bg-zinc-800 hidden md:block" />
          <div className="flex-1 space-y-4 w-full">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary">Our Global Reputation</h4>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
              We take pride in our 15K+ happy customers across India and abroad. Quality and trust are our core values.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.map((review, i) => (
          <InfoSection 
            key={i}
            title={review.name} 
            icon={Quote} 
            color={i % 2 === 0 ? "primary" : "blue"}
          >
            <div className="flex justify-between items-start">
               <div className="space-y-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} fill={idx < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="italic text-zinc-600 font-medium">"{review.comment}"</p>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{review.date}</p>
               </div>
            </div>
          </InfoSection>
        ))}
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-6">
        <InfoSection title="Quality Check" icon={ShieldCheck} color="green">
          <p className="text-sm">We ensure that every apparel item delivered is thoroughly checked for fabric and stitching quality before reaching you.</p>
        </InfoSection>
        <InfoSection title="Happy Hearts" icon={Heart} color="primary">
          <p className="text-sm">With thousands of verified reviews, our customer support is always here to make you smile.</p>
        </InfoSection>
      </div>
    </ModernInfoLayout>
  );
};

export default Reviews;
