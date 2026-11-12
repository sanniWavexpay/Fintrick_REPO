import React, { useState } from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Truck, CreditCard, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("Orders");

  const faqData = {
    Orders: [
      { question: "How do I place an order on your website?", answer: `You can easily place an order by browsing our fashion & clothing collection, selecting your preferred product, and clicking on the “Buy Now” or “Add to Cart” button. Then proceed to checkout, enter your details, and confirm the order.` },
      { question: "Can I place an order without creating an account?", answer: `No, you need to create an account to place an order on ${siteConfig.name}. This helps you track your orders, manage returns, and enjoy a smoother shopping experience.` },
      { question: "How can I check my order status?", answer: `You can easily check your order status by visiting the My Orders section on the ${siteConfig.name} website. Simply log in to your account and go to My Orders to view tracking details and updates for your purchase.` },
      { question: "Can I cancel my order after placing it?", answer: "Yes, you can cancel your order before it is shipped. Once the order is dispatched, cancellation may not be possible." },
      { question: "Can I modify my order after placing it?", answer: "Order modifications are allowed only before shipping. Please contact support immediately if you want to make any changes." },
      { question: "What should I do if I entered the wrong address?", answer: "If you entered the wrong address, contact customer support as soon as possible. We will try to update it before shipping." },
      { question: "Will I receive confirmation after placing an order?", answer: "Yes, you will receive an order confirmation via SMS or email with complete details of your purchase." },
      { question: "What if I don’t receive my order confirmation?", answer: "Check your spam folder first. If still not received, contact support to confirm your order status." },
      { question: "Is there a minimum order value?", answer: "No, there is no minimum order value. You can order any product available on our website." },
      { question: "Can I place bulk orders?", answer: "Yes, bulk orders are accepted. You can contact our support team for special pricing and assistance." }
    ],
    Shipping: [
      { question: "How long does delivery take?", answer: "Delivery usually takes 3–7 business days depending on your location. Remote areas may take slightly longer." },
      { question: "Do you offer free shipping?", answer: "Yes, we offer free shipping on selected products or orders above a certain amount." },
      { question: "How can I track my shipment?", answer: `You can track your shipment directly from the My Orders section in your profile on ${siteConfig.name}. Simply log in, go to your order, and check the latest status.` },
      { question: "Which courier services do you use?", answer: "We use reliable courier partners to ensure safe and timely delivery across India." },
      { question: "Do you deliver to all locations in India?", answer: "Yes, we deliver to most PIN codes across India. You can check availability during checkout." },
      { question: "What happens if I am not available at delivery?", answer: "The courier will attempt delivery again or contact you. You can also reschedule delivery." },
      { question: "Can I change my delivery address after shipping?", answer: "Once shipped, changing the address is difficult. However, you can contact support for assistance." },
      { question: "Are there any shipping charges?", answer: "Shipping charges depend on the product and location. Any applicable charges will be shown at checkout." },
      { question: "What if my package is delayed?", answer: "If your order is delayed, please contact us. We will check with the courier and update you." },
      { question: "Is same-day delivery available?", answer: "Currently, same-day delivery is not available, but we are working to improve delivery speed." }
    ],
    Payments: [
      { question: "What payment methods do you accept?", answer: `At the moment, ${siteConfig.name} supports payments via UPI and Cash on Delivery (COD) for a simple and convenient checkout experience.` },
      { question: "Is Cash on Delivery available?", answer: "Yes, COD is available on most products and locations." },
      { question: "Is online payment safe?", answer: "Yes, all online transactions are secured with encryption to ensure your payment details are safe." },
      { question: "Can I pay using UPI apps?", answer: "Yes, you can pay using any UPI app like Google Pay, PhonePe, or Paytm." },
      { question: "Why did my payment fail?", answer: "Payment failures can happen due to network issues or bank problems. You can try again or use another method." },
      { question: "Will I get a payment confirmation?", answer: "Yes, once the payment is successful, you will receive a confirmation message." },
      { question: "Can I use multiple payment methods?", answer: "Currently, only one payment method can be used per order." },
      { question: "Are there any hidden charges?", answer: "No, there are no hidden charges. You will see the final amount before making payment." },
      { question: "Do you offer EMI options?", answer: `At present, ${siteConfig.name} does not provide EMI payment facilities. We currently support UPI and Cash on Delivery (COD).` },
      { question: "What should I do if money is deducted but the order is not placed?", answer: "If money is deducted but the order is not confirmed, it will be refunded automatically within a few days." }
    ],
    Returns: [
      { question: "What is your return policy?", answer: "We offer a return policy within a limited period after delivery, provided the product is unused and in original condition." },
      { question: "How can I request a return?", answer: "You can request a return by contacting customer support or through your account section." },
      { question: "Can I return a used product?", answer: "No, only unused products with original packaging are eligible for returns." },
      { question: "How long does the return process take?", answer: "Once approved, the return process usually takes 7–8 business days." },
      { question: "Will I get a refund or replacement?", answer: "We only offer refunds for eligible returns. Exchange or replacement is not available." },
      { question: "How will I receive my refund?", answer: "Refunds are processed to your original payment method. For Cash on Delivery (COD) orders, refunds will be provided via UPI or bank transfer." },
      { question: "What if I receive a damaged product?", answer: "If you receive a damaged product, report it within 24 hours with photos for quick resolution." },
      { question: "Are return shipping charges applicable?", answer: "Return shipping is free in case of defective or wrong products. Otherwise, charges may apply." },
      { question: "Can I exchange my product?", answer: "No, we do not offer exchange or replacement. Only returns are available." },
      { question: "What if my return request is rejected?", answer: "If the product does not meet return conditions, the request may be rejected. Our team will inform you with the reason." }
    ]
  };

  const categories = [
    { label: "Orders", icon: ShoppingBag, color: "pink" },
    { label: "Shipping", icon: Truck, color: "blue" },
    { label: "Payments", icon: CreditCard, color: "green" },
    { label: "Returns", icon: Clock, color: "zinc" }
  ];

  const activeIcon = categories.find(c => c.label === activeTab)?.icon || HelpCircle;
  const activeColor = categories.find(c => c.label === activeTab)?.color || "pink";

  return (
    <ModernInfoLayout
      title="Common Questions"
      subtitle="Find quick answers to your questions about our service and products"
      icon={HelpCircle}
    >
      <SEO
        title={`FAQ | ${siteConfig.name} Help & Support`}
        description={`Find answers to common questions about orders, payments, shipping, and returns at ${siteConfig.name}.`}
      />
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(cat.label)}
            className={`p-6 rounded-[30px] border transition-all cursor-pointer ${
              activeTab === cat.label 
                ? "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50" 
                : "bg-zinc-50 border-zinc-100 hover:bg-white"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 border ${
              activeTab === cat.label 
                ? "bg-primary text-white border-primary" 
                : "bg-zinc-100 text-zinc-500 border-zinc-200"
            }`}>
              <cat.icon size={20} />
            </div>
            <h4 className={`text-xs font-black uppercase tracking-tight text-center ${
              activeTab === cat.label ? "text-black" : "text-zinc-400"
            }`}>
              {cat.label}
            </h4>
          </motion.div>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {faqData[activeTab]?.map((faq, i) => (
              <InfoSection
                key={i}
                title={faq.question}
                icon={activeIcon}
                color={activeColor}
              >
                <p className="text-zinc-600 leading-relaxed font-medium">
                  {faq.answer}
                </p>
              </InfoSection>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-10 rounded-[40px] bg-zinc-900 text-white relative overflow-hidden mt-12 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageCircle size={100} />
        </div>
        <div className="relative z-10 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic">
              Still have <span className="text-primary">questions?</span>
            </h3>
            <p className="text-zinc-400 font-medium max-w-lg">
              Can't find the answer you're looking for? Our support team is available Monday to Saturday to assist you.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 px-6 py-4 bg-zinc-800 rounded-2xl hover:bg-primary transition-all group">
              <Mail size={18} className="text-primary group-hover:text-white" />
              <span className="text-xs font-black uppercase tracking-widest">Email Support</span>
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 px-6 py-4 bg-zinc-800 rounded-2xl hover:bg-primary transition-all group">
              <Phone size={18} className="text-blue-500 group-hover:text-white" />
              <span className="text-xs font-black uppercase tracking-widest">{siteConfig.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </ModernInfoLayout>
  );
};

export default FAQ;
