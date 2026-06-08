import React from "react";

const StatCard = ({
  title,
  value,
  change,
  changeColor = "text-green-600",
  bgGradient = "bg-gradient-to-r from-blue-50 to-red-50", 
  currency = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col w-full min-h-[102px] rounded-[12px] border border-gray-200 p-3 gap-[15px] shadow-sm transition duration-300 ${bgGradient} ${className}`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-600">{title}</p>
        <span className={`text-xs font-semibold ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">
        {currency && "₹"}
        {value}
      </h3>
    </div>
  );
};

export default StatCard;
