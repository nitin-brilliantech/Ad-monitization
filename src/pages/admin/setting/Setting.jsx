import { useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { FiChevronRight } from "react-icons/fi";

const Setting = () => {
  const [activeView, setActiveView] = useState("none");

  const adCategoryData = [
    {
      id: 1,
      devices: ["Xenie Mobile (User)", "Cube Xenie Side 1"],
      category: "Product Promotion",
      status: "Active",
    },
    {
      id: 2,
      devices: ["Xenie Mobile (User)", "Cube Xenie Side 1", "Xenie Mobile - Add Banner (User)"],
      category: "New Launch",
      status: "Inactive",
    },
    // Add more fake data here
  ];

  const blockedDevicesData = adCategoryData.map((item) => ({
    ...item,
    status: "Activate",
  }));

  const columns = [
    {
      id: "devices",
      label: "Allowed Devices",
      render: (row) => (
        <div className="flex flex-col text-sm">
          {row.devices.map((dev, idx) => (
            <span key={idx}>{dev}</span>
          ))}
        </div>
      ),
    },
    {
      id: "category",
      label: "Category",
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-700"
              : row.status === "Inactive"
              ? "bg-gray-100 text-gray-500"
              : "border border-[#445C91] text-[#445C91]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toggle Buttons */}
      {activeView === "none" && (
        <div className="space-y-4">
          <div
            className="bg-white shadow-sm px-4 py-3 rounded-md flex justify-between items-center cursor-pointer"
            onClick={() => setActiveView("adCategory")}
          >
            <span className="text-sm font-medium">Ad Categories</span>
            <FiChevronRight size={20} />
          </div>

          <div
            className="bg-white shadow-sm px-4 py-3 rounded-md flex justify-between items-center cursor-pointer"
            onClick={() => setActiveView("blockStatus")}
          >
            <span className="text-sm font-medium">Block Status</span>
            <FiChevronRight size={20} />
          </div>
        </div>
      )}

      {/* Ad Category Table */}
      {activeView === "adCategory" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Ad Category</h2>
            <button
              className="text-sm text-[#445C91] underline"
              onClick={() => setActiveView("none")}
            >
              Back
            </button>
          </div>
          <ReusableTable columns={columns} rows={adCategoryData} loading={false} />
        </div>
      )}

      {/* Block Status Table */}
      {activeView === "blockStatus" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Blocked Devices</h2>
            <button
              className="text-sm text-[#445C91] underline"
              onClick={() => setActiveView("none")}
            >
              Back
            </button>
          </div>
          <ReusableTable columns={columns} rows={blockedDevicesData} loading={false} />
        </div>
      )}
    </div>
  );
};

export default Setting;
