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
  disabled,
  type,
}) => {
  return (
    <div className="mb-4 mt-1">
      <Label text={label} htmlFor={name} {...labelProps} />
      <div
        className={`bts-input-wrapper flex items-center w-full bg-white px-4 gap-2.5 ${
          error ? "border-red-500" : ""
        } ${className}`}
      >
        {icon && iconPosition === "left" && (
          <div className="flex items-center text-gray-400 pointer-events-none shrink-0">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          ref={ref}
          {...inputProps}
          className={`bts-input-inner flex-grow bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm font-normal h-full ${
            error ? "text-red-700" : ""
          } ${inputProps?.className ?? ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {icon && iconPosition === "right" && (
          <div className="flex items-center text-gray-400 pointer-events-none shrink-0">
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
