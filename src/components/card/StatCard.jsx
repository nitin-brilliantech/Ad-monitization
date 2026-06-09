import React from "react";

const StatCard = ({
  title,
  value,
  change,
  changeColor = "text-green-600",
  bgGradient = "bg-white", 
  currency = false,
  description = "",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col justify-between w-full h-[150px] rounded-[16px] border-l-4 border-[#5B7FE5] bg-white p-4 shadow-md hover:shadow-xl hover:scale-101 hover:border-l-[6px] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${className}`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 ${changeColor}`}>
          {change}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {currency && "₹"}
          {value}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
