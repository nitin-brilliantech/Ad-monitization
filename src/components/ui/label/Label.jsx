import React from "react";

const Label = ({ text, className = "", ...labelProps }) => {
  if (!text) return null;
  return (
    <label
      {...labelProps}
      className={`block mb-1 text-sm sm:text-base md:text-lg font-medium text-gray-700 ${className}`}
    >
      {text}
    </label>
  );
};

export default Label;
