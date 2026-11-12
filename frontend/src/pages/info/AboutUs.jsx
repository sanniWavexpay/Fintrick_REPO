import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { Heart, Target, ShieldCheck, Zap, Package, Mail, Phone, MapPin, User, Sparkles, Award, TrendingUp, Smile, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const AboutUs = () => {
  const whyChooseUs = [
    { icon: Sparkles, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", title: "Trendy & Latest Collections", desc: "Stay ahead with our curated fashion collections for Men & Women — bold statement pieces and everyday essentials, all in one place." },
    { icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", title: "Affordable Prices", desc: "Premium style shouldn't cost a fortune. We offer competitive pricing designed for everyone." },
    { icon: Package, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", title: "Fast & Reliable Delivery", desc: "Our trusted logistics partners ensure your order reaches you safely and on time, every time." },
    { icon: Smile, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", title: "Customer Satisfaction First", desc: "From browsing to checkout, we aim to provide the smoothest and most hassle-free shopping experience." },
  ];

  return (
    <ModernInfoLayout
      title="About Us"
      subtitle={`Learn more about ${siteConfig.name} — Where Style Meets Smart Shopping`}
      icon={Award}
    >
      <SEO
        title={`About ${siteConfig.name} | Premium Fashion & Apparel Store`}
        description={`Know more about ${siteConfig.name}. We offer quality clothing for men and women, affordable prices, and a smooth online shopping experience across India.`}
      />
      {/* ── BRAND NOTICE ─────────────────────────────────── */}
      <div className="flex items-start gap-4 p-5 mb-6 bg-gradient-to-r from-primary/10 via-amber-50/50 to-stone-50 border border-primary/20 rounded-2xl border-l-4 border-l-primary">
        <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0 mt-0.5">
          <ShieldCheck size={18} className="text-emerald-500" />
        </div>
        <p className="text-[13px] font-medium text-zinc-600 leading-relaxed">
          <strong className="text-zinc-900 font-black">{siteConfig.name}</strong> is a brand owned and operated by{" "}
          <strong className="text-zinc-900">{siteConfig.legalName}</strong>, committed to delivering quality
          fashion products, reliable service, and a seamless shopping experience to customers across India.
        </p>
      </div>
      {/* ── HERO INTRO ──────────────────────────────────── */}
      <div className="bg-zinc-900 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden mb-8 shadow-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-16 -bottom-16 opacity-[0.06] pointer-events-none"
        >
          <Shirt size={280} />
        </motion.div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Our Story</p>
          <h2 className="text-2xl md:text-4xl font-black uppercase italic leading-tight tracking-tight">
            Welcome to{" "}
            <span className="text-primary">{siteConfig.name}</span>
          </h2>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-medium">
            At <strong className="text-white">{siteConfig.name}</strong> ({siteConfig.legalName}), we believe fashion shopping should be{" "}
            <span className="text-primary font-bold">simple, affordable, and enjoyable</span>. Our mission is to bring you the
            latest trends in clothing and apparel — all in one place, at prices that make sense.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We specialize in offering a wide range of stylish apparel designed for modern lifestyles — whether you're looking
            for premium streetwear, formal shirts, dresses, or casual essentials. Our collection is carefully selected to match modern trends,
            quality standards, and customer expectations.
          </p>
        </div>
      </div>

      {/* ── WHY CHOOSE US ───────────────────────────────── */}
      <div className="mb-2">
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
          Why Choose {siteConfig.name}?
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {whyChooseUs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-4 p-5 rounded-2xl border ${item.border} ${item.bg} transition-all`}
            >
              <div className={`p-3 rounded-xl bg-white shadow-sm shrink-0`}>
                <item.icon size={20} className={item.color} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-zinc-800 mb-1">{item.title}</p>
                <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── MISSION ─────────────────────────────────────── */}
      <InfoSection title="Our Mission" icon={Target} color="blue">
        <p className="leading-relaxed">
          At <strong>{siteConfig.name}</strong>, our mission is to make online shopping{" "}
          <strong>easy, affordable, and stylish</strong> for everyone. We aim to provide high-quality fashion clothing that combines
          modern design with everyday functionality — ensuring that every customer finds something that matches their
          personality and lifestyle.
        </p>
        <p className="leading-relaxed mt-3">
          We are committed to offering the best value through carefully selected products, competitive pricing, and a smooth
          shopping experience. Our goal is to help customers express their style confidently without spending too much.
        </p>
      </InfoSection>

      {/* ── VISION ──────────────────────────────────────── */}
      <InfoSection title="Our Vision" icon={TrendingUp} color="pink">
        <p className="leading-relaxed">
          Our vision is to become a <strong>trusted and go-to destination</strong> for fashion lovers across India and beyond.
          We strive to build a platform where customers can explore a wide variety of trendy and reliable clothing, all in
          one place.
        </p>
        <p className="leading-relaxed mt-3">
          By continuously improving our product range, customer service, and overall experience, we aim to create long-term
          relationships with our customers and become a brand they can rely on every time they shop.
        </p>
      </InfoSection>

      {/* ── CLOSING CTA CARD ────────────────────────────── */}
      <div className="bg-gradient-to-br from-amber-50/40 via-white to-stone-50 border border-amber-100/60 rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden shadow-sm">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-10 -top-10 opacity-[0.05] pointer-events-none"
        >
          <Heart size={200} />
        </motion.div>

        <div className="relative z-10 space-y-3 max-w-xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">A Note From Us</p>
          <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tight text-zinc-900 leading-tight">
            It's Not Just About{" "}
            <span className="text-primary">Selling Clothes</span>
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium">
            At <strong className="text-zinc-800">{siteConfig.name}</strong>, it's about{" "}
            <strong className="text-zinc-800">adding style to your everyday life</strong>. We believe that the right outfit
            can enhance your confidence, complete your look, and make every moment feel special.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
              Trusted by Thousands Across India
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTACT INFO ────────────────────────────────── */}
      <InfoSection title="Get In Touch" icon={Phone} color="green">
        <p className="mb-5 text-zinc-500 text-sm">
          For any queries, support, or partnership inquiries — we're always happy to help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: User, color: "text-blue-500", label: "Legal Name", value: siteConfig.legalName },
            { icon: Mail, color: "text-rose-500", label: "Email", value: siteConfig.email },
            { icon: Phone, color: "text-emerald-500", label: "Phone", value: siteConfig.phone },
            { icon: MapPin, color: "text-zinc-500", label: "Address", value: siteConfig.address },
          ].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4 hover:border-zinc-200 transition-colors">
              <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{label}</p>
                <p className="text-[12px] font-bold text-zinc-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </InfoSection>
    </ModernInfoLayout>
  );
};

export default AboutUs;
