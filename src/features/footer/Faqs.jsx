// Faqs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔹 For back navigation
import { 
  Truck, LogIn, RefreshCcw, Wallet, Undo2, PackageOpen, XCircle, 
  ChevronDown, ChevronRight, ArrowLeft, ArrowUp, Zap 
} from "lucide-react";
import "./Faqs.css"; // Make sure this file is in the same folder

const iconComponentMap = {
  "fas fa-truck": Truck,
  "fas fa-sign-in-alt": LogIn,
  "fas fa-exchange-alt": RefreshCcw,
  "fas fa-wallet": Wallet,
  "fas fa-undo-alt": Undo2,
  "fas fa-box-open": PackageOpen,
  "fas fa-times-circle": XCircle,
};

function Faqs() {
  const [openCollapseId, setOpenCollapseId] = useState(null);
  const navigate = useNavigate(); // 🔹 react-router-dom navigate hook

  const faqTopics = [
    { title: "Delivery Related FAQs", iconKey: "fas fa-truck", collapseId: "delivery" },
    { title: "Login Related FAQs", iconKey: "fas fa-sign-in-alt", collapseId: "login" },
    { title: "Refund Related FAQs", iconKey: "fas fa-exchange-alt", collapseId: "refund" },
    { title: "Payment Related FAQs", iconKey: "fas fa-wallet", collapseId: "payment" },
    { title: "Return Related FAQs", iconKey: "fas fa-undo-alt", collapseId: "return" },
    { title: "Pickup Related FAQs", iconKey: "fas fa-box-open", collapseId: "pickup" },
    { title: "Cancellation Related FAQs", iconKey: "fas fa-times-circle", collapseId: "cancellation" },
  ];

  const faqData = {
    delivery: [
      "How quickly can I get my order delivered?",
      "What do the different order statuses in 'My Orders' mean?",
      "What are the standard shipping speeds and delivery charges?",
      "My order has reached the nearest delivery hub, but why isn't it out for delivery yet?",
      "Why can't I track my order even though it has been shipped?",
      "What should I do if my order is approved but hasn't been shipped yet?",
      "I have a complaint about the courier executive who came to deliver my order.",
      "Can I take the shipment after opening and checking the contents inside?",
    ],
    login: [
      "Why am I seeing a 'Google Sign-in Failed' error?",
      "What should I do if I can't log in with my Google account?",
      "Can I use a different Google account to log in?",
      "Is my Google login information secure with Vistraa?",
    ],
    refund: [
      "Can I get a refund if I received a damaged or incorrect item?",
      "What should I do if my refund hasn't been received?",
      "What items are eligible for a refund?",
      "How long does it take to process a refund?",
      "How do I request a refund for an order on Vistaraa?",
    ],
    payment: [
      "How do I know if my payment was successful?",
      "Can I change the payment method after placing an order?",
      "What payment methods does Vistaraa accept?",
      "Is it safe to enter my payment details on Vistaraa?",
      "Why was my payment declined during checkout?",
    ],
    return: [
      "What is Vistaraa return policy?",
      "How do I initiate a return request?",
      "What if the product I received is damaged or defective?",
      "Can I return an item after the return window has closed?",
      "Will I have to pay for the return shipping?",
      "How long does it take for the pickup executive to collect the return?",
    ],
    pickup: [
      "Does Vistaraa offer a pickup option for returns?",
      "Is there a cost for the return pickup service?",
      "How do I schedule a pickup for my return?",
      "Do I need to package the item for pickup?",
      "What should I do if the pickup courier doesn't arrive?",
    ],
    cancellation: [
      "Can I cancel an order after it has been placed?",
      "How long does it take to process a cancellation refund?",
      "How can I cancel an order on Vistaraa?",
      "What should I do if my cancellation request is denied?",
      "Will I be charged for cancelling an order?",
    ],
  };

  const handleToggle = (id) => setOpenCollapseId(openCollapseId === id ? null : id);
  const handleBack = () => navigate(-1); // 🔹 Go back to previous page

  return (
    <div className="faqs-container min-h-screen bg-gray-100 font-sans" id="top">
      
      {/* Header */}
      <header className="faqs-header-bg">
        <div className="faqs-header-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <ArrowLeft 
            className="faqs-back-icon text-white cursor-pointer" 
            onClick={handleBack} 
          />
          <h1 className="faqs-header-title text-white ml-2">Vistaraa</h1>
          <span className="ml-4 opacity-80 border-l border-white pl-3 text-sm font-light text-white">FAQs</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="faqs-main-content max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <h2 className="help-topics-title text-gray-800">Help Topics</h2>
        <div className="space-y-3">
          {faqTopics.map((topic) => {
            const IconComponent = iconComponentMap[topic.iconKey];
            const isActive = openCollapseId === topic.collapseId;

            return (
              <div key={topic.collapseId} className="faq-item">
                <button
                  className={`faq-button flex items-center justify-between ${isActive ? "bg-indigo-100/50" : ""}`}
                  onClick={() => handleToggle(topic.collapseId)}
                  aria-expanded={isActive}
                >
                  <div className="flex items-center">
                    {IconComponent && <IconComponent className="faq-topic-icon w-5 h-5" />}
                    <span className="faq-topic-title ml-2">{topic.title}</span>
                  </div>
                  <ChevronDown className={`faq-arrow w-5 h-5 ${isActive ? "rotate-180" : ""}`} />
                </button>

                {isActive && (
                  <div className="accordion-body">
                    {faqData[topic.collapseId]?.map((q, i) => (
                      <div key={i} className="faq-question">
                        <p className="m-0 text-sm text-gray-800">{q}</p>
                        <ChevronRight className="faq-question-arrow w-4 h-4"/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Scroll to Top */}
      <a href="#top" className="back-to-top-button">
        <ArrowUp className="w-5 h-5"/>
      </a>
    </div>
  );
}

export default Faqs;
