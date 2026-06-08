import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import Loader from "../../components/loader/Loader";
import { Modal } from "../../components/ui/modal/Modal";
import Button from "../../components/ui/button/Button";
import { formatDate } from "../../util/helper/formatDate";
import Toast from "../../components/ui/toast/Toast";
import Input from "../../components/ui/input/Input"
// Redux slices
import {
  fetchUserProfile,
  resetUserPassword,
} from "../../redux/slices/user/userSlice";
import {
  fetchAdminProfile,
  updateAdminProfile,
  resetAdminPassword,
} from "../../redux/slices/admin/adminSlice";

import { useCurrentUser } from "../../components/ui/user/CurrentUser";
import LocationFields from "../../components/LocationsDropdown/LocationFields";

const UserDetails = () => {
  const dispatch = useDispatch();
  const user = useCurrentUser();

  const [editMode, setEditMode] = useState({
    profile: false,
    profilePic: false,
    passwordModal: false,
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ✅ Separate useForm for profile edit
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmitForm,
    reset: resetProfile,
    control,
    setValue,
    watch,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm();

  // ✅ Separate useForm for password reset
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmitForm,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const isAdminOrSuperAdmin = ["SUPERADMIN", "ADMIN"].includes(user?.role);
  const isAdmin = user?.role ==='ADMIN';


  // Reset profile form when user data changes
  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user?.fullName || user?.name || "",
        phone: user?.phone || "",
        country: user?.country || "",
        state: user?.state || "",
        city: user?.city || "",
        address: user?.address || "",
      });
    }
  }, [user, resetProfile]);

  // ✅ Profile form submit
  const handleProfileSubmit = async (data) => {
    console.log("Profile Data Submitted:", data);
    // ✅ Inline diff: only keep changed fields


    setUpdating(true);
    try {
      if (isAdminOrSuperAdmin) {
        const changes = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== user?.[key])
        );
        if (!Object.keys(changes).length) {
          Toast.info("No changes to update");
          cancelEdit("profile");
          setUpdating(false);
          return;
        }
        await dispatch(updateAdminProfile(changes)).unwrap();
        await dispatch(fetchAdminProfile()).unwrap();
        Toast.success("Profile updated successfully!");
      } else {
        // If later needed for user profile update API
        Toast.info("User profile update API not integrated yet");
      }

      cancelEdit("profile");
    } catch (err) {
      Toast.error(err?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };


  // ✅ Password form submit
  const handlePasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const thunk = isAdminOrSuperAdmin ? resetAdminPassword : resetUserPassword;
      const response = await dispatch(
        thunk({ currentPassword, newPassword })
      ).unwrap();

      cancelEdit("passwordModal");
      Toast.success(response?.message || "Password Updated!");
      resetPassword();
    } catch (error) {
      Toast.error("Failed!", error || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const cancelEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    setProfilePicFile(null);
    setProfilePicPreview(null);
    resetProfile();
    resetPassword();
  };

  return (
    <div className="relative w-full mx-auto p-6">
      {!user && (
        <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center gap-3">
          <Loader />
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#445E94] to-[#16122F] p-6 text-white">
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className="text-blue-100">{user?.email || "Manage your profile"}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={profilePicPreview || user?.profilePic || "logo.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            </div>
            <div className="mt-3 text-gray-700 text-md font-bold">
              {user?.businessName || user?.role || "User"}
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-gray-50 rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              {isAdminOrSuperAdmin && (
                <button
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, profile: true }))
                  }
                  className="text-blue-600 hover:cursor-pointer hover:text-blue-800"
                >
                  <FiEdit />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <Info label="Full Name" value={user?.fullName || user?.name} />
              <Info label="Mobile Number" value={user?.phone} />
              <Info label="City" value={user?.city} />
              <Info label="State" value={user?.state} />
              <Info label="Country" value={user?.country} />
              <Info label="Address" value={user?.address} />
              {!isAdminOrSuperAdmin && (
                <>
                  <Info label="Business Name" value={user?.businessName} />
                  <Info label="On Board" value={formatDate(user?.createdAt)} />
                </>
              )}
            </div>

            <div className="mt-6">
              <Button
                isIcon={false}
                onClick={() =>
                  setEditMode((prev) => ({ ...prev, passwordModal: true }))
                }
                label="Change Password"
              />
            </div>
          </div>

          {/* Org Details for Users */}
          {!isAdminOrSuperAdmin && (
            <div className="bg-gray-50 rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Organization Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <Info label="Business Name" value={user?.businessName} />
                <Info label="Business Type" value={user?.businessType} />
                <Info label="GST Number" value={user?.gstNumber} />
                <Info
                  label="Registered On"
                  value={formatDate(user?.createdAt)}
                />
                <Info
                  label="Organization Email"
                  value={user?.orgEmail || user?.email}
                />
                <Info
                  label="Organization Phone"
                  value={user?.orgPhone || user?.phone}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isAdminOrSuperAdmin && (
        <Modal
          isOpen={editMode.profile}
          onClose={() => cancelEdit("profile")}
          size="md"
        >
          <h2 className="text-center text-gray-800 font-bold mb-4">
            Edit Profile
          </h2>
          <form
            onSubmit={handleProfileSubmitForm(handleProfileSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            <h2 className="text-lg font-semibold">Edit Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...registerProfile("fullName", {
                    required: "Full Name is required",
                  })}
                  disabled={isAdmin}

                />
                {profileErrors.fullName && (
                  <p className="text-sm text-red-500">{profileErrors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm mb-1">
                  Phone<span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  {...registerProfile("phone", {
                    required: "Phone is required",
                  })}

                />
                {profileErrors.phone && (
                  <p className="text-sm text-red-500">{profileErrors.phone.message}</p>
                )}
              </div>

              {/* Location fields */}
              <LocationFields
                control={control}
                setValue={setValue}
                watch={watch}
                errors={profileErrors}
                isPincode={false}
                isRequired={true}
              />

              {/* Address */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm mb-1">Address<span className="text-red-500">*</span></label>
                <Input
                  as="textarea"
                  rows={3}
                  placeholder="Enter full address"
                  {...registerProfile("address", {
                    required: "Address is required",
                  })} />
                {profileErrors.address && (
                  <p className="text-sm text-red-500">{profileErrors.address.message}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="submit"
                isIcon={false}
                label={isProfileSubmitting || updating ? "Updating..." : "Update"}
                loading={isProfileSubmitting || updating}
              />
            </div>
          </form>

        </Modal>
      )}

      {/* Password Modal */}
      <Modal
        isOpen={editMode.passwordModal}
        onClose={() => cancelEdit("passwordModal")}
      >
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form
          onSubmit={handlePasswordSubmitForm(handlePasswordSubmit)}
          className="flex flex-col gap-3"
        >
          <Input
            type="password"
            label="Old Password"
            {...registerPassword("currentPassword", {
              required: "Old password is required",
            })}
            error={passwordErrors.currentPassword?.message}
          />
          <Input
            type="password"
            label="New Password"
            {...registerPassword("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={passwordErrors.newPassword?.message}
          />
          <Input
            type="password"
            label="Confirm Password"
            {...registerPassword("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watchPassword("newPassword") ||
                "Passwords do not match",
            })}
            error={passwordErrors.confirmPassword?.message}
          />
          <div className="flex justify-end mt-4">
            <Button
              label="Update Password"
              type="submit"
              loading={passwordLoading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Small helper components
const Info = ({ label, value }) => (
  <div className="flex w-full space-x-2">
    <span className="text-gray-500">{label}:</span>
    <div className="font-medium">{value || "N/A"}</div>
  </div>
);
export default UserDetails;

