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
    reset();
    onClose();
  }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Add Tier</h2>
          </div>
          <div className="space-y-4 pt-2">
            <Controller control={control} name="name" rules={{ required: "Tier name is required" }}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} label="Name" placeholder="Tier1, Tier2 etc.." error={errors.name?.message} />
              )}
            />
            <Controller control={control} name="price"
              rules={{ required: "Price is required", min: { value: 0, message: "Price cannot be negative" } }}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} label="Price" placeholder="20.." inputProps={{ type: "number", min: 0 }} error={errors.price?.message} />
              )}
            />
            <div className="flex justify-end pt-2 border-t border-blue-100">
              <Button type="submit" variant="primary" label="Add Tier" loading={formLoading} />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTierModal;
