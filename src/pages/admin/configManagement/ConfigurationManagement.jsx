import { useEffect, useState } from "react";
import DeviceConfiguration from "./deviceConfiguration/DeviceConfiguration";
import LocationConfiguration from "./locationConfiguration/LocationConfiguration";
import ProductConfiguration from "./productConfiguration/ProductConfiguration";

const ConfigurationManagement = () => {
  const [activeTab, setActiveTab] = useState("device");
  const renderComponent = () => {
    switch (activeTab) {
      case "device":
        return <DeviceConfiguration />;
      case "location":
        return <LocationConfiguration />;
      case "product":
        return <ProductConfiguration />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Configuration Management</h2>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "device" ? "bg-[#445E94] text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("device")}
        >
          Device Configuration
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "location" ? "bg-[#445E94] text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("location")}
        >
          Location Configuration
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "product" ? "bg-[#445E94] text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("product")}
        >
          Product Configuration
        </button>
      </div>

      {renderComponent()}
    </div>
  );
};

export default ConfigurationManagement;
