import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "../../../../../components/ui/modal/Modal";
import Input from "../../../../../components/ui/input/Input";
import Button from "../../../../../components/ui/button/Button";
import Select from "react-select";

const EditUserProfileInSettings = ({
  isOpen,
  onClose,
  userData,
  onEditUser,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      storeName: "",
      role: "",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        alternatePhone: userData.alternatePhone || "",
        storeName: userData.storeName || "",
        role: userData.role || "",
      });
    }
  }, [userData, reset]);

  const onSubmit = (data) => {
    const payload = { ...userData, ...data };
    onEditUser(payload); // send updated data to parent
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold">Edit User</h2>
        <div className="pt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter full name"
                {...register("fullName", { required: "Full Name is required" })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Role</label>
              <Controller
                control={control}
                name="role"
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Store Manager", label: "Store Manager" },
                      {
                        value: "Marketing & Sales",
                        label: "Marketing & Sales",
                      },
                      { value: "Finance Manager", label: "Finance Manager" },
                    ]}
                    placeholder="Select role"
                    value={
                      [
                        { value: "Store Manager", label: "Store Manager" },
                        {
                          value: "Marketing & Sales",
                          label: "Marketing & Sales",
                        },
                        { value: "Finance Manager", label: "Finance Manager" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                type="text"
                placeholder="Enter phone"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Alternate Number
              </label>
              <Input
                type="text"
                placeholder="Enter alternate phone"
                {...register("alternatePhone")}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Store Name
              </label>
              <Input
                type="text"
                placeholder="Enter store name"
                {...register("storeName", {
                  required: "Store Name is required",
                })}
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm">
                  {errors.storeName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isIcon={false}
              variant="primary"
              label="Save"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserProfileInSettings;
