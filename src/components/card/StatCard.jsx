import React from "react";

const StatCard = ({
  title,
  value,
  change,
  changeColor = "text-green-600",
  bgGradient = "bg-white", 
  currency = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col w-full min-h-[102px] rounded-[16px] border-l-4 border-[#5B7FE5] bg-white p-4 gap-3 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-900">
        {currency && "₹"}
        {value}
      </h3>
    </div>
  );
};

export default StatCard;
