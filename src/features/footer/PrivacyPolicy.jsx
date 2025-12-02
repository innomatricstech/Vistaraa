
import "../footer/PrivacyPolicy.css"
import {
  MdPerson,
  MdInfo,
  MdSecurity,
  MdPublic,
  MdWarning,
  MdLock,
  MdDelete,
  MdChildCare,
  MdUpdate,
  MdHelpOutline
} from 'react-icons/md';

// --- Reusable Section Component (same pattern as ShippingPolicy) ---
const PolicySection = ({ number, title, icon: Icon, children, colorClass = '' }) => (
  <div className={`policy-card ${colorClass}`}>
    <div className="policy-title">
      <Icon />
      <h3>{number}. {title}</h3>
    </div>
    <ul>{children}</ul>
  </div>
);

const PrivacyPolicy = () => {
  const BRAND_ORANGE = '#ff6600';
  const LAST_UPDATED = 'December 2, 2025';

  // Gmail compose link (same support mailbox)
  const gmailLink =
    `https://mail.google.com/mail/?view=cm&fs=1&to=tajzaheer786@gmail.com&su=Privacy%20Policy%20Inquiry&body=Hello%20Support,%0A%0AI%20have%20a%20question%20about%20your%20Privacy%20Policy.%0A%0AThanks!`;

  return (
    <div className="shipping-policy-page">{/* reuse same page shell styles */}
      {/* Header */}
      <div className="shipping-header">
        <h1>Privacy Policy</h1>
        <p>Your data. Protected & respected.</p>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Intro */}
        <h2 className="text-2xl font-bold text-orange-600 mb-2">Privacy Policy</h2>
        <p className="text-sm text-gray-500 mb-6">Last updated: {LAST_UPDATED}</p>
        <p className="mb-6 text-gray-700">
          At <strong>Vistaraa</strong>, we value your privacy. This Privacy Policy explains what information we
          collect, how we use it, and the choices you have. By using our website or services, you agree to the
          practices described here.
        </p>

        <PolicySection number={1} title="Information We Collect" icon={MdPerson}>
          <li><strong>Account/Contact data:</strong> name, email, phone, shipping address.</li>
          <li><strong>Order data:</strong> items purchased, transaction totals, payment status (via payment gateway).</li>
          <li><strong>Usage data:</strong> pages viewed, clicks, device/browser info, approximate location.</li>
          <li><strong>Communications:</strong> messages you send to our support team or via forms.</li>
        </PolicySection>

        <PolicySection number={2} title="How We Use Your Information" icon={MdInfo}>
          <li>Provide, operate, and improve our website and services.</li>
          <li>Process orders, payments, refunds, and customer support requests.</li>
          <li>Send transactional emails (order confirmations, updates, security alerts).</li>
          <li>Personalize content, recommendations, and promotional offers (where permitted).</li>
          <li>Prevent fraud, enforce our Terms, and comply with legal obligations.</li>
        </PolicySection>

        <PolicySection number={3} title="Cookies & Similar Technologies" icon={MdInfo}>
          <li>We use cookies and local storage to keep you signed in and remember preferences.</li>
          <li>Analytics cookies help us understand site performance and usage patterns.</li>
          <li>You can control cookies via your browser settings, but some features may not work properly if disabled.</li>
        </PolicySection>

        <PolicySection number={4} title="Third-Party Services" icon={MdPublic}>
          <li>We integrate trusted providers (e.g., payment gateways, analytics, shipping partners).</li>
          <li>These providers process data on our behalf under their own privacy terms and legal obligations.</li>
          <li>We share only what’s necessary to deliver the service (e.g., address to couriers for delivery).</li>
        </PolicySection>

        <PolicySection number={5} title="Data Sharing & Transfers" icon={MdWarning} colorClass="red-highlight">
          <li>We do <strong>not</strong> sell your personal data.</li>
          <li>We may share information to comply with law, protect rights/safety, or in a business transfer (e.g., merger).</li>
          <li>If data is transferred to another jurisdiction, we use appropriate safeguards required by law.</li>
        </PolicySection>

        <PolicySection number={6} title="Data Security" icon={MdSecurity}>
          <li>We use administrative, technical, and physical safeguards to protect your data.</li>
          <li>No method of transmission or storage is 100% secure; we continuously improve our protections.</li>
        </PolicySection>

        <PolicySection number={7} title="Your Rights & Choices" icon={MdLock}>
          <li>Access, update, or correct your account information.</li>
          <li>Opt out of marketing emails via the unsubscribe link (transactional emails will still be sent).</li>
          <li>Request a copy of your data or object to certain processing where applicable by law.</li>
        </PolicySection>

        <PolicySection number={8} title="Data Retention & Deletion" icon={MdDelete}>
          <li>We retain data for as long as needed to provide services and for legitimate business/legal purposes.</li>
          <li>You can request deletion of your personal data; we will honor valid requests subject to legal obligations.</li>
        </PolicySection>

        <PolicySection number={9} title="Children’s Privacy" icon={MdChildCare}>
          <li>Our services are not directed to children under 13. We do not knowingly collect data from children.</li>
          <li>If you believe a child provided data, contact us to remove it.</li>
        </PolicySection>

        <PolicySection number={10} title="Changes to This Policy" icon={MdUpdate}>
          <li>We may update this policy from time to time. Material changes will be highlighted on this page.</li>
          <li>Continued use after changes means you accept the updated policy.</li>
        </PolicySection>

        {/* Help / Contact */}
        <div className="help-card text-center">
          <h4><MdHelpOutline /> Questions About Privacy?</h4>
          <p>Contact our support team for requests or concerns related to your personal data.</p>

          <a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
            style={{
              backgroundColor: BRAND_ORANGE,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '10px'
            }}
          >
            Contact Privacy Support
          </a>
        </div>

        {/* Scroll to Top Button (reused style) */}
        <a href="#" className="scroll-to-top-btn animate__bounceInRight">
          <i className="fas fa-arrow-up"></i>
        </a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
