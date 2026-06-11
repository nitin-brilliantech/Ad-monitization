import { Outlet, useLocation, Link } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import ReusableAccordion from "../../../components/ReusableAccordion/Accordion";
import { Mail, MessageCircle, FileText } from "lucide-react";

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
          {/* Simple Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Support</h2>
            <Link to="raise-ticket">
              <button className="bg-[#4684ff] text-white hover:bg-[#3a73ee] font-semibold shadow-md px-6 py-2.5 rounded-full transition-colors cursor-pointer">
                Ticket System
              </button>
            </Link>
          </div>

          {/* FAQs Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#4684ff]/10 rounded-lg p-2">
                <FileText className="w-5 h-5 text-[#4684ff]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
            </div>
            <p className="text-gray-600 mb-6">Quick answers to questions you may have</p>
            <ReusableAccordion
              items={faqItems}
              sx={{
                container: { background: "transparent" },
                accordion: { 
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                  borderRadius: "16px",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(70, 132, 255, 0.15)",
                  }
                },
                summary: { 
                  px: 2, 
                  py: 1.5,
                  fontWeight: 600,
                  color: "#1f2937"
                },
                details: { 
                  px: 2, 
                  pb: 2,
                  bgcolor: "#f9fafb"
                },
              }}
            />
          </div>

          {/* Contact Support Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email Support Card */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#4684ff] hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="bg-[#4684ff]/10 rounded-lg p-3 group-hover:bg-[#4684ff] transition-colors">
                    <Mail className="w-6 h-6 text-[#4684ff] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Send us an email and we'll respond within 24 hours
                    </p>
                    <Button
                      label="Email Us"
                      onClick={() => alert("mail us on : abc@gmail.com")}
                      type="button"
                      className="bg-[#4684ff] hover:bg-[#3a73ee] text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-[#10b981] hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="bg-[#10b981]/10 rounded-lg p-3 group-hover:bg-[#10b981] transition-colors">
                    <MessageCircle className="w-6 h-6 text-[#10b981] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Chat with our support team for instant assistance
                    </p>
                    <Button
                      label="Start Chat"
                      onClick={() => alert("Live chat coming soon!")}
                      type="button"
                      className="bg-[#10b981] hover:bg-[#059669] text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Looking for documentation?{" "}
              <a href="#" className="text-[#4684ff] hover:underline font-medium">
                Visit our Knowledge Base
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Support;
