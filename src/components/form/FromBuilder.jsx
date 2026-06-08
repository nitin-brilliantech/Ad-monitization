import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import isEqual from "lodash.isequal"; // For deep object comparison
import FieldRenderer from "./FieldRenderer";
import Button from "../ui/button/Button";

// Util: returns Tailwind grid span based on config
const getGridClass = (field, row) => {
  if (field.gridSpan === 3 || row.length === 1) return "col-span-1 md:col-span-3";
  if (field.gridSpan === 2) return "col-span-1 md:col-span-2";
  return "col-span-1";
};

const FormBuilder = ({
  onSubmit,
  fieldsConfig = [],
  dropdowns = {},
  methods,
  isEdit = false,
  title = "Form",
  submitLabel = "Submit",
  loading = false,
  estimateApi = null,
  estimateWatchFields = [],
  estimateSetField = null,
  isPlus=true
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = methods || useFormContext();

  const debounceRef = useRef(null);
  const lastPayloadRef = useRef({});

  useEffect(() => {
    if (!estimateApi || estimateWatchFields.length === 0 || !estimateSetField) return;

    const subscription = watch((values) => {
      const allFilled = estimateWatchFields.every((f) => {
        const val = values[f];
        return Array.isArray(val) ? val.length > 0 : !!val;
      });

      if (!allFilled) return;

      const fieldKeyMap = {
        product: "productTypes",
        targetDevices: "devices",
        regions: "regions",
      };

      const payload = estimateWatchFields.reduce((acc, field) => {
        const backendKey = fieldKeyMap[field] || field;
        const value = values[field];
        acc[backendKey] = Array.isArray(value)
          ? value.filter(Boolean).map((v) => (typeof v === "string" ? v.trim() : v))
          : value;
        return acc;
      }, {});

      // Skip API call if payload hasn't changed
      if (isEqual(payload, lastPayloadRef.current)) return;

      lastPayloadRef.current = payload;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        estimateApi(payload)
          .then((price) => {
            console.log("Estimated price:", price);
            setValue(estimateSetField, price);
            console.log(`Set ${estimateSetField} to estimated price:`, price);
          })
          .catch((err) => {
            console.error("Estimation error:", err.response?.data || err.message);
          });
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watch, estimateApi, estimateWatchFields, estimateSetField, setValue]);

  const handleFormSubmit = (data) => {
    if (onSubmit) onSubmit(data);
  };

  const injectedFields = fieldsConfig.map((row) =>
    row.map((field) =>
      dropdowns[field.name] ? { ...field, options: dropdowns[field.name] } : field
    )
  );

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="p-6 bg-white rounded-xl space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {/* {title || (isEdit ? "Update Campaign" : "Create Campaign")} */}
        {title || (isEdit && "Update Campaign")}

      </h2>

      {injectedFields.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {row.map((field) => (
            <div key={field.name} className={getGridClass(field, row)}>
              <FieldRenderer field={field} control={control} errors={errors} isEdit={isEdit} />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <Button
        isIcon={isPlus}
        className="cursor-pointer"
          type="submit"
          label={submitLabel || (isEdit ? "Update Campaign" : "Create Campaign")}
          loading={loading}
        />
      </div>
    </form>
  );
};

export default FormBuilder;