import { Outlet, useLocation, Link } from "react-router-dom";
import Button from "../../../components/ui/button/Button";
import ReusableAccordion from "../../../components/ReusableAccordion/Accordion";

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
      solution: "Check your campaign status (pending/approved). Ensure your budget isn’t exhausted and targeting matches your audience."
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
            <Link to="raise-ticket">
              <Button
              isIcon={false}
                label="Ticket System"
                type="button"
              />
            </Link>
          </div>

          {/* FAQs Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">FAQs</h3>
            <ReusableAccordion
              items={faqItems}
              sx={{
                container: { background: "transparent" },
                summary: { px: 0, py: 1 },
                details: { px: 0, pb: 2 },
              }}
            />
          </div>

          {/* Additional Support Options */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium inline mb-3">Still need help? </h3>
            <div className="flex mt-5 gap-4">
              <Button
                label="Email Us"
                onClick={() => alert("mail us on : abc@gmail.com")}
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Support;