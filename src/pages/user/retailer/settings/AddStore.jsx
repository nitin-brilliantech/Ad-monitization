import { useForm, Controller } from "react-hook-form";
import { Modal } from "../../../../components/ui/modal/Modal";
import Input from "../../../../components/ui/input/Input";
import Button from "../../../../components/ui/button/Button";
import Select from "react-select";

const AddStore = ({ isOpen, onClose, onAdd }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    onAdd(data); 
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Blue Header */}
        <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Add Store</h2>
            <p className="text-md text-white/70 mt-0.5">Register a new store location</p>
          </div>
        </div>

        {/* Content */}
        <div className="pt-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store Address
            </label>
            <Input
              type="text"
              placeholder="Enter Address"
              {...register("storeAddress", { required: true })}
              className="w-full"
            />
            {errors.storeAddress && (
              <p className="text-red-500 text-sm mt-1">Store Address is required</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Name
              </label>
              <Input
                type="text"
                placeholder="Enter Store name"
                {...register("storeName", { required: true })}
              />
              {errors.storeName && (
                <p className="text-red-500 text-sm mt-1">Store Name is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Regions</label>
              <Input
                type="text"
                placeholder="Add Regions"
                {...register("regions")}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Registration Number
              </label>
              <Input
                type="text"
                placeholder="123XYZ123"
                {...register("businessRegNo", { required: true })}
              />
              {errors.businessRegNo && (
                <p className="text-red-500 text-sm mt-1">
                  Business Registration Number is required
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GST Number
              </label>
              <Input
                type="text"
                placeholder="XXXXXXXX234"
                {...register("gstNo", { required: true })}
              />
              {errors.gstNo && (
                <p className="text-red-500 text-sm mt-1">GST Number is required</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                type="text"
                placeholder="+91"
                {...register("phone", { required: true })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">Phone is required</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alternate Number
              </label>
              <Input type="text" placeholder="+91" {...register("altPhone")} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact's Role
              </label>
              <Controller
                control={control}
                name="contactRole"
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Manager", label: "Manager" },
                      { value: "Sales", label: "Sales" },
                      { value: "Analyst", label: "Analyst" },
                    ]}
                    placeholder="Select Roles"
                    value={
                      [
                        { value: "Manager", label: "Manager" },
                        { value: "Sales", label: "Sales" },
                        { value: "Analyst", label: "Analyst" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.contactRole && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactRole.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Type
              </label>
              <Controller
                control={control}
                name="storeType"
                rules={{ required: "Store Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "Retail", label: "Retail" },
                      { value: "Wholesale", label: "Wholesale" },
                      { value: "Franchise", label: "Franchise" },
                    ]}
                    placeholder="Select Type"
                    value={
                      [
                        { value: "Retail", label: "Retail" },
                        { value: "Wholesale", label: "Wholesale" },
                        { value: "Franchise", label: "Franchise" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) => field.onChange(selected?.value)}
                  />
                )}
              />
              {errors.storeType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.storeType.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              isIcon={false}
              type="submit"
              variant="primary"
              label="Register Store"
              className="px-6 py-2"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddStore;
