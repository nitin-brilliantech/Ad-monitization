import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { registerUSerApi } from "../../../api/admin/user-management/userManagementApi";
import Button from "../button/Button";
import Input from "../input/Input";
import { useState } from "react";
import Toast from "../../ui/toast/Toast"

const AddAdminForm = ({ onClose }) => {
  const [isLoading, setLoading]=useState(false);
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
        Toast.success("success",response?.message||"Admin added successfully",)
        setLoading(false);
        reset();
        onClose();
      }
      console.log(response,"res")
    } catch (error) {
      setLoading(false);
      Toast.error(error?.message|| "Failed to ad Admin")
      console.error("Add admin error:", error);
      onClose();
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold">Add New Admin</h2>

      <div>
        <label className="block text-sm mb-1">Name</label>
        <Input
          type="text"
          placeholder="Devashish"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <Input
          type="email"
          placeholder="admin@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="text-white px-4 py-2 rounded" label="Add Admin"loading={isLoading} />
      </div>
    </form>
  );
};

export default AddAdminForm;
