import { Outlet, useLocation } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import ReusableAccordion from "../../../components/ReusableAccordion/Accordion";
import TicketRaise from "../../user/Ticket/TicketRaise";

const Support = () => {
  const location = useLocation();
  const isRaiseTicket = location.pathname.includes("raise-ticket");

  const faqItems = [
    {
      id: 1,
      question: "How do I create a new ad campaign?",
      solution: "Navigate to 'Campaigns' > 'Create New'. Set your budget, target audience, and ad creative. Submit for review."
    },
    {
      id: 2,
      question: "Why are my ads not visible?",
      solution: "Check your campaign status (pending/approved). Ensure your budget isn't exhausted and targeting matches your audience."
    },
    {
      id: 3,
      question: "How can I change device or location settings?",
      solution: "Go to 'Settings' > 'Targeting'. Adjust device types (iOS/Android) and geolocation preferences."
    },
    {
      id: 4,
      question: "When can I withdraw my earnings?",
      solution: "Earnings are available 30 days after ad display. Withdraw via 'Wallet' > 'Payout' (minimum $10)."
    },
    {
      id: 5,
      question: "Revenue calculation seems incorrect. What should I do?",
      solution: "Compare your dashboard with raw logs in 'Reports'. Contact support if discrepancies persist."
    },
  ];

  return (
    <div className="">
      {isRaiseTicket ? (
        <Outlet />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Support</h2>
          </div>

          <TicketRaise />

          {/* FAQs Section */}
          <div className="mb-8 mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            {/* FAQ Header */}
            <div className="bg-[#4684ff] px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Frequently Asked Questions
              </h3>
              <p className="text-blue-100 text-sm mt-1">Find quick answers to common questions</p>
            </div>
            
            {/* FAQ Content */}
            <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
              <ReusableAccordion
                items={faqItems}
                sx={{
                  container: { background: "transparent" },
                  summary: { px: 0, py: 1 },
                  details: { px: 0, pb: 2 },
                }}
              />
            </div>
          </div>

          {/* Additional Support Options */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
              <h3 className="text-lg font-bold text-[#4684ff] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Still need help?
              </h3>
              <p className="text-[#4684ff] text-sm mt-1">Our support team is here to assist you</p>
            </div>
            <div className="p-6">
              <div className="flex gap-4">
                <Button
                  label="Email Us"
                  onClick={() => alert("mail us on : abc@gmail.com")}
                  type="button"
                  className="bg-[#4684ff] text-white shadow-md"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Support;
