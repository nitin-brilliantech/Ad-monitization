import React from "react";
import Label from "../label/Label";

const Input = ({
  name,
  label,
  labelProps = {},
  placeholder = "",
  inputProps = {},
  className = "",
  error = "",
  icon,
  iconPosition = "left",
  value,
  onChange,
  onBlur,
  ref,
  disabled
}) => {
  return (
    <div className="mb-4 mt-1">
      <Label text={label} htmlFor={name} {...labelProps} />
      <div
        className={`flex items-center w-full  h-[40px] rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } py-2 px-4 gap-2.5 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-xs ${className}`}
      >
        {icon && iconPosition === "left" && (
          <div className="flex items-center text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          ref={ref}
          {...inputProps}
          className={`flex-grow bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-base font-normal ${
            error ? "text-red-700" : ""
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {icon && iconPosition === "right" && (
          <div className="flex items-center text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
