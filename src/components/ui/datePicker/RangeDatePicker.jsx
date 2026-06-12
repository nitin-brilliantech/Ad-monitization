import React, { useState } from "react";
import { useController } from "react-hook-form";
import { format, parseISO } from "date-fns";
import Label from "../label/Label";

const RangeDatePicker = ({
  control,
  name,
  label = "Start - End Date",
  placeholder = "Select Date",
  minDate,
  maxDate,
  rules,
  inputProps = {},
  labelProps = {},
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: { start: "", end: "" },
  });

  const today = format(new Date(), "yyyy-MM-dd");

  const handleDateChange = (type, dateValue) => {
    const newValue = { ...value, [type]: dateValue };
    onChange(newValue);

    if (newValue.start && newValue.end) {
      setTimeout(() => setShowPicker(false), 300);
    }
  };

  const clearDateRange = () => {
    onChange({ start: "", end: "" });
  };

  const formattedRange =
    value.start && value.end
      ? `${format(parseISO(value.start), "MMM dd, yyyy")} - ${format(
          parseISO(value.end),
          "MMM dd, yyyy"
        )}`
      : placeholder;

  return (
    <div className="w-full mt-1">
      {label && (
        <Label text={label} htmlFor={name} {...labelProps} />
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`bts-input-wrapper w-full text-left px-3 text-sm bg-white flex items-center ${
            error ? "border-red-500" : ""
          }`}
          style={{ height: "44px" }}
        >
          <span
            className={`${
              !value.start && !value.end ? "text-gray-400" : "text-gray-800"
            }`}
          >
            {formattedRange}
          </span>
        </button>

        {/* Clear Button */}
        {(value.start || value.end) && (
          <button
            type="button"
            onClick={clearDateRange}
            className="absolute right-3 top-2 text-blue-600 text-xs cursor-pointer"
          >
            Clear
          </button>
        )}

        {/* Date Picker Panel */}
        {showPicker && (
          <div className="absolute z-10 mt-2 w-[500px] rounded-md border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label
                  htmlFor={`${name}-start`}
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Start Date
                </label>
                <input
                  id={`${name}-start`}
                  aria-label="Start Date"
                  type="date"
                  value={value.start || ""}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  min={minDate || today}
                  max={value.end || maxDate}
                  className="w-full rounded-[10px] border-[1.5px] border-gray-300 px-3 py-2 text-sm"
                  {...inputProps}
                />
              </div>

              <div className="pt-7 text-gray-400">—</div>

              <div className="flex-1">
                <label
                  htmlFor={`${name}-end`}
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  End Date
                </label>
                <input
                  id={`${name}-end`}
                  aria-label="End Date"
                  type="date"
                  value={value.end || ""}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  min={value.start || minDate || today}
                  max={maxDate}
                  className="w-full rounded-[10px] border-[1.5px] border-gray-300 px-3 py-2 text-sm"
                  {...inputProps}
                />
              </div>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeDatePicker;



// import React, { useState } from "react";
// import { useController } from "react-hook-form";
// import { format, parseISO } from "date-fns";
// import Label from "../label/Label";

// const RangeDatePicker = ({
//   control,
//   name,
//   label = "Start - End Date",
//   placeholder = "Select Date",
//   minDate,
//   maxDate,
//   rules,
//   inputProps = {},
//   labelProps = {},
// }) => {
//   const [showPicker, setShowPicker] = useState(false);
//   const {
//     field: { value, onChange },
//     fieldState: { error },
//   } = useController({
//     name,
//     control,
//     rules,
//     defaultValue: { start: "", end: "" },
//   });

//   const today = format(new Date(), "yyyy-MM-dd");

//   const handleDateChange = (type, dateValue) => {
//     const newValue = { ...value, [type]: dateValue };
//     onChange(newValue);

//     if (newValue.start && newValue.end) {
//       setTimeout(() => setShowPicker(false), 300);
//     }
//   };

//   const formattedRange =
//     value.start && value.end
//       ? `${format(parseISO(value.start), "MMM dd, yyyy")} - ${format(
//           parseISO(value.end),
//           "MMM dd, yyyy"
//         )}`
//       : placeholder;

//   return (
//     <div className="w-full mt-3">
//       {label && (
//         // <label
//         //   htmlFor={name}
//         //   {...labelProps}
//         // >
//         //   {label}
//         // </label> */}

//         <Label text={label} htmlFor={name} {...labelProps} />
//       )}

//       <div className="relative">
//         <button
//           type="button"
//           onClick={() => setShowPicker(!showPicker)}
//           className={`w-full text-left rounded-md border ${
//             error ? "border-red-500" : "border-gray-300"
//           } bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
//         >
//           <span
//             className={`${
//               !value.start && !value.end ? "text-gray-400" : "text-gray-800"
//             }`}
//           >
//             {formattedRange}
//           </span>
//         </button>

//         {showPicker && (
//           <div className="absolute z-10 mt-2 w-[500px] rounded-md border border-gray-200 bg-white p-4 shadow-lg">
//             <div className="flex items-start gap-4">
//               <div className="flex-1">
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={value.start || ""}
//                   onChange={(e) => handleDateChange("start", e.target.value)}
//                   min={minDate || today}
//                   max={value.end || maxDate}
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   {...inputProps}
//                 />
//               </div>

//               <div className="pt-7 text-gray-400">—</div>

//               <div className="flex-1">
//                 <label className="block text-xs font-medium text-gray-500 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={value.end || ""}
//                   onChange={(e) => handleDateChange("end", e.target.value)}
//                   min={value.start || minDate || today}
//                   max={maxDate}
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//                   {...inputProps}
//                 />
//               </div>
//             </div>

//             {error && (
//               <p className="mt-2 text-sm text-red-600">{error.message}</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RangeDatePicker;
