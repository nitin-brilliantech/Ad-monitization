import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const Counter = ({
  value: controlledValue,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  size = "md",
  width = "auto",
  color = "gray",
}) => {
  const [value, setValue] = useState(controlledValue ?? 0);

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  const handleChange = (newValue) => {
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    setValue(newValue);
    onChange?.(newValue);
  };

  const plusClick = () => handleChange(value + step);
  const minusClick = () => handleChange(value - step);

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) handleChange(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      plusClick();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      minusClick();
    }
  };

  // Size presets
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  const getColorClasses = () => {
    if (color === "green") return { btn: "text-green-600 hover:bg-green-50 active:bg-green-100", border: "border-green-200" };
    if (color === "red") return { btn: "text-red-600 hover:bg-red-50 active:bg-red-100", border: "border-red-200" };
    return { btn: "text-[#4684ff] hover:bg-blue-50 active:bg-blue-100", border: "border-gray-200" };
  };

  const { btn: buttonColorClasses, border: borderColor } = getColorClasses();

  return (
    <div
      className={`inline-flex items-center ${sizeClasses[size]} bg-white rounded-lg border ${borderColor} shadow-sm overflow-hidden`}
      style={{ width }}
    >
      {/* Minus Button */}
      <button
        onClick={minusClick}
        disabled={value <= min}
        className={`flex items-center justify-center h-full w-8 flex-shrink-0 border-r ${borderColor} transition-all duration-150 ${buttonColorClasses} disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed`}
        aria-label="Decrease"
      >
        <FiMinus size={14} />
      </button>

      {/* Input */}
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        aria-label="Counter value"
        className="flex-1 text-center outline-none bg-transparent font-semibold text-gray-800 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ MozAppearance: "textfield", textAlign: "center" }}
      />

      {/* Plus Button */}
      <button
        onClick={plusClick}
        disabled={value >= max}
        className={`flex items-center justify-center h-full w-8 flex-shrink-0 border-l ${borderColor} transition-all duration-150 ${buttonColorClasses} disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed`}
        aria-label="Increase"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};

export default Counter;
