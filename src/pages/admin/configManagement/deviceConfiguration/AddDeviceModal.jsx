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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Add Device</h2>
          </div>
          <div className="space-y-4 pt-2">
            {/* Device Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Device Type</label>
              <Controller control={control} name="name" rules={{ required: "Device type is required" }}
                render={({ field }) => (
                  <Select {...field} options={deviceOptions} placeholder="Select device type"
                    value={deviceOptions.find(opt => opt.value === field.value) || null}
                    onChange={selected => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Resolution */}
            <div className="flex space-x-4">
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Height</label>
                <input type="number" {...register("height", { required: "Height is required", valueAsNumber: true })} placeholder="Height"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff]" />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Width</label>
                <input type="number" {...register("width", { required: "Width is required", valueAsNumber: true })} placeholder="Width"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff]" />
                {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
              </div>
            </div>

            {/* Orientation + Price */}
            <div className="flex w-full items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Orientation</label>
                <div className="flex gap-2">
                  {["Horizontal", "Vertical"].map((opt) => (
                    <Button key={opt} type="button" isIcon={false} variant="custom" onClick={() => setOrientation(opt)}
                      className={`w-[110px] h-[30px] rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                        orientation === opt ? "bg-[#4684ff] text-white border-[#4684ff] shadow-md" : "bg-white text-[#4684ff] border-[#4684ff] hover:bg-blue-50"
                      }`} label={opt} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Custom Price (₹)</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="Enter price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff]" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-blue-100">
              <Button type="submit" variant="primary" label="Add Device" loading={formLoading} />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;