import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Sparkles,
  ShieldCheck,
  Headphones,
  Truck,
  MessageCircle,
  Globe,
  Clock
} from "lucide-react";
import { useContactMutation } from "../../features/contact/useContact";
import toast from "react-hot-toast";
import SEO from "../common/SEO";
import { siteConfig } from "../../config/siteConfig";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // ✅ React Query Mutation
  const contactMutation = useContactMutation(() => {
    setFormData({ name: "", email: "", subject: "", message: "" });
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return toast.error("Please fill all required fields.");
    }
    contactMutation.mutate(formData);
  };

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white text-zinc-900 overflow-hidden font-sans">
      <SEO
        title={`Contact ${siteConfig.name} | Customer Support & Help`}
        description={`Get in touch with ${siteConfig.name} for any queries, support, or assistance. We’re here to help you anytime.`}
      />

      {/* 🏙️ MINIMAL HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center bg-gradient-to-b from-primary/5 to-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary/20 rounded-full text-primary mb-6 shadow-sm shadow-primary/10"
        >
          <Sparkles size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Contact Us</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-black leading-tight uppercase tracking-tighter"
        >
          Get in <span className="text-primary italic">Touch</span>
        </motion.h1>
      </section>

      {/* ✉️ MAIN CONTACT AREA */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT: INFO */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-black uppercase tracking-tight">Contact <span className="text-primary italic">Details</span></h2>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                Experience the heritage and craftsmanship of {siteConfig.name}. Our team is always ready to assist you with luxury-level service.
              </p>
            </div>

            <div className="grid gap-8">
              {[
                { icon: MapPin, title: "Our Location", content: siteConfig.address },
                { icon: Phone, title: "Phone Number", content: siteConfig.phone },
                { icon: Mail, title: "Email Address", content: siteConfig.email },
                { icon: Clock, title: "Business Hours", content: "Mon - Sat: 10:00 AM - 8:00 PM" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                    <item.icon size={22} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{item.title}</h4>
                    <p className="text-sm font-bold text-black group-hover:text-primary transition-colors">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="bg-zinc-50/50 rounded-[40px] p-8 md:p-12 border border-zinc-100 shadow-sm relative">
            <div className="absolute top-8 right-8 text-zinc-100 hidden md:block">
              <Mail size={120} />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black leading-tight uppercase tracking-tight">Write to <span className="text-primary">Us</span></h3>
                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Typical response time: 2 hours</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={50}
                      placeholder="John Doe"
                      className="w-full bg-white border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="john@example.com"
                      className="w-full bg-white border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder="Order Inquiry / Styling Advice"
                    className="w-full bg-white border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest pl-1">Your Message</label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-white border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none shadow-sm"
                  />
                  <div className="flex justify-end pr-1 box-border">
                    <span className={`text-[9px] font-black tabular-nums transition-colors ${formData.message.length >= 1000 ? "text-primary" : "text-zinc-300"
                      }`}>
                      {formData.message.length}/1000
                    </span>
                  </div>
                </div>

                <button
                  disabled={contactMutation.isPending}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.25em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  {contactMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 📍 GOOGLE MAP SECTION */}
      <section className="w-full h-[450px] bg-zinc-100 mt-12 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe
          title="Location Map"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

    </div>
  );
};

export default ContactUs;

