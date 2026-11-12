import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { Scale, FileText, UserCheck, Key, ShoppingBag, CreditCard, Truck, RotateCcw, AlertTriangle, Copyright, Gavel, Phone, Tag, Package, ExternalLink, ShieldAlert, Power, User, Mail, MapPin } from "lucide-react";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const TermsOfService = () => {
  return (
    <ModernInfoLayout
      title="Terms & Conditions"
      subtitle={`Please read these terms carefully before using ${siteConfig.name}`}
      icon={Scale}
    >
      <SEO
        title={`Terms & Conditions | ${siteConfig.name} User Agreement`}
        description={`Read the terms and conditions for using ${siteConfig.name}. Understand your rights, responsibilities, and policies before shopping.`}
      />
      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
        Last Updated: April 02, 2026
      </div>
      <div className="space-y-6 text-zinc-600 leading-relaxed font-medium text-[13px]">
        <p>This website <strong>{siteConfig.domain}</strong> (“Website”) is owned and operated by {siteConfig.name} (hereinafter referred to as “{siteConfig.name}”, “Company”, “we”, “us”, or “our”).
          In accessing, browsing, or using this Website and the services provided therein, you are deemed to have read, understood, and agreed to be bound by these Terms and Conditions (“Terms”), which shall be effective for an indefinite period and shall govern your use of the Website for so long as you continue to access or use the same.
          <strong>{siteConfig.name}</strong> reserves the right, at its sole discretion, to modify, amend, or update these Terms at any time without prior notice. It shall be your responsibility to review these Terms periodically. Continued use of the Website following any such modification shall constitute your acceptance of the revised Terms.
        </p>
        <InfoSection title="1. Eligibility to Use" icon={UserCheck} color="blue">
          <ul className="list-disc pl-5 space-y-2">
            <li>Use of this Website is available only to persons who are competent to contract under the Indian Contract Act, 1872.</li>
            <li>Persons who are minors (below the age of 18 years) or otherwise incompetent to contract are not eligible to use or transact on this Website.</li>
          </ul>
        </InfoSection>

        <InfoSection title="2. Nature of Services" icon={ShoppingBag} color="pink">
          <p className="mb-3"><strong>{siteConfig.name}</strong> operates as an online e-commerce platform offering fashion clothing and apparel for men and women.</p>
          <p>The Company does not manufacture or own the brands of the products listed on the Website. All products are sourced from third-party brands, sellers, or distributors. Accordingly, product specifications, warranties, representations, and quality assurances are the responsibility of the respective third-party brands or manufacturers.</p>
        </InfoSection>

        <InfoSection title="3. User Account and Information" icon={Key} color="zinc">
          <p className="mb-3">You agree to provide true, accurate, current, and complete information at the time of registration or placing an order.</p>
          <p>You further agree to maintain and promptly update such information to keep it accurate and complete. If any information provided by you is found to be false, inaccurate, incomplete, or misleading, {siteConfig.name} reserves the right to suspend or terminate your access to the Website and refuse any current or future services.</p>
        </InfoSection>

        <InfoSection title="4. Product Display, Pricing and Availability" icon={Tag} color="blue">
          <ul className="list-disc pl-5 space-y-2">
            <li>All products displayed on the Website constitute an invitation to offer and not an offer for sale.</li>
            <li>Your order for purchase constitutes an offer, which shall be subject to acceptance by {siteConfig.name}. Acceptance of your order shall occur only upon dispatch of the product(s).</li>
            <li>All prices displayed on the Website are in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise specified.</li>
            <li>While the Company endeavors to ensure accuracy in product descriptions, pricing, and availability, errors may occur. {siteConfig.name} reserves the right to correct such errors and cancel orders arising therefrom without any liability.</li>
          </ul>
        </InfoSection>

        <InfoSection title="5. Orders and Acceptance" icon={Package} color="green">
          <p className="mb-3">We reserve the right, at our sole discretion, to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Refuse or cancel any order</li>
            <li>Limit the quantity of items purchased per user, account, or transaction</li>
            <li>Seek additional information before processing any order</li>
          </ul>
          <p className="mt-3">In the event of cancellation of an order, the user shall be notified, and any payment received shall be refunded in accordance with the applicable policy.</p>
        </InfoSection>

        <InfoSection title="6. Payment Terms" icon={CreditCard} color="blue">
          <p className="mb-3">All payments for orders within India shall be made in Indian Rupees (INR) through authorized payment methods available on the Website.</p>
          <p>The Company reserves the right to require additional verification, including identity proof, in certain cases before processing an order.</p>
        </InfoSection>

        <InfoSection title="7. Shipping and Delivery" icon={Truck} color="pink">
          <ul className="list-disc pl-5 space-y-2">
            <li>{siteConfig.name} provides delivery services only within India.</li>
            <li>Any delivery timelines provided are indicative in nature and subject to change based on logistics, operational constraints, or external factors.</li>
            <li>The Company shall not be liable for any delay in delivery arising due to circumstances beyond its control, including but not limited to natural calamities, public holidays, governmental actions, or disruptions in logistics services.</li>
            <li>In the event of non-delivery due to incorrect or incomplete information provided by the user, any additional costs incurred shall be borne by the user.</li>
          </ul>
        </InfoSection>

        <InfoSection title="8. Cancellation and Refund" icon={RotateCcw} color="blue">
          <ul className="list-disc pl-5 space-y-2">
            <li>Orders may be cancelled only before dispatch. Once the order has been shipped, cancellation may not be permitted.</li>
            <li>Refunds, where applicable, shall be processed through the original mode of payment within a reasonable period.</li>
            <li>In cases where payment has been debited but the transaction has failed, the amount shall be refunded to the user.</li>
          </ul>
        </InfoSection>

        <InfoSection title="9. User Conduct and Restrictions" icon={AlertTriangle} color="zinc">
          <p className="mb-3">You agree not to engage in any activity that may:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violate or attempt to violate the security of the Website</li>
            <li>Interfere with or disrupt the functioning of the Website</li>
            <li>Introduce malicious software, viruses, or harmful code</li>
            <li>Engage in fraudulent transactions or misuse of services</li>
          </ul>
          <p className="mt-3 font-semibold text-rose-600 uppercase text-[11px]">Any such violation may result in civil or criminal liability, and {siteConfig.name} reserves the right to initiate appropriate legal proceedings.</p>
        </InfoSection>

        <InfoSection title="10. Intellectual Property Rights" icon={Copyright} color="blue">
          <p className="mb-3">All content on the Website, including but not limited to text, graphics, logos, images, and software, is the property of {siteConfig.name} or its licensors and is protected under applicable intellectual property laws.</p>
          <p>No part of the Website may be copied, reproduced, distributed, or used in any manner without the prior written consent of the Company.</p>
        </InfoSection>

        <InfoSection title="11. Third-Party Products Disclaimer" icon={AlertTriangle} color="pink">
          <p className="mb-3">{siteConfig.name} acts solely as a reseller platform for third-party branded products.</p>
          <p className="mb-3 font-bold">The Company shall not be responsible for:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Manufacturing defects</li>
            <li>Product warranties provided by brands</li>
            <li>Accuracy of brand-specific claims</li>
          </ul>
          <p className="mt-3">Users are advised to refer to the respective brand policies for warranties and guarantees.</p>
        </InfoSection>

        <InfoSection title="12. Limitation of Liability" icon={Scale} color="zinc">
          <p className="mb-3">To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use or inability to use the Website</li>
            <li>Purchase or use of products</li>
            <li>Delay or failure in delivery</li>
            <li>Errors or inaccuracies on the Website</li>
          </ul>
        </InfoSection>

        <InfoSection title="13. External Links" icon={ExternalLink} color="blue">
          <p>The Website may contain links to third-party websites. Such websites are not under the control of {siteConfig.name}, and the Company shall not be responsible for the content, policies, or practices of such external websites.</p>
        </InfoSection>

        <InfoSection title="14. Force Majeure" icon={ShieldAlert} color="pink">
          <p>{siteConfig.name} shall not be liable for any failure or delay in performance of its obligations due to events beyond its reasonable control, including but not limited to acts of God, natural disasters, governmental restrictions, or disruptions in transportation or communication systems.</p>
        </InfoSection>

        <InfoSection title="15. Termination" icon={Power} color="zinc">
          <p>{siteConfig.name} reserves the right to suspend or terminate your access to the Website at any time without prior notice in the event of violation of these Terms or any applicable laws.</p>
        </InfoSection>

        <InfoSection title="16. Governing Law and Jurisdiction" icon={Gavel} color="blue">
          <p className="mb-3">These Terms shall be governed by and construed in accordance with the laws of India.</p>
          <p>Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
        </InfoSection>

        <InfoSection title="17. Contact Us" icon={Phone} color="green">
          <p className="mb-6 text-zinc-500">For any queries, complaints, or clarifications regarding these Terms, you may contact us at:</p>
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
        </InfoSection>
      </div>
    </ModernInfoLayout>
  );
};

export default TermsOfService;
