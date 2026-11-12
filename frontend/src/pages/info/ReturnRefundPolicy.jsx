import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { RefreshCcw, PackageSearch, ClipboardCheck, BoxSelect, MapPin, AlertCircle, Truck, Info, XCircle, Gavel, Search, History, CreditCard, Shuffle, Phone, Mail, Clock, User } from "lucide-react";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const ReturnRefundPolicy = () => {
  return (
    <ModernInfoLayout
      title="Return & Refund Policy"
      subtitle={`Easy returns and transparent refunds at ${siteConfig.name}`}
      icon={RefreshCcw}
    >
      <SEO
        title={`Return Policy | Easy Returns at ${siteConfig.name}`}
        description={`Read ${siteConfig.name}’s return policy. We offer simple and hassle-free returns within a limited time for eligible products.`}
      />
      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
        Last Updated: April 02, 2026
      </div>

      <div className="space-y-6 text-zinc-600 leading-relaxed font-medium text-[13px]">
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl mb-8">
          <p className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[11px] tracking-wider mb-2">
            <Truck size={16} /> Delivery of Goods
          </p>
          <p>3–7 Working Days, depending upon the delivery pin code.</p>
        </div>

        <p className="mb-6">
          <strong>{siteConfig.name}</strong> (“<strong>{siteConfig.name}</strong>”, “Company”, “we”, “us”, or “our”) is committed to ensuring customer satisfaction with respect to products purchased through its website <strong>{siteConfig.domain}</strong> (“Website”).
        </p>
        <p className="mb-10">
          This Return Policy outlines the terms and conditions governing returns and refunds for products purchased on the Website. By placing an order, you agree to be bound by this Policy.
        </p>

        <InfoSection title="A. Return Policy (No Exchange / No Replacement)" icon={Shuffle} color="pink">
          <ul className="list-disc pl-5 space-y-2 font-bold text-zinc-800">
            <li><strong>{siteConfig.name}</strong> follows a Return Only Policy.</li>
            <li>We do not offer any exchange or replacement of products under any circumstances.</li>
          </ul>
          <p className="mt-3">Customers who are not satisfied with the product may initiate a return subject to the conditions mentioned below.</p>
        </InfoSection>

        <InfoSection title="B. Process for Return and Refund" icon={History} color="blue">
          <p className="mb-6">You may return your product by following the steps and conditions below:</p>

          <div className="space-y-8 mt-4">
            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <Clock size={14} className="text-blue-500" /> 1. Return Window
              </h4>
              <p>If the customer is not satisfied with the product and wishes to return the same, the return request must be raised within <strong>7 (seven) days</strong> from the date of delivery of the product.</p>
              <p className="mt-2 text-rose-500 font-bold">Any request raised after the expiry of 7 (seven) days shall not be entertained under any circumstances.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <ClipboardCheck size={14} className="text-green-500" /> 2. Product Condition
              </h4>
              <p className="mb-3">All products must be returned in:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Unused and in original condition</li>
                <li>With original packaging intact</li>
                <li>With all tags, labels, and security tags (if any) intact</li>
                <li>Along with the invoice and any warranty card (if applicable)</li>
              </ul>
              <p className="mb-2 italic text-zinc-400">The product must not be:</p>
              <ul className="list-disc pl-5 space-y-1 text-rose-400">
                <li>Damaged, worn, or used</li>
                <li>Tampered, altered, or modified</li>
                <li>Missing any accessories or original packaging</li>
              </ul>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <BoxSelect size={14} className="text-pink-500" /> 3. Packaging Instructions
              </h4>
              <p className="mb-2 font-bold italic">Customers are requested to:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Place the product in its original box</li>
                <li>Use additional protective packaging to prevent damage during transit</li>
              </ul>
              <p className="p-3 bg-zinc-50 rounded-xl text-[12px]">Failure to ensure safe packaging may result in rejection of the return.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <MapPin size={14} className="text-blue-500" /> 4. Return Pickup / Self-Shipping
              </h4>
              <p className="mb-4">Return pickup shall be arranged from the original delivery address or any alternate address provided by the customer in writing.</p>
              <div className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl mb-4">
                <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">Return Address:</p>
                <div className="space-y-0.5 text-zinc-800 font-bold">
                  <p><strong>{siteConfig.name}</strong></p>
                  <p>{siteConfig.address}</p>
                </div>
              </div>
              <p>The customer must share the shipment tracking details via email after dispatch.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <AlertCircle size={14} className="text-zinc-500" /> 5. Failed Pickup Attempts
              </h4>
              <p>If the customer fails to hand over the product during pickup: A second attempt shall be made. After two failed attempts, the return request shall stand cancelled.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <Truck size={14} className="text-blue-500" /> 6. Transit Time
              </h4>
              <p>It may take <strong>2–7 working days</strong> for the returned product to reach our warehouse, depending on location and courier service.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <Info size={14} className="text-zinc-500" /> 7. Important Instructions
              </h4>
              <p>Do not hand over any additional items apart from the returned product. The Company shall not be responsible for any extra/unaccounted items lost in transit.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <XCircle size={14} className="text-rose-500" /> 8. Return Rejection Conditions
              </h4>
              <p className="mb-2"><strong>{siteConfig.name}</strong> reserves the right to reject any return if:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4 text-[12px] opacity-80">
                <li>The product is found to be used, damaged, or altered</li>
                <li>Tags, packaging, or accessories are missing</li>
                <li>The invoice is not provided</li>
                <li>The product is returned after the return window</li>
                <li>The product is damaged due to customer negligence</li>
              </ul>
              <p className="font-bold text-rose-500">In such cases, the product shall be shipped back to the customer and no refund shall be processed.</p>
            </div>

            <div className="border-l-2 border-zinc-100 pl-6 py-1">
              <h4 className="flex items-center gap-2 font-black uppercase text-[11px] tracking-widest text-zinc-800 mb-3">
                <Gavel size={14} className="text-zinc-500" /> 9. Final Authority
              </h4>
              <p>All return requests shall be subject to the sole discretion of <strong>{siteConfig.name}</strong>. The decision of the Company shall be final and binding, and the Company shall not be obligated to provide any justification for rejection.</p>
            </div>
          </div>
        </InfoSection>

        <InfoSection title="C. Refund Process" icon={CreditCard} color="green">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-zinc-800 mb-2 underline decoration-green-100 underline-offset-4">1. Inspection and Approval</h4>
              <p>Once the returned product is received at our facility, it shall undergo quality inspection. Upon successful validation, the return shall be approved. The customer shall be notified via email.</p>
            </div>
            <div>
              <h4 className="font-bold text-zinc-800 mb-2 underline decoration-green-100 underline-offset-4">2. Refund Timeline</h4>
              <p>Refund shall be processed within <strong>7–8 working days</strong> from the date of approval. In case of rejection, the product shall be returned to the customer.</p>
            </div>
            <div>
              <h4 className="font-bold text-zinc-800 mb-2 underline decoration-green-100 underline-offset-4">3. Mode of Refund</h4>
              <p>Refund shall be credited to the original mode of payment used during purchase. In case of Cash on Delivery (if applicable), refund shall be processed via bank transfer or any other suitable method as determined by the Company.</p>
            </div>
          </div>
        </InfoSection>

        <InfoSection title="D. No Exchange / Replacement Clause" icon={XCircle} color="pink">
          <p className="mb-3 font-bold text-rose-600 italic"><strong>{siteConfig.name}</strong> does not provide any exchange or replacement facility.</p>
          <p>In case a customer wishes to purchase another product, they must initiate a return (if eligible) and place a fresh order separately.</p>
        </InfoSection>

        <InfoSection title="E. Contact Us" icon={Phone} color="green">
          <p className="mb-6 text-zinc-500">For any queries or return requests, you may reach out to us at:</p>
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
                <p className="text-[12px] font-bold text-zinc-800">{siteConfig.email}</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-4">
              <Phone className="text-green-500" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">Phone</p>
                <p className="text-[12px] font-bold text-zinc-800">{siteConfig.phone}</p>
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
          <div className="mt-4 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">Working Hours</p>
            <p className="text-[12px] font-bold text-zinc-800">Monday to Saturday, 10:00 AM to 6:00 PM (excluding public holidays)</p>
          </div>
        </InfoSection>
      </div>
    </ModernInfoLayout>
  );
};

export default ReturnRefundPolicy;
