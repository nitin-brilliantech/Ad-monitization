import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { Modal } from "../../../components/ui/modal/Modal";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import { createUser } from "../../../redux/slices/admin/userManagementSlice";
import Toast from "../../../components/ui/toast/Toast";
import LocationFields from "../../../components/LocationsDropdown/LocationFields";

const AddUserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { formLoading } = useSelector((state) => state.usersManagement);
  const [selectedRole, setSelectedRole] = useState("Retailer");

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      role: selectedRole,
      status: "ACTIVE",
    };
    dispatch(createUser(payload)).then((res) => {
      if (!res.error) {
        reset();
        setSelectedRole("Retailer");
        onClose();
        Toast.success("Success", "User Added successfully!");
      } else {
        Toast.error("Failed", "Failed to add user!");
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Add New User">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Form fields */}
          <div className="space-y-5">
            {/* Name + Role */}
            <div className="flex">
              <div className="flex-1 mr-4 gap-2">
                <label className="block font-semibold text-md text-gray-900 mb-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full"
                  {...register("fullName", { required: true })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">Full Name is required</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-md text-gray-900 mb-1">Role</label>
                <div className="flex gap-2">
                  {["Retailer", "Ad-Agency"].map((role) => (
                    <Button
                      key={role}
                      isIcon={false}
                      variant="custom"
                      type="button"
                      className={`w-[110px] h-[30px] rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                        selectedRole === role
                          ? "bg-[#4684ff] text-white border-[#4684ff] shadow-md"
                          : "bg-white text-[#4684ff] border-[#4684ff] hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedRole(role)}
                      label={role}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ✅ Business Name */}
            <div>
              <label className="block font-semibold text-md text-gray-900 mb-1">Business Name</label>
              <Input
                type="text"
                placeholder="Legal Name as per Tax Certificate"
                className="w-full"
                {...register("businessName", { required: true })}
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">Business Name is required</p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block font-semibold text-md text-gray-900 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">Email is required</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-md text-gray-900 mb-1">Phone Number</label>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">Phone is required</p>
                )}
              </div>
            </div>

            {/* Location Fields */}
            <LocationFields
              control={control}
              setValue={setValue}
              watch={watch}
              errors={errors}
              isPincode={false}
              customStyles="react-select-container"
            />

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-blue-100">
              <Button
                type="submit"
                variant="primary"
                label="Add User"
                className="px-8 py-2.5 bg-[#5B7FE5] hover:bg-[#4a6dd4] shadow-md"
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;