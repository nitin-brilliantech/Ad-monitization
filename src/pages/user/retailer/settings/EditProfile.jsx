import React, { useEffect, useState } from "react";
import { Modal } from "../../../../components/ui/modal/Modal";
import Input from "../../../../components/ui/input/Input";
import Button from "../../../../components/ui/button/Button";
import { useForm } from "react-hook-form";
import { FiUser, FiUpload } from "react-icons/fi";
import axios from "axios";
import Toast from "../../../../components/ui/toast/Toast";

const EditProfile = ({ isOpen, onClose, userData, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      businessReg: "",
      gstNumber: "",
      address: "",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(userData.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (userData) {
      reset({
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        alternatePhone: userData.alternatePhone || "",
        businessReg: userData.field1 || "#123456789",
        gstNumber: userData.field2 || "XXXXXXXX1234",
        address: userData.address || "N/A",
      });

      setAvatarPreview(userData.avatar || "");
    }
  }, [userData, reset]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Toast.error("Invalid file type", "Please upload JPG, JPEG, PNG, or WEBP images only");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Toast.error("File too large", "Please upload an image smaller than 5MB");
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setAvatarFile(file);
    }
  };

  const onSubmit = async (data) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      
      // Add profile image if changed
      if (avatarFile) {
        formData.append('profileUrl', avatarFile);
      }
      
      // Add other profile data
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('alternatePhone', data.alternatePhone || '');
      formData.append('businessName', data.businessReg);
      formData.append('gstNumber', data.gstNumber);
      formData.append('address', data.address);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Call API
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/editProfile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('API Response:', response.data);

      if (response.data.success !== false) {
        // Update local state with new data
        const updatedData = {
          ...userData,
          avatar: response.data.data?.profileUrl || avatarPreview,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          field1: data.businessReg,
          field2: data.gstNumber,
          address: data.address,
        };
        
        onSave(updatedData);
        onClose();
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to update profile. Please try again.";
      
      Toast.error("Update Failed", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Blue Header */}
        <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <p className="text-md text-white/70 mt-0.5">Update your profile information</p>
          </div>
        </div>

        {/* Content */}
        <div className="pt-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {avatarPreview && avatarPreview !== "logo.svg" ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="rounded-full h-24 w-24 shadow-md object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="bg-gray-200 h-24 w-24 rounded-full flex items-center justify-center">
                  <FiUser className="h-12 w-12 text-gray-500" />
                </div>
              )}
              {avatarFile && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <FiUpload className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer text-sm font-medium transition-colors">
                Choose Image
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-gray-500 text-xs mt-2">
                JPG, PNG or WEBP. Max 5MB. At least 800x800px recommended.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <Input
                type="text"
                placeholder="Enter full name"
                {...register("fullName", { required: "Full Name is required" })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Id</label>
              <Input
                type="email"
                placeholder="Enter email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
                placeholder="Enter phone number"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alternate Number
              </label>
              <Input
                type="text"
                placeholder="Enter alternate number"
                {...register("alternatePhone")}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Registration Number
              </label>
              <Input type="text" {...register("businessReg")} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
              <Input type="text" {...register("gstNumber")} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Residential Address
            </label>
            <Input type="text" {...register("address")} />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              isIcon={false} 
              variant="outline" 
              label="Cancel"
              onClick={onClose}
              disabled={uploading}
            />
            <Button 
              type="submit" 
              isIcon={false} 
              variant="primary" 
              label={uploading ? "Saving..." : "Save Changes"}
              disabled={uploading}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfile;
