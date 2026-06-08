import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/ui/input/Input";
import { Modal } from "../../../../components/ui/modal/Modal";
import { createProduct } from "../../../../redux/slices/admin/productSlice";
import Toast from "../../../../components/ui/toast/Toast";

const AddProductModal = ({ isOpen, onClose }) => {
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

  // Reset form on modal open/close
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const submitHandler = (data) => {
    // Convert price to number
    const formattedData = {
      name: data.name.trim(),
      price: Number(data.price),
    };

    dispatch(createProduct(formattedData)).then((res) => {
      if (!res.error) {
        Toast.success("Product added successfully!");
        reset();
        onClose();
      } else {
        Toast.error(res?.error?.message || "Failed to add product!");
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">Add Product</h2>

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
              label="Add Product"
              className="px-6 py-2"
              loading={formLoading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
