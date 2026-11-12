import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { XCircle, Clock, Send, CreditCard, AlertCircle, RefreshCcw, Mail, Phone, MapPin, User, ShieldAlert, Zap, HelpCircle } from "lucide-react";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const CancellationPolicy = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdated = `April 07, ${currentYear}`;

  return (
    <ModernInfoLayout
      title="Cancellation Policy"
      subtitle={`Reliable and fair support for all service cancellations at ${siteConfig.name}`}
      icon={XCircle}
    >
      <SEO
        title={`Order Cancellation Policy | ${siteConfig.name}`}
        description={`Check how to cancel your order on ${siteConfig.name}. Easy cancellation process with quick support and clear guidelines.`}
      />
      
      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
        Last Updated: {lastUpdated}
      </div>

      <div className="space-y-6 text-zinc-600 leading-relaxed font-medium text-[13px]">
        <p>
          <strong>{siteConfig.name}</strong> (“{siteConfig.name}”, “Company”, “we”, “us”, or “our”) provides customers with the option to cancel orders subject to the terms and conditions set out below. By placing an order on {siteConfig.domain}, you agree to be bound by this Cancellation Policy.
        </p>

        <div className="grid grid-cols-1 gap-6">
          <InfoSection title="1. Cancellation Window" icon={Clock} color="blue">
            <p className="mb-3">Customers may request cancellation of an order only <strong>before the order has been processed or dispatched</strong> by the Company. Once an order has been processed or shipped, cancellation requests shall not be entertained.</p>
            <p>The Company reserves the right to determine whether an order has entered the processing or dispatch stage, and such determination shall be final and binding.</p>
          </InfoSection>

          <InfoSection title="2. Cancellation Request Process" icon={Send} color="indigo">
            <ul className="list-disc pl-5 space-y-2">
              <li>Customers may cancel an order directly through their registered account on the {siteConfig.name} website, subject to the order not having been processed or dispatched.</li>
              <li>The cancellation option shall be available only for eligible orders within the permissible time frame. Once the order has been processed, the cancellation option may no longer be available on the Website.</li>
              <li>The Company does not guarantee cancellation in all cases, and any cancellation request shall be subject to the order status at the time of such request.</li>
            </ul>
          </InfoSection>

          <InfoSection title="3. Refund on Cancellation" icon={CreditCard} color="green">
            <p className="mb-3">In the event that a cancellation request is accepted, the amount paid by the customer shall be refunded to the original mode of payment within a reasonable period.</p>
            <p>In certain cases, applicable charges, if any, may be deducted before processing the refund.</p>
          </InfoSection>

          <InfoSection title="4. Cancellation by the Company" icon={ShieldAlert} color="rose">
            <p className="mb-3">{siteConfig.name} reserves the right to cancel any order at its sole discretion, including but not limited to the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unavailability of the product</li>
              <li>Errors in pricing or product information</li>
              <li>Suspected fraudulent or unauthorized transaction</li>
              <li>Issues related to payment verification</li>
              <li>Incomplete or incorrect customer details</li>
            </ul>
            <p className="mt-3">In such cases, the customer shall be notified, and the amount paid shall be refunded in accordance with the Company’s refund process.</p>
          </InfoSection>

          <InfoSection title="5. Non-Cancellable Orders" icon={XCircle} color="pink">
            <p className="mb-3">Orders that have already been processed, dispatched, or delivered cannot be cancelled.</p>
            <p>Customers are advised to refer to the Return Policy for cases where they wish to return a delivered product, subject to applicable terms and conditions.</p>
          </InfoSection>

          <InfoSection title="6. Delays and Exceptions" icon={Zap} color="blue">
            <p>Cancellation requests may not be processed in real-time due to operational or technical reasons. The Company shall not be liable for any delay in acting upon such requests.</p>
          </InfoSection>

          <InfoSection title="7. Important Notes" icon={HelpCircle} color="zinc">
            <ul className="list-disc pl-5 space-y-2">
              <li>Cancellation requests are subject to verification and approval</li>
              <li>Refund timelines may vary depending on banks and payment gateways</li>
              <li>{siteConfig.name} is not responsible for delays caused by third-party payment providers</li>
            </ul>
          </InfoSection>

          <InfoSection title="8. Changes to This Policy" icon={RefreshCcw} color="blue">
            <p>We may update or modify this Cancellation Policy at any time without prior notice. Updated versions will be posted on this page with a revised date.</p>
          </InfoSection>

          <InfoSection title="9. Contact Us" icon={Phone} color="green">
            <p className="mb-6 text-zinc-500">For any cancellation-related queries or requests, you may contact us at:</p>
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

export default CancellationPolicy;
