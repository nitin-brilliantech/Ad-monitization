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
          Toast.success("Product updated successfully!");
          reset();
          onClose();
        } else {
          Toast.error(res?.error?.message || "Failed to update product!");
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">Edit Product</h2>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Product name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                label="Product Name"
                placeholder="Enter product name"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            rules={{
              required: "Price is required",
              validate: (value) =>
                (!isNaN(value) && Number(value) > 0) ||
                "Price must be a positive number",
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                label="Price"
                placeholder="Enter price"
                type="number"
                error={errors.price?.message}
              />
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              label="Update Product"
              className="px-6 py-2"
              isIcon={false}
              loading={formLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
