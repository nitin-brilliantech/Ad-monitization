import React from "react";
import { SearchIcon } from "../../../icon/index";

/**
 * Uniform SearchBar component — blue theme consistent with the app's primary palette.
 *
 * Props:
 *  value       - controlled input value
 *  onChange    - change handler (receives the string value directly)
 *  placeholder - input placeholder text (default: "Search...")
 *  className   - extra wrapper classes
 *  inputProps  - any extra props forwarded to the <input> element
 */
const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
  inputProps = {},
}) => {
  return (
    <div
      className={`flex items-center h-[40px] w-full rounded-lg border border-gray-300 bg-white px-3 gap-2.5 shadow-xs
        transition-all duration-200
        focus-within:border-[#445C91] focus-within:ring-2 focus-within:ring-[#445C91]/20
        hover:border-[#445C91]/60
        ${className}`}
    >
      {/* Search icon — blue tint */}
      <span className="flex items-center shrink-0 text-[#445C91]">
        <SearchIcon className="w-[18px] h-[18px]" />
      </span>

      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        autoComplete="off"
        {...inputProps}
        className={`flex-grow bg-transparent border-none outline-none
          text-gray-800 placeholder-gray-400 text-sm font-normal
          [&::-webkit-search-cancel-button]:hidden
          ${inputProps.className ?? ""}`}
      />
    </div>
  );
};

export default SearchBar;
