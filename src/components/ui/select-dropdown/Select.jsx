// components/ui/select-dropdown/Select.jsx
import React from "react";
import SelectLib from "react-select";
import { Controller } from "react-hook-form";
import Label from "../label/Label";

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: "0.375rem",
    borderColor: "#D1D5DB", // Tailwind gray-300
    minHeight: "38px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#E5E7EB", // Tailwind gray-200
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#111827", // Tailwind gray-900
  }),
};

const Select = ({
  name,
  label,
  options = [],
  control,
  multi = false,
  inputProps = {},
}) => {
  return (
    <div className="flex flex-col space-y-1 w-full ">
      {/* {label && <label className="font-medium mb-1 mt-2">{label}</label>} */}
            <Label text={label} htmlFor={name}  />


      <Controller
        name={name}
        control={control}
        defaultValue={multi ? [] : null}
        render={({ field }) => (
          <SelectLib
            isMulti={multi}
            options={options}
            value={
              multi
                ? options.filter((opt) => field.value?.includes(opt.value))
                : options.find((opt) => opt.value === field.value) || null
            }
            onChange={(selected) => {
              if (multi) {
                field.onChange(selected.map((opt) => opt.value));
              } else {
                field.onChange(selected?.value || "");
              }
            }}
            styles={customStyles}
            className="text-sm"
            {...inputProps}
          />
        )}
      />
    </div>
  );
};

export default Select;

