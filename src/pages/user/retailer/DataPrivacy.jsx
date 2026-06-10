import React, { useState } from "react";
import LiquidToggle from "../../../components/ui/toggle/LiquidToggle";

const DataPrivacy = () => {
  const [isOn, setIsOn] = useState(true);

  return (
    <div className="flex flex-col w-full gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Data Privacy</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage how your data is shared</p>
      </div>

      {/* Privacy card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#4684ff]/10 text-[#4684ff] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Allow Data Sharing</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isOn
                  ? "Your data is being shared with trusted partners"
                  : "Your data is private and not shared"}
              </p>
            </div>
          </div>

          <LiquidToggle
            checked={isOn}
            onChange={() => setIsOn((prev) => !prev)}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
