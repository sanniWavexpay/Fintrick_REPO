import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { Truck, Clock, MapPin, CreditCard, Send, AlertTriangle, Package, Mail, Calendar, ShieldCheck, HelpCircle, Phone, User } from "lucide-react";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const ShippingPolicy = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdated = `April 07, ${currentYear}`;

  return (
    <ModernInfoLayout
      title="Shipping Policy"
      subtitle="Fast, secure and reliable delivery across India"
      icon={Truck}
    >
      <SEO
        title={`Shipping Policy | ${siteConfig.name} Delivery Information`}
        description={`Learn about ${siteConfig.name}’s shipping process, delivery timelines, and charges. We ensure fast and reliable delivery across India.`}
      />

      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
        Last Updated: {lastUpdated}
      </div>

      <div className="space-y-6 text-zinc-600 leading-relaxed font-medium text-[13px]">
        <p>
          <strong>{siteConfig.name}</strong> (“{siteConfig.name}”, “Company”, “we”, “us”, or “our”) is committed to delivering products across India in a timely and efficient manner.
          While we make every effort to ensure prompt dispatch and delivery, the timelines mentioned below are indicative and may vary based on operational and external factors.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <InfoSection title="1. Delivery Timeline" icon={Calendar} color="blue">
            <p>
              Orders are generally delivered within <strong>3–7 business days</strong> from the date of dispatch, depending upon the delivery pin code.
              Deliveries to remote or non-serviceable locations may take additional time. {siteConfig.name} currently provides shipping services only within India and does not offer international delivery.
            </p>
          </InfoSection>

          <InfoSection title="2. Order Processing & Dispatch" icon={Clock} color="indigo">
            <p>
              All orders are processed based on product availability and successful payment confirmation. The Company endeavors to process and dispatch orders within a reasonable timeframe; however, no fixed dispatch timeline is guaranteed.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Orders may be processed on the same day or the next business day.</li>
              <li>Orders placed on weekends or public holidays shall be processed on the next working day.</li>
            </ul>
          </InfoSection>

          <InfoSection title="3. Shipping Charges" icon={CreditCard} color="green">
            <p>
              Shipping charges, if applicable, are displayed at the time of checkout. The Company reserves the right to revise such charges from time to time without prior notice.
            </p>
          </InfoSection>

          <InfoSection title="4. Delivery Schedule" icon={Send} color="blue">
            <p>
              Deliveries are generally carried out between Monday and Saturday, excluding public holidays. The actual delivery timeline depends on the serviceability of the delivery location and availability of logistics support.
            </p>
          </InfoSection>

          <InfoSection title="5. Undelivered Orders (RTO)" icon={Package} color="rose">
            <p>
              In the event that a delivery cannot be completed due to customer unavailability, incorrect address, or contact details, the shipment may be returned to the Company (“Return to Origin”).
              In such cases, the order shall be treated as cancelled and only the product amount (excluding shipping charges) shall be refunded.
            </p>
          </InfoSection>

          <InfoSection title="6. Incorrect Address or Details" icon={MapPin} color="amber">
            <p>
              Customers are responsible for providing accurate shipping information. Any request for modification must be communicated within <strong>6 hours</strong> of placing the order. Once dispatched, changes may not be possible.
            </p>
          </InfoSection>

          <InfoSection title="7. Damaged or Tampered Packages" icon={ShieldCheck} color="emerald">
            <p>
              Customers are advised to inspect the package at delivery. If the package appears damaged or tampered with, it is recommended to refuse it.
              In case a damaged product is received, notify the Company within <strong>24 hours</strong> of delivery.
            </p>
          </InfoSection>

          <InfoSection title="8. Order Not Delivered" icon={HelpCircle} color="zinc">
            <p>
              If an order is not delivered within <strong>7–8 business days</strong> from dispatch, customers may contact our support team for assistance. We shall make reasonable efforts to coordinate and resolve the issue.
            </p>
          </InfoSection>

          <InfoSection title="9. Delays Beyond Control" icon={AlertTriangle} color="pink">
            <p>
              Delivery timelines may be affected due to circumstances beyond our control, including natural calamities, governmental restrictions, public holidays, or logistical disruptions. {siteConfig.name} shall not be held liable for such delays.
            </p>
          </InfoSection>

          <InfoSection title="10. Contact Us" icon={Phone} color="green">
            <p className="mb-6 text-zinc-500">For any shipping-related queries or assistance, you may reach out to us at:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4">
                <User className="text-blue-500" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400">Legal Name</p>
                  <p className="text-[12px] font-bold text-zinc-800">{siteConfig.legalName}</p>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4">
                <Mail className="text-pink-500" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400">Email</p>
                  <p><a href={`mailto:${siteConfig.email}`} className="text-[12px] font-bold text-zinc-800 hover:text-primary transition-colors">{siteConfig.email}</a></p>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4">
                <Phone className="text-green-500" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400">Phone</p>
                  <p><a href={`tel:${siteConfig.phone}`} className="text-[12px] font-bold text-zinc-800 hover:text-primary transition-colors">{siteConfig.phone}</a></p>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4">
                <MapPin className="text-zinc-500" size={20} />
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400">Address</p>
                  <p className="text-[12px] font-bold text-zinc-800">{siteConfig.address}</p>
                </div>
              </div>
            </div>
          </InfoSection>
        </div>
      </div>
    </ModernInfoLayout>
  );
};

export default ShippingPolicy;
