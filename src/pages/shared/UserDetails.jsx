import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { User, Phone, MapPin, Building, Edit, Lock, Mail, Calendar } from "lucide-react";
import Loader from "../../components/loader/Loader";
import { Modal } from "../../components/ui/modal/Modal";
import Button from "../../components/ui/button/Button";
import { formatDate } from "../../util/helper/formatDate";
import Toast from "../../components/ui/toast/Toast";
import Input from "../../components/ui/input/Input";
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

/* ── tiny helpers ─────────────────────────────────────────── */

const ROLE_STYLE = {
  SUPERADMIN: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md",
  ADMIN:      "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md",
  Retailer:   "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md",
  "Ad-Agency":"bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md",
};
const ROLE_LABEL = {
  SUPERADMIN: "Super Admin",
  ADMIN:      "Admin",
  Retailer:   "Retailer",
  "Ad-Agency":"Ad Agency",
};

// Single info row used in the info cards
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 w-8 h-8 rounded-lg bg-[#4684ff]/8 text-[#4684ff] flex items-center justify-center shrink-0 text-sm">
      {icon}
    </span>
    <div>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
    </div>
  </div>
);

// Section card wrapper
const SectionCard = ({ title, icon, action, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-[#4684ff]">{icon}</span>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      {action}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// Modal header shared pattern — kept for potential future use
// const ModalHeader = ({ icon, title, subtitle }) => ( ... )



/* ── main component ───────────────────────────────────────── */
const UserDetails = () => {
  const dispatch = useDispatch();
  const user     = useCurrentUser();

  const [editMode, setEditMode] = useState({
    profile:       false,
    passwordModal: false,
  });
  const [updating,       setUpdating]       = useState(false);
  const [passwordLoading,setPasswordLoading]= useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmitForm,
    reset: resetProfile,
    control, setValue, watch,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmitForm,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const isAdminOrSuperAdmin = ["SUPERADMIN", "ADMIN"].includes(user?.role);
  const isAdmin             = user?.role === "ADMIN";

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user?.fullName || user?.name || "",
        phone:    user?.phone    || "",
        country:  user?.country  || "",
        state:    user?.state    || "",
        city:     user?.city     || "",
        address:  user?.address  || "",
      });
    }
  }, [user, resetProfile]);

  const handleProfileSubmit = async (data) => {
    setUpdating(true);
    try {
      if (isAdminOrSuperAdmin) {
        const changes = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => value !== user?.[key])
        );
        if (!Object.keys(changes).length) {
          Toast.info("No changes to update");
          cancelEdit("profile");
          return;
        }
        await dispatch(updateAdminProfile(changes)).unwrap();
        await dispatch(fetchAdminProfile()).unwrap();
        Toast.success("Profile updated successfully!");
      } else {
        Toast.info("User profile update API not integrated yet");
      }
      cancelEdit("profile");
    } catch (err) {
      Toast.error(err?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    setPasswordLoading(true);
    try {
      const thunk    = isAdminOrSuperAdmin ? resetAdminPassword : resetUserPassword;
      const response = await dispatch(thunk({ currentPassword, newPassword })).unwrap();
      cancelEdit("passwordModal");
      Toast.success(response?.message || "Password updated!");
      resetPassword();
    } catch (error) {
      Toast.error("Failed!", error || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const cancelEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    resetProfile();
    resetPassword();
  };

  const name     = user?.fullName || user?.name || "User";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const avatar   = user?.avatar || user?.profile_url || user?.profilePic;

  return (
    <div className="relative w-full mx-auto max-w-9xl py-6">
      {!user && (
        <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="flex flex-col gap-5">

        {/* ── Hero card ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover banner */}
          <div className="h-28 bg-gradient-to-r from-[#4684ff] via-[#3a6fe6] to-[#2d5acc] relative">
            {/* subtle pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{backgroundImage:"radial-gradient(circle at 20% 50%,#fff 1px,transparent 1px),radial-gradient(circle at 80% 20%,#fff 1px,transparent 1px)",backgroundSize:"40px 40px"}}
            />
          </div>

          {/* Avatar + name row */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-12 mb-4">
              {/* Avatar */}
              <div className="relative">
                {avatar ? (
                  <img src={avatar} alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4684ff] to-[#3a6fe6] border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                    {initials}
                  </div>
                )}
                {/* online dot */}
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
              </div>

              {/* Edit profile button */}
              {isAdminOrSuperAdmin && (
                <button
                  onClick={() => setEditMode((p) => ({ ...p, profile: true }))}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#4684ff] border border-[#4684ff]/30 rounded-xl hover:bg-[#4684ff]/6 transition-all duration-150"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Name / email / role */}
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
              </div>
              {user?.role && (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${ROLE_STYLE[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Personal Information ──────────────────────────── */}
        <SectionCard
          title="Personal Information"
          icon={<User size={16} />}
          action={
            <button
              onClick={() => setEditMode((p) => ({ ...p, passwordModal: true }))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4684ff] border border-[#4684ff]/30 rounded-lg hover:bg-[#4684ff]/6 transition-all duration-150"
            >
              <Lock size={14} />
              Change Password
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={<User size={16} />}     label="Full Name"      value={user?.fullName || user?.name} />
            <InfoRow icon={<Phone size={16} />}    label="Mobile Number"  value={user?.phone} />
            <InfoRow icon={<Mail size={16} />}     label="Email"          value={user?.email} />
            <InfoRow icon={<MapPin size={16} />}   label="City"           value={user?.city} />
            <InfoRow icon={<MapPin size={16} />}   label="State"          value={user?.state} />
            <InfoRow icon={<MapPin size={16} />}   label="Country"        value={user?.country} />
            <InfoRow icon={<MapPin size={16} />}   label="Address"        value={user?.address} />
            {!isAdminOrSuperAdmin && (
              <InfoRow icon={<Calendar size={16} />} label="Member Since" value={formatDate(user?.createdAt)} />
            )}
          </div>
        </SectionCard>

        {/* ── Organisation Details (non-admin) ─────────────── */}
        {!isAdminOrSuperAdmin && (
          <SectionCard title="Organisation Details" icon={<Building size={16} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow icon={<Building size={16} />} label="Business Name"         value={user?.businessName} />
              <InfoRow icon={<Building size={16} />} label="Business Type"         value={user?.businessType} />
              <InfoRow icon={<Building size={16} />} label="GST Number"            value={user?.gstNumber} />
              <InfoRow icon={<Mail size={16} />}     label="Organisation Email"    value={user?.orgEmail || user?.email} />
              <InfoRow icon={<Phone size={16} />}    label="Organisation Phone"    value={user?.orgPhone || user?.phone} />
              <InfoRow icon={<Calendar size={16} />} label="Registered On"         value={formatDate(user?.createdAt)} />
            </div>
          </SectionCard>
        )}

      </div>

      {/* ── Edit Profile Modal ────────────────────────────── */}
      {isAdminOrSuperAdmin && (
        <Modal isOpen={editMode.profile} onClose={() => cancelEdit("profile")} size="md">
          {/* Full-bleed header */}
          <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <p className="text-sm text-white/70 mt-0.5">Update your personal information</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
          </div>
          <form onSubmit={handleProfileSubmitForm(handleProfileSubmit)} className="space-y-4 mt-6" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                error={profileErrors.fullName?.message}
                disabled={isAdmin}
                {...registerProfile("fullName", { required: "Full Name is required" })}
              />
              <Input
                label="Phone"
                name="phone"
                placeholder="9876543210"
                error={profileErrors.phone?.message}
                {...registerProfile("phone", { required: "Phone is required" })}
              />
              <LocationFields
                control={control}
                setValue={setValue}
                watch={watch}
                errors={profileErrors}
                isPincode={false}
                isRequired={true}
              />
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Address"
                  name="address"
                  placeholder="Enter full address"
                  error={profileErrors.address?.message}
                  {...registerProfile("address", { required: "Address is required" })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
              <button type="button" onClick={() => cancelEdit("profile")}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-150 cursor-pointer">
                Cancel
              </button>
              <Button type="submit" isIcon={false}
                label={isProfileSubmitting || updating ? "Updating..." : "Save Changes"}
                loading={isProfileSubmitting || updating} />
            </div>
          </form>
        </Modal>
      )}

      {/* ── Change Password Modal ─────────────────────────── */}
      <Modal isOpen={editMode.passwordModal} onClose={() => cancelEdit("passwordModal")}>
        {/* Full-bleed header */}
        <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">Change Password</h2>
            <p className="text-sm text-white/70 mt-0.5">Keep your account secure</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
        </div>
        <form onSubmit={handlePasswordSubmitForm(handlePasswordSubmit)} className="flex flex-col gap-4 mt-6">
          <Input
            type="password"
            label="Current Password"
            name="currentPassword"
            placeholder="Enter current password"
            error={passwordErrors.currentPassword?.message}
            {...registerPassword("currentPassword", { required: "Current password is required" })}
          />
          <Input
            type="password"
            label="New Password"
            name="newPassword"
            placeholder="Min. 6 characters"
            error={passwordErrors.newPassword?.message}
            {...registerPassword("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />
          <Input
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Repeat new password"
            error={passwordErrors.confirmPassword?.message}
            {...registerPassword("confirmPassword", {
              required: "Please confirm your password",
              validate: (v) => v === watchPassword("newPassword") || "Passwords do not match",
            })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-blue-100">
            <button type="button" onClick={() => cancelEdit("passwordModal")}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-150 cursor-pointer">
              Cancel
            </button>
            <Button type="submit" isIcon={false} label="Update Password" loading={passwordLoading} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserDetails;
