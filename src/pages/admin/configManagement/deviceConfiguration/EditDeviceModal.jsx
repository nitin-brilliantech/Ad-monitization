import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/ui/input/Input";
import { Modal } from "../../../../components/ui/modal/Modal";
import Select from "react-select";
import Toast from "../../../../components/ui/toast/Toast";

import { updateDevice } from "../../../../redux/slices/admin/deviceSlice";

const deviceOptions = [
  { label: "Cube", value: "Cube" },
  { label: "Cube Pro", value: "Cube Pro" },
  { label: "Billboard", value: "Billboard" },
  { label: "Mobile", value: "Mobile" },
  { label: "Pos", value: "Pos" },
  { label: "Tv", value: "Tv" },
  { label: "Ipad", value: "Ipad" },
];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "10px",
    borderWidth: "1.5px",
    borderColor: state.isFocused ? "#4684ff" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(70,132,255,0.13)" : "none",
    "&:hover": { borderColor: state.isFocused ? "#4684ff" : "#a0aec0" },
  }),
  input: (base) => ({
    ...base,
    outline: 0,
    border: 0,
    boxShadow: "none",
    "& input": {
      outline: "0 !important",
      border: "0 !important",
      boxShadow: "none !important",
    },
    "& input:focus": {
      outline: "0 !important",
      border: "0 !important", 
      boxShadow: "none !important",
    }
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),
};

const EditDeviceModal = ({
  isOpen,
  onClose,
  initialData,
  orientation,
  setOrientation,
}) => {
  const dispatch = useDispatch();
  const formLoading = useSelector((state) => state.device?.formLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      height: "",
      width: "",
      price: "",
    },
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name || "",
        height: initialData.resolutionHeight || "",
        width: initialData.resolutionWidth || "",
        price: initialData.price || "",
      });
      setOrientation(initialData.orientation || "Horizontal");
    }
  }, [initialData, isOpen, reset, setOrientation]);

  const onSubmit = (data) => {
    const finalData = {
      name: data.name.trim(),
      resolutionHeight: Number(data.height),
      resolutionWidth: Number(data.width),
      price: Number(data.price),
      orientation,
    };

    dispatch(updateDevice({ id: initialData.id, data: finalData })).then(
      (res) => {
        if (!res.error) {
          reset();
          onClose();
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Edit Device">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
            {/* Device Type */}
            <Controller control={control} name="name" rules={{ required: "Device type is required" }}
              render={({ field }) => (
                <Select {...field} options={deviceOptions} placeholder="Select device type"
                  value={deviceOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(selected) => field.onChange(selected?.value)}
                  styles={selectStyles}
                  classNamePrefix="device-select"
                />
              )}
            />

            {/* Resolution */}
            <div className="flex space-x-4">
              <Controller control={control} name="height"
                rules={{ required: "Height is required", min: { value: 1, message: "Height must be positive" } }}
                render={({ field }) => (
                  <Input {...field} value={field.value ?? ""} label="Height" placeholder="Height" inputProps={{ type: "number", min: 1 }} error={errors.height?.message} />
                )}
              />
              <Controller control={control} name="width"
                rules={{ required: "Width is required", min: { value: 1, message: "Width must be positive" } }}
                render={({ field }) => (
                  <Input {...field} value={field.value ?? ""} label="Width" placeholder="Width" inputProps={{ type: "number", min: 1 }} error={errors.width?.message} />
                )}
              />
            </div>

            {/* Orientation + Price */}
            <div className="flex w-full items-center justify-between">
              <div>
                <label className="block font-semibold text-md text-gray-900 mb-1">Orientation</label>
                <div className="flex gap-2">
                  {["Horizontal", "Vertical"].map((opt) => (
                    <Button key={opt} type="button" isIcon={false} variant="custom" onClick={() => setOrientation(opt)}
                      className={`w-[110px] h-[30px] rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                        orientation === opt ? "bg-[#4684ff] text-white border-[#4684ff] shadow-md" : "bg-white text-[#4684ff] border-[#4684ff] hover:bg-blue-50"
                      }`} label={opt} />
                  ))}
                </div>
              </div>
              <Controller control={control} name="price"
                rules={{ required: "Price is required", min: { value: 0, message: "Price cannot be negative" } }}
                render={({ field }) => (
                  <Input {...field} value={field.value ?? ""} label="Custom Price (₹)" placeholder="Enter price" inputProps={{ type: "number", min: 0, step: "0.01" }} error={errors.price?.message} />
                )}
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-blue-100">
              <Button type="submit" variant="primary" label="Update Device" isIcon={false} loading={formLoading} />
            </div>
          </div>
      </form>
    </Modal>
  );
};

export default EditDeviceModal;
