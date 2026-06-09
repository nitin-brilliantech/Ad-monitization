import { useState } from "react";
import DeviceConfiguration from "./deviceConfiguration/DeviceConfiguration";
import LocationConfiguration from "./locationConfiguration/LocationConfiguration";
import ProductConfiguration from "./productConfiguration/ProductConfiguration";

const TABS = [
  { key: "device",   label: "Device Configuration" },
  { key: "location", label: "Location Configuration" },
  { key: "product",  label: "Product Configuration" },
];

const ConfigurationManagement = () => {
  const [activeTab, setActiveTab] = useState("device");

  const renderComponent = () => {
    switch (activeTab) {
      case "device":   return <DeviceConfiguration />;
      case "location": return <LocationConfiguration />;
      case "product":  return <ProductConfiguration />;
      default:         return null;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configuration Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage devices, locations and products</p>
      </div>

      {/* Tab Bar */}
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

      {/* Tab Content — no wrapper card; sub-pages manage their own layout */}
      <div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default ConfigurationManagement;
