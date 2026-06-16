import React, { useState, lazy, Suspense } from "react";
const DeviceRequest = lazy(() => import("../../admin/Terminal/DeviceRequest"));
const TerminalDevices = lazy(() =>
  import("../../admin/Terminal/TerminalDevices")
);
import LoaderEmpt from "../../../components/loader/LoaderEmpt";

const TABS = [
  { key: "terminal", label: "Active Terminals" },
  { key: "request", label: "Device Requests" },
];

const Terminal = () => {
  const [activeView, setActiveView] = useState("terminal");

  return (
    <div className="flex flex-col gap-5">
      {/* Tab Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={`
              relative px-5 py-2 rounded-xl text-sm font-medium
              transition-all duration-250 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30
              ${activeView === tab.key
                ? "bg-[#4684ff] text-white shadow-md shadow-[#4684ff]/30"
                : "text-gray-500 hover:text-[#4684ff] hover:bg-[#4684ff]/6"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        <Suspense fallback={<LoaderEmpt />}>
          {activeView === "terminal" && <TerminalDevices />}
          {activeView === "request" && <DeviceRequest />}
        </Suspense>
      </div>
    </div>
  );
};

export default Terminal;
