import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Modal } from "../../../components/ui/modal/Modal";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import Toast from "../../../components/ui/toast/Toast";
import LocationFields from "../../../components/LocationsDropdown/LocationFields";
import Select from "react-select";

import { createRequest, updateRequest } from "../../../redux/slices/user/terminalSlice";

// Device options
const deviceOptions = [
  { label: "Cube", value: "Cube" },
  { label: "Cube Pro", value: "Cube Pro" },
  { label: "Billboard", value: "Billboard" },
  { label: "Mobile", value: "Mobile" },
  { label: "Pos", value: "Pos" },
  { label: "Tv", value: "Tv" },
  { label: "Ipad", value: "Ipad" },
];

const AddDeviceModal = ({ isOpen, onClose, initialData, formLoading = false }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // preload form when editing
  useEffect(() => {
    if (initialData) {
      reset({
        deviceId: initialData.deviceId || "",
        quantity: initialData.quantity || 1,
        ...initialData,
      });
    } else {
      reset({ deviceId: "", quantity: 1 });
    }
  }, [initialData, reset]);

  const watchedCountry = watch("country");
  const watchedState = watch("state");
  const watchedCity = watch("city");
  const isRegionEnabled = watchedCountry && watchedState && watchedCity;

  const onSubmit = (formData) => {
    const payload = {
      name: formData.deviceId,
      qty: formData.quantity,
      address: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
        region: {
          name: formData.regionName,
          postcode: formData.regionPostcode,
        },
      },
    };

    if (initialData) {
      // update mode
      dispatch(updateRequest({ id: initialData.id, data: payload })).then((res) => {
        if (!res.error) {
          reset();
          onClose();
          Toast.success("Success", "Device updated successfully!");
        } else {
          Toast.error("Failed", "Failed to update device!");
        }
      });
    } else {
      // create mode
      dispatch(createRequest(payload)).then((res) => {
        if (!res.error) {
          reset();
          onClose();
          Toast.success("Success", "Device added successfully!");
        } else {
          Toast.error("Failed", "Failed to add device!");
        }
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-xl font-bold">
              {initialData ? "Update Device" : "Add Device"}
            </h2>
          </div>

          <div className="space-y-4">
            {/* Device Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Device</label>
              <Select
                options={deviceOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select a device"
                defaultValue={
                  initialData
                    ? deviceOptions.find((opt) => opt.value === initialData.deviceId)
                    : null
                }
                onChange={(option) => setValue("deviceId", option.value)}
              />
              {errors.deviceId && (
                <p className="text-red-500 text-sm">Device is required</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <Input
                type="number"
                placeholder="Enter quantity"
                className="w-full"
                {...register("quantity", { required: true, min: 1 })}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">Quantity must be at least 1</p>
              )}
            </div>

            {/* Location Fields */}
            <LocationFields
              control={control}
              setValue={setValue}
              watch={watch}
              errors={errors}
              isPostcode={false}
              customStyles="react-select-container"
            />

            {/* Region / Locality */}
            <div>
              <label className="block text-sm font-medium">Region / Locality</label>
              <input
                type="text"
                placeholder="Enter Region"
                className={`w-full p-2 border rounded-md ${
                  !isRegionEnabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "border-gray-300"
                }`}
                {...register("regionName", { required: isRegionEnabled })}
                disabled={!isRegionEnabled}
              />
            </div>

            {/* Postcode */}
            {/* <div>
              <label className="block text-sm font-medium">Postcode</label>
              <input
                type="text"
                placeholder="Enter Postcode"
                className={`w-full p-2 border rounded-md ${
                  !isRegionEnabled
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "border-gray-300"
                }`}
                {...register("regionPostcode", { required: isRegionEnabled })}
                disabled={!isRegionEnabled}
              />
            </div> */}

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                label={initialData ? "Update Device" : "Request Device"}
                className="px-6 py-2"
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddDeviceModal;