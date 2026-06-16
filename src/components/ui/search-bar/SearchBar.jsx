import React, { useState, useRef } from "react";
import { SearchIcon } from "../../../icon/index";

/**
 * Professional SearchBar component — blue theme, smooth animations.
 *
 * Props:
 *  value         - controlled input value
 *  onChange      - change handler (receives string value directly)
 *  placeholder   - input placeholder (default: "Search...")
 *  className     - extra wrapper classes
 *  inputProps    - extra props forwarded to <input>
 *  onClear       - optional callback when clear button is clicked
 */
const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
  inputProps = {},
  onClear,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      className={`
        group relative flex items-center h-[42px] w-full
        rounded-xl border bg-white px-3.5 gap-2.5
        shadow-sm
        transition-all duration-300 ease-in-out
        ${
          isFocused
            ? "border-[#4684ff] ring-[3px] ring-[#4684ff]/15 shadow-md"
            : "border-gray-200 hover:border-[#4684ff]/50 hover:shadow-md"
        }
        ${className}
      `}
    >
      {/* Search icon — animates color on focus */}
      <span
        className={`
          flex items-center shrink-0
          transition-all duration-300
          ${isFocused ? "text-[#4684ff] scale-110" : "text-gray-400 group-hover:text-[#4684ff]/70"}
        `}
      >
        <SearchIcon className="w-[17px] h-[17px]" />
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        {...inputProps}
        className={`
          bts-input-inner flex-grow bg-transparent border-none outline-none
          text-gray-800 placeholder-gray-400 text-sm font-normal
          transition-all duration-200
          ${inputProps.className ?? ""}
        `}
      />

      {/* Clear button — slides in when there's a value */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            flex items-center justify-center shrink-0
            w-[18px] h-[18px] rounded-full
            bg-gray-200 hover:bg-[#4684ff] text-gray-500 hover:text-white
            transition-all duration-200 ease-in-out
            animate-fadeIn
          `}
          aria-label="Clear search"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
