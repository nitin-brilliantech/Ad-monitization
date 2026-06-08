import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/ui/input/Input";
import { Modal } from "../../../../components/ui/modal/Modal";
import { createTier } from "../../../../redux/slices/admin/tierSlice"; 
import Toast from "../../../../components/ui/toast/Toast"

const AddTierModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const formLoading = useSelector((state) => state.tier?.formLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",  // prevents uncontrolled input
      price: "", // prevents uncontrolled input
    },
  });

  const onSubmit = (data) => {
    const finalData = {
      name: data.name.trim(),
      price: Number(data.price),
    };

    dispatch(createTier(finalData)).then((res) => {
       if (!res.error) {
    Toast.success("Tier added successfully!");
    reset();
    onClose();
  } else {
    Toast.error(res?.error?.message || "Failed to add tier!");
  }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">Add Tier</h2>

          {/* City Name */}
          <Controller
            control={control}
            name="name"
            rules={{ required: "Tier name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""} // fallback safety
                label="Name"
                placeholder="Tier1, Tier2 etc.."
                error={errors.name?.message}
              />
            )}
          />

          {/* Price */}
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
                value={field.value ?? ""} // fallback safety
                label="Price"
                placeholder="20.."
                inputProps={{ type: "number", min: 0 }}
                error={errors.price?.message}
              />
            )}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              label= "Add Tier"
              className="px-6 py-2"
              loading={formLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTierModal;
