import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUSerApi } from "../../../api/admin/user-management/userManagementApi";
import Button from "../button/Button";
import Input from "../input/Input";
import Toast from "../toast/Toast";

const AddAdminForm = ({ onClose }) => {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerUSerApi(data);
      if (response?.status === 200 || response?.status === 201) {
        Toast.success("success", response?.message || "Admin added successfully");
        reset();
        onClose();
      }
    } catch (error) {
      Toast.error(error?.message || "Failed to add Admin");
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      {/* Modal Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4684ff] to-[#3a6fe6] flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Add New Admin</h2>
          <p className="text-sm text-gray-400">Create a new administrator account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Input
            label="Full Name"
            name="name"
            placeholder="e.g. Devashish Sharma"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email Address"
            name="email"
            placeholder="admin@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email address",
              },
            })}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <Button
            type="submit"
            label="Add Admin"
            loading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddAdminForm;
