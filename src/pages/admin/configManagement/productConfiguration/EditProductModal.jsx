import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/ui/input/Input";
import { Modal } from "../../../../components/ui/modal/Modal";
import { updateProduct } from "../../../../redux/slices/admin/productSlice";
import Toast from "../../../../components/ui/toast/Toast";

const EditProductModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const formLoading = useSelector((state) => state.product.formLoading);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
    },
  });

  // Populate form with initial data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        name: initialData.name || "",
        price: initialData.price?.toString() || "",
      });
    }
  }, [isOpen, initialData, reset]);

  const submitHandler = (data) => {
    const formattedData = {
      name: data.name.trim(),
      price: Number(data.price),
    };

    dispatch(updateProduct({ id: initialData.id, data: formattedData })).then(
      (res) => {
        if (!res.error) {
          reset();
          onClose();
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white">Edit Product</h2>
          </div>
          <div className="space-y-4 pt-2">
            <Controller control={control} name="name" rules={{ required: "Product name is required" }}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} label="Product Name" placeholder="Enter product name" error={errors.name?.message} />
              )}
            />
            <Controller control={control} name="price"
              rules={{ required: "Price is required", validate: (v) => (!isNaN(v) && Number(v) > 0) || "Price must be a positive number" }}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} label="Price" placeholder="Enter price" type="number" error={errors.price?.message} />
              )}
            />
            <div className="flex justify-end pt-2 border-t border-blue-100">
              <Button type="submit" variant="primary" label="Update Product" isIcon={false} loading={formLoading} />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
