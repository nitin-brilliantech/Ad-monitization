import { useState } from "react";

const TABS = [
  { key: "Campaign Report", label: "Campaign Report" },
  { key: "Store Report",    label: "Store Report" },
  { key: "Impressions",     label: "Impressions" },
  { key: "Reports",         label: "Reports" },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Campaign Report");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-sm text-gray-400 mt-0.5">View your campaign and store reports</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              relative px-5 py-2 rounded-xl text-sm font-medium
              transition-all duration-250 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30
              ${activeTab === tab.key
                ? "bg-[#4684ff] text-white shadow-md shadow-[#4684ff]/30"
                : "text-gray-500 hover:text-[#4684ff] hover:bg-[#4684ff]/6"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reports;
