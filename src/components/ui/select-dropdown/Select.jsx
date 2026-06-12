// components/ui/select-dropdown/Select.jsx
import React from "react";
import SelectLib from "react-select";
import { Controller } from "react-hook-form";
import Label from "../label/Label";

/* ── Dropdown open/close animation via CSS class injected by react-select ── */
const menuAnimation = `
  @keyframes bts-menu-in {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  .bts-menu-animated {
    animation: bts-menu-in 180ms ease forwards;
    transform-origin: top center;
  }
`;

/* Inject animation styles once into <head> */
if (typeof document !== "undefined" && !document.getElementById("bts-select-anim")) {
  const tag = document.createElement("style");
  tag.id = "bts-select-anim";
  tag.textContent = menuAnimation;
  document.head.appendChild(tag);
}

/* ── Animated chevron indicator ── */
const DropdownIndicator = ({ innerProps, selectProps }) => (
  <div
    {...innerProps}
    style={{
      display: "flex",
      alignItems: "center",
      paddingRight: "12px",
      paddingLeft: "4px",
      color: selectProps.menuIsOpen ? "#4684ff" : "#9ca3af",
      transition: "color 180ms ease",
    }}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 200ms ease",
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/* ── Shared react-select styles ── */
const makeStyles = (error) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    height: "44px",
    borderRadius: "10px",
    borderWidth: "1.5px",
    borderColor: error ? "#ef4444" : state.isFocused ? "#4684ff" : "#d1d5db",
    boxShadow: state.isFocused
      ? "0 0 0 4px rgba(70,132,255,0.13), 0 6px 16px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)"
      : "none",
    transform: state.isFocused ? "translateY(-2px)" : "none",
    backgroundColor: "#ffffff",
    transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
    "&:hover": {
      borderColor: state.isFocused ? "#4684ff" : "#a0aec0",
    },
    cursor: "pointer",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
    height: "44px",
    flexWrap: "nowrap",
    overflowX: "auto",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontSize: "14px",
    color: "#0f172a",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#0f172a",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#9ca3af",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "44px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#eff6ff",
    borderRadius: "6px",
    border: "1px solid #bfdbfe",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "500",
    paddingLeft: "6px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#93c5fd",
    borderRadius: "0 6px 6px 0",
    ":hover": {
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
    },
  }),
  /* Portal menu — floats above everything */
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    boxShadow:
      "0 20px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)",
    border: "1.5px solid #e5e7eb",
    overflow: "hidden",
    marginTop: "6px",
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
    maxHeight: "220px",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    borderRadius: "8px",
    margin: "1px 0",
    padding: "8px 12px",
    backgroundColor: state.isSelected
      ? "#4684ff"
      : state.isFocused
      ? "rgba(70,132,255,0.08)"
      : "transparent",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
    fontWeight: state.isSelected ? "500" : "400",
    transition: "background-color 120ms ease",
  }),
});

const Select = ({
  name,
  label,
  options = [],
  control,
  multi = false,
  inputProps = {},
  error,
}) => {
  const styles = makeStyles(error);

  return (
    <div className="flex flex-col space-y-1 w-full">
      <Label text={label} htmlFor={name} />
      <Controller
        name={name}
        control={control}
        defaultValue={multi ? [] : null}
        render={({ field }) => (
          <SelectLib
            inputId={name}
            isMulti={multi}
            options={options}
            value={
              multi
                ? options.filter((opt) => field.value?.includes(opt.value))
                : options.find((opt) => opt.value === field.value) || null
            }
            onChange={(selected) => {
              if (multi) {
                field.onChange(selected ? selected.map((opt) => opt.value) : []);
              } else {
                field.onChange(selected?.value || "");
              }
            }}
            styles={styles}
            components={{ DropdownIndicator }}
            /* Render menu in document.body — fixes z-index / overflow clipping */
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPosition="fixed"
            /* Attach animation class to the menu wrapper */
            classNamePrefix="bts"
            classNames={{
              menu: () => "bts-menu-animated",
            }}
            placeholder="Select..."
            className="text-sm"
            {...inputProps}
          />
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
