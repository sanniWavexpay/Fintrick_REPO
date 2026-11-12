import React from "react";
import ModernInfoLayout, { InfoSection } from "../../components/layout/ModernInfoLayout";
import { ShieldCheck, Info, Database, Globe, Target, Fingerprint, Lock, Trash2, Cookie, ShieldAlert, UserPlus, AlertCircle, RefreshCw, Phone, Mail, MapPin, Handshake, User } from "lucide-react";
import SEO from "../../components/common/SEO";
import { siteConfig } from "../../config/siteConfig";

const PrivacyPolicy = () => {
  return (
    <ModernInfoLayout
      title="Privacy Policy"
      subtitle={`Your privacy and data protection are our top priorities at ${siteConfig.name}`}
      icon={ShieldCheck}
    >
      <SEO
        title={`Privacy Policy | Secure Shopping at ${siteConfig.name}`}
        description={`Your data is safe with ${siteConfig.name}. Read our privacy policy to understand how we collect, use, and protect your information.`}
      />
      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">
        Last Updated: April 02, 2026
      </div>

      <div className="space-y-6 text-zinc-600 leading-relaxed font-medium text-[13px]">
        <p className="mb-6">
          <strong>{siteConfig.name}</strong>, hereinafter referred to as “We”, “Us”, or “Our”, values your trust and is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website, browse products, or make purchases from us.
        </p>
        <p className="mb-6">
          <strong>{siteConfig.name}</strong> is an online platform that offers premium fashion clothing and apparel for men and women. We do not manufacture our own products; we sell products from third-party brands and suppliers.
        </p>
        <p className="mb-6">
          By using our website and services, you agree to the collection and use of your information as described in this Privacy Policy.
        </p>

        <InfoSection title="1. Personal Data and Sensitive Personal Data" icon={Info} color="blue">
          <p className="mb-3">Personal Data refers to any information that relates to an identified or identifiable individual, either directly or indirectly. We collect Personal Data depending on your interaction with our Services.</p>
          <p>We do not intentionally collect Sensitive Personal Data such as biometric information, health data, or other highly sensitive categories unless required by law or explicitly provided by you for a specific purpose.</p>
        </InfoSection>

        <InfoSection title="2. Categories of Personal Data" icon={Database} color="pink">
          <p className="mb-3 font-bold text-zinc-800">We may collect and process the following categories of Personal Data:</p>
          <ul className="space-y-4">
            <li>
              <p className="font-bold text-zinc-800 underline underline-offset-4 mb-1">Contact Information:</p>
              <p>Name, email address, phone number, billing address, shipping address, and other identifiers required for order processing and communication.</p>
            </li>
            <li>
              <p className="font-bold text-zinc-800 underline underline-offset-4 mb-1">Transaction and Order Information:</p>
              <p>Details of products purchased, order history, payment status, and transaction-related data.</p>
            </li>
            <li>
              <p className="font-bold text-zinc-800 underline underline-offset-4 mb-1">Financial Information:</p>
              <p>Limited payment-related details required to facilitate transactions. Payment processing is handled through secure third-party payment service providers, and we do not store full payment credentials such as card numbers.</p>
            </li>
            <li>
              <p className="font-bold text-zinc-800 underline underline-offset-4 mb-1">User-Generated Information:</p>
              <p className="mb-1 italic">Information provided by you through:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Customer support interactions</li>
                <li>Product reviews, ratings, or feedback</li>
                <li>Queries submitted through forms or contact channels</li>
              </ul>
            </li>
            <li>
              <p className="font-bold text-zinc-800 underline underline-offset-4 mb-1">Usage Information:</p>
              <p>Technical data such as IP address, browser type, device identifiers, pages visited, session duration, and interaction data is collected via cookies and similar technologies.</p>
            </li>
            <li>
              <p className="font-bold text-zinc-800 underline underline-offset-4 mb-1">Communication Information:</p>
              <p>Records of communication preferences, responses to promotional messages, and support-related correspondence.</p>
            </li>
          </ul>
        </InfoSection>

        <InfoSection title="3. Sources of Personal Data" icon={Globe} color="zinc">
          <p className="mb-3">We may collect your Personal Data from a variety of sources to ensure efficient delivery of our Services and to enhance your overall experience on our platform. These sources include, but are not limited to:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Direct Interactions:</strong> Information provided by you when you register on our website, create an account, place an order, subscribe to communications, participate in promotional activities, or contact us through customer support channels.</li>
            <li><strong>Automated Technologies:</strong> Data collected automatically when you interact with our website, including through cookies, web beacons, pixel tags, and similar tracking technologies. This may include technical information such as IP address, browser type, device information, and browsing behavior.</li>
            <li><strong>Third-Party Service Providers:</strong> Information received from trusted third parties involved in facilitating our Services, such as payment gateways, logistics and delivery partners, and technology service providers.</li>
            <li><strong>Publicly Available and Permitted Sources:</strong> Information that may be obtained from publicly accessible platforms or other lawful sources, to the extent permitted under applicable laws.</li>
          </ul>
        </InfoSection>

        <InfoSection title="4. Purpose of Processing Personal Data" icon={Target} color="blue">
          <p className="mb-3 text-zinc-800 font-bold">We process your Personal Data for legitimate business purposes and to provide you with a seamless and secure shopping experience:</p>
          <ul className="space-y-4">
            <li><strong>4.1 Fulfilling Orders and Services:</strong> To process and confirm transactions, manage orders, coordinate shipping and delivery, handle returns or cancellations, and provide customer support throughout your purchase journey.</li>
            <li><strong>4.2 Managing Customer Relationships:</strong> To maintain and manage your account, respond to your queries and requests, assist, and ensure effective communication regarding your orders and services.</li>
            <li><strong>4.3 Service Improvement and Analytics:</strong> To analyze user behavior, preferences, and trends to improve website functionality, optimize performance, enhance user experience, and develop new products, features, or services.</li>
            <li><strong>4.4 Communication and Marketing:</strong> To send you transactional updates such as order confirmations, delivery notifications, and service-related messages, as well as promotional offers, newsletters, and marketing communications, subject to your consent and applicable laws.</li>
            <li><strong>4.5 Security and Fraud Prevention:</strong> To detect, prevent, investigate, and mitigate fraudulent activities, unauthorized transactions, security breaches, and other harmful activities affecting our platform or users.</li>
            <li><strong>4.6 Legal and Regulatory Compliance:</strong> To comply with applicable laws, regulations, legal processes, and governmental requests within India, including maintaining records and fulfilling statutory obligations.</li>
            <li><strong>4.7 Business Operations:</strong> To support our internal business functions such as auditing, data analysis, reporting, system maintenance, risk management, and ensuring business continuity.</li>
          </ul>
        </InfoSection>

        <InfoSection title="5. Lawful Basis of Processing" icon={Fingerprint} color="pink">
          <p className="mb-3">We process your Personal Data in accordance with applicable laws in India on the following lawful grounds:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Consent:</strong> Where you have provided clear and explicit consent for specific purposes.</li>
            <li><strong>Contractual Necessity:</strong> Where processing is required to fulfill a contract with you, including order processing and delivery of Services.</li>
            <li><strong>Legal Obligation:</strong> Where processing is necessary to comply with legal and regulatory requirements.</li>
            <li><strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate business interests, such as improving Services, ensuring security, and preventing fraud, provided that such interests do not override your rights.</li>
          </ul>
        </InfoSection>

        <InfoSection title="6. Disclosure of Personal Data" icon={Handshake} color="blue">
          <p className="mb-3 font-bold text-zinc-800">We may disclose your Personal Data to the following categories of recipients:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Logistics and Delivery Partners:</strong> To enable packaging, shipment, and delivery of your orders.</li>
            <li><strong>Payment Service Providers:</strong> To facilitate secure payment processing and transaction verification.</li>
            <li><strong>Technology and Hosting Providers:</strong> To support the operation, maintenance, and security of our website and systems.</li>
            <li><strong>Service Providers and Vendors:</strong> Including those assisting with analytics, customer support, communication services, and fraud detection.</li>
          </ul>
          <p className="mb-3">All such third parties are required to process your Personal Data strictly in accordance with our instructions and are bound by contractual obligations to ensure confidentiality and implement appropriate security measures.</p>
          <p className="font-bold text-zinc-800 mt-4">We may also disclose your Personal Data in the following circumstances:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>To comply with applicable laws, regulations, or legal processes</li>
            <li>To respond to lawful requests from government authorities, law enforcement agencies, or regulators</li>
            <li>To protect our rights, property, or safety, or that of our users</li>
            <li>In connection with corporate transactions such as mergers, acquisitions, restructuring, or the sale of assets</li>
          </ul>
        </InfoSection>

        <InfoSection title="7. Data Storage and Retention" icon={Lock} color="zinc">
          <p className="mb-3">We store your Personal Data using appropriate technical and organizational safeguards designed to protect it against unauthorized access, loss, misuse, or alteration.</p>
          <p className="mb-3">We retain your Personal Data only for as long as necessary to fulfill the purposes for which it was collected, including:</p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>To complete transactions and provide Services</li>
            <li>To comply with legal, tax, and regulatory obligations</li>
            <li>To resolve disputes and enforce agreements</li>
          </ul>
          <p>The retention period may vary depending on the nature of the data and legal requirements. Once the data is no longer required, it will be securely deleted, anonymized, or archived in accordance with applicable laws.</p>
        </InfoSection>

        <InfoSection title="8. Data Subject Rights" icon={Trash2} color="blue">
          <p className="mb-3">Subject to applicable laws in India, you have the following rights in relation to your Personal Data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Access:</strong> To request access to the Personal Data we hold about you</li>
            <li><strong>Right to Rectification:</strong> To request correction of inaccurate or incomplete information</li>
            <li><strong>Right to Erasure:</strong> To request deletion of your Personal Data, subject to legal obligations</li>
            <li><strong>Right to Withdraw Consent:</strong> To withdraw consent where processing is based on your consent</li>
          </ul>
          <p className="mt-3">We may require verification of your identity before processing such requests. Requests can be made through the contact details provided below.</p>
        </InfoSection>

        <InfoSection title="9. Cookies and Automatic Data Collection" icon={Cookie} color="zinc">
          <p className="mb-3">We use cookies and similar tracking technologies to enhance your browsing experience and improve our Services. These technologies help us:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ensure proper functioning of the website</li>
            <li>Analyze user behavior and website traffic</li>
            <li>Remember user preferences and settings</li>
            <li>Deliver relevant content and advertisements</li>
          </ul>
          <p className="mt-3 text-zinc-500 italic">You may choose to disable or manage cookies through your browser settings; however, this may impact certain functionalities of the website.</p>
        </InfoSection>

        <InfoSection title="10. Data Security Measures" icon={ShieldAlert} color="green">
          <p className="mb-3">We implement reasonable and appropriate technical, administrative, and physical safeguards to protect your Personal Data from unauthorized access, disclosure, alteration, misuse, or destruction.</p>
          <p>These measures include secure servers, restricted access controls, encryption where applicable, and regular monitoring of our systems. Access to Personal Data is limited to authorized personnel and service providers who require such access for legitimate business purposes.</p>
        </InfoSection>

        <InfoSection title="11. Minor’s Data" icon={UserPlus} color="pink">
          <p className="mb-3">Our Services are not intended for individuals under the age of 18. We do not knowingly collect or process Personal Data of minors. If we become aware that such data has been collected without appropriate consent, we will take steps to delete it promptly.</p>
        </InfoSection>

        <InfoSection title="12. Third-Party Products and Disclaimer" icon={AlertCircle} color="blue">
          <p className="mb-3"><strong>{siteConfig.name}</strong> operates as an intermediary platform offering products sourced from third-party brands and sellers. While we facilitate the listing, sale, and delivery of such products, we do not manufacture or control these products.</p>
          <p>Accordingly, product specifications, warranties, and quality-related obligations remain the responsibility of the respective third-party brands or manufacturers. However, we will make reasonable efforts to assist customers in resolving product-related concerns.</p>
        </InfoSection>

        <InfoSection title="13. Changes to this Privacy Policy" icon={RefreshCw} color="zinc">
          <p className="mb-3">We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our business practices, legal requirements, or regulatory obligations.</p>
          <p>Any updates will be posted on this page with a revised effective date. Continued use of our Services after such changes constitutes your acceptance of the updated Privacy Policy.</p>
        </InfoSection>

        <InfoSection title="14. Contact Us" icon={Phone} color="green">
          <p className="mb-6 text-zinc-500">For any questions, concerns, or requests regarding this Privacy Policy or your Personal Data, you may contact us at:</p>
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

export default PrivacyPolicy;
