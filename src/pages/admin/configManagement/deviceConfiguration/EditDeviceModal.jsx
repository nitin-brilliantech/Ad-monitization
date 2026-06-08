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
          Toast.success("Device update successfully!");
        } else {
          Toast.error(res?.error?.message || "Failed to update device!");
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">Edit Device</h2>

          {/* Device Type */}
          <Controller
            control={control}
            name="name"
            rules={{ required: "Device type is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={deviceOptions}
                placeholder="Select device type"
                value={
                  deviceOptions.find((opt) => opt.value === field.value) || null
                }
                onChange={(selected) => field.onChange(selected?.value)}
              />
            )}
          />

          {/* Resolution */}
          <div className="flex space-x-4">
            <Controller
              control={control}
              name="height"
              rules={{
                required: "Height is required",
                min: { value: 1, message: "Height must be positive" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  label="Height"
                  placeholder="Height"
                  inputProps={{ type: "number", min: 1 }}
                  error={errors.height?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="width"
              rules={{
                required: "Width is required",
                min: { value: 1, message: "Width must be positive" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  label="Width"
                  placeholder="Width"
                  inputProps={{ type: "number", min: 1 }}
                  error={errors.width?.message}
                />
              )}
            />
          </div>

          {/* Orientation & Price */}
          <div className="flex w-full items-center justify-between">
            <div>
              <label className="block text-sm font-medium mb-1">
                Orientation
              </label>
              <div className="flex gap-4">
                {["Horizontal", "Vertical"].map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    isIcon={false}
                    variant="custom"
                    onClick={() => setOrientation(opt)}
                    className={`w-[110px] h-[30px] rounded-full text-sm font-semibold border transition-all duration-150 ${
                      orientation === opt
                        ? "bg-[#445C91] text-white border-[#445C91]"
                        : "bg-white text-[#445C91] border-[#445C91]"
                    }`}
                    label={opt}
                  />
                ))}
              </div>
            </div>

            <Controller
              control={control}
              name="price"
              rules={{
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  label="Custom Price (₹)"
                  placeholder="Enter price"
                  inputProps={{ type: "number", min: 0, step: "0.01" }}
                  error={errors.price?.message}
                />
              )}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              label="Update Device"
              isIcon={false}
              className="px-6 py-2"
              loading={formLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditDeviceModal;
