import React from "react";

/**
 * LiquidToggle — clean, smooth, uniform toggle.
 *
 * Props:
 *  checked   - boolean
 *  onChange  - () => void
 *  disabled  - boolean
 *  size      - "sm" | "md"
 *  variant   - "blue" | "white"
 *  label     - optional string
 */
const LiquidToggle = ({
  checked = false,
  onChange,
  disabled = false,
  size = "sm",
  variant = "blue",
  label,
}) => {
  const handleClick = () => {
    if (!disabled) onChange?.();
  };

  /* ── All sizes use the same proportional approach ── */
  const isSmall = size === "sm";

  // track: 36×20 (sm) or 44×24 (md)
  const trackStyle = isSmall
    ? { width: 36, height: 20, borderRadius: 10 }
    : { width: 44, height: 24, borderRadius: 12 };

  // thumb: always 4px smaller than track height, centered with 2px inset
  const thumbSize = isSmall ? 14 : 18;
  const thumbOffset = isSmall ? 3 : 3;                      // left gap off
  const thumbTravel = isSmall ? 36 - thumbSize - thumbOffset - 1 : 44 - thumbSize - thumbOffset - 1;

  const trackBg = checked
    ? variant === "white" ? "rgba(255,255,255,0.35)" : "#4684ff"
    : variant === "white" ? "rgba(255,255,255,0.15)" : "#d1d5db";

  const trackBorder = checked
    ? variant === "white" ? "1px solid rgba(255,255,255,0.5)" : "1px solid #3a6fe6"
    : variant === "white" ? "1px solid rgba(255,255,255,0.2)" : "1px solid #c8cdd6";

  return (
    <div
      className={`inline-flex items-center gap-2 select-none
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); handleClick(); } }}
    >
      {/* Track */}
      <div
        style={{
          ...trackStyle,
          backgroundColor: trackBg,
          border: trackBorder,
          position: "relative",
          transition: "background-color 0.25s ease, border-color 0.25s ease",
          flexShrink: 0,
        }}
      >
        {/* Thumb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: thumbOffset,
            width: thumbSize,
            height: thumbSize,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.20)",
            transform: `translate(${checked ? thumbTravel : 0}px, -50%)`,
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      {label && (
        <span className={`text-sm font-medium
          ${variant === "white" ? "text-white" : "text-gray-700"}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LiquidToggle;
