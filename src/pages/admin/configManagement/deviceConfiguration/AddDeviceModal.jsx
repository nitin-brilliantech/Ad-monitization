import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal/Modal";
import Select from "react-select";
import { createDevice } from "../../../../redux/slices/admin/deviceSlice";
import Toast from "../../../../components/ui/toast/Toast"

const deviceOptions = [
  { label: "Cube", value: "Cube" },
  { label: "Cube Pro", value: "Cube Pro" },
  { label: "Billboard", value: "Billboard" },
  { label: "Mobile", value: "Mobile" },
  { label: "Pos", value: "Pos" },
  { label: "Tv", value: "Tv" },
  { label: "Ipad", value: "Ipad" },
];


const AddDeviceModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const formLoading = useSelector((state) => state.device.formLoading);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const [orientation, setOrientation] = useState("Horizontal");

  const onSubmit = (data) => {
  const finalData = {
    name: data.name,
    resolutionHeight: Number(data.height),
    resolutionWidth: Number(data.width),
    price: Number(data.price),
    orientation,
  };

  dispatch(createDevice(finalData)).then((res) => {
  if (!res.error) {
    Toast.success("Device added successfully!");
    reset();
    onClose();
  } else {
    Toast.error(res?.error?.message || "Failed to add device!");
  }
});

};


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">Add Device</h2>

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Device Type</label>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Device type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={deviceOptions}
                  placeholder="Select device type"
                  value={deviceOptions.find(opt => opt.value === field.value) || null}
                  onChange={selected => field.onChange(selected?.value)}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Resolution */}
          <div className="flex space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                {...register("height", { required: "Height is required", valueAsNumber: true })}
                placeholder="Height"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                {...register("width", { required: "Width is required", valueAsNumber: true })}
                placeholder="Width"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.width && <p className="text-red-500 text-sm">{errors.width.message}</p>}
            </div>
          </div>

         

          {/* Orientation */}
          <div className="flex w-full items-center justify-between">
            <div>
              <label className="block text-sm font-medium mb-1">Orientation</label>
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
             {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Custom Price (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="Enter price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              label="Add Device"
              className="px-6 py-2"
              loading={formLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;