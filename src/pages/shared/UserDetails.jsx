import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
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
  SUPERADMIN: "bg-purple-100 text-purple-700",
  ADMIN:      "bg-blue-100  text-[#4684ff]",
  Retailer:   "bg-green-100 text-green-700",
  "Ad-Agency":"bg-orange-100 text-orange-700",
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

// Modal header shared pattern
const ModalHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4684ff] to-[#3a6fe6] flex items-center justify-center shadow-sm shrink-0">
      <span className="text-white text-base">{icon}</span>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

/* ── icons (inline SVG keeps bundle light) ────────────────── */
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);
const IconLocation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM16.862 4.487L19.5 7.125" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

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
    <div className="relative w-full mx-auto max-w-4xl px-4 py-6">
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
                  <IconEdit />
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
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_STYLE[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                  {ROLE_LABEL[user.role] ?? user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Personal Information ──────────────────────────── */}
        <SectionCard
          title="Personal Information"
          icon={<IconUser />}
          action={
            <button
              onClick={() => setEditMode((p) => ({ ...p, passwordModal: true }))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4684ff] border border-[#4684ff]/30 rounded-lg hover:bg-[#4684ff]/6 transition-all duration-150"
            >
              <IconLock />
              Change Password
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={<IconUser />}     label="Full Name"      value={user?.fullName || user?.name} />
            <InfoRow icon={<IconPhone />}    label="Mobile Number"  value={user?.phone} />
            <InfoRow icon={<IconMail />}     label="Email"          value={user?.email} />
            <InfoRow icon={<IconLocation />} label="City"           value={user?.city} />
            <InfoRow icon={<IconLocation />} label="State"          value={user?.state} />
            <InfoRow icon={<IconLocation />} label="Country"        value={user?.country} />
            <InfoRow icon={<IconLocation />} label="Address"        value={user?.address} />
            {!isAdminOrSuperAdmin && (
              <InfoRow icon={<IconCalendar />} label="Member Since" value={formatDate(user?.createdAt)} />
            )}
          </div>
        </SectionCard>

        {/* ── Organisation Details (non-admin) ─────────────── */}
        {!isAdminOrSuperAdmin && (
          <SectionCard title="Organisation Details" icon={<IconBuilding />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow icon={<IconBuilding />} label="Business Name"         value={user?.businessName} />
              <InfoRow icon={<IconBuilding />} label="Business Type"         value={user?.businessType} />
              <InfoRow icon={<IconBuilding />} label="GST Number"            value={user?.gstNumber} />
              <InfoRow icon={<IconMail />}     label="Organisation Email"    value={user?.orgEmail || user?.email} />
              <InfoRow icon={<IconPhone />}    label="Organisation Phone"    value={user?.orgPhone || user?.phone} />
              <InfoRow icon={<IconCalendar />} label="Registered On"         value={formatDate(user?.createdAt)} />
            </div>
          </SectionCard>
        )}

      </div>

      {/* ── Edit Profile Modal ────────────────────────────── */}
      {isAdminOrSuperAdmin && (
        <Modal isOpen={editMode.profile} onClose={() => cancelEdit("profile")} size="md">
          <ModalHeader icon={<IconEdit />} title="Edit Profile" subtitle="Update your personal information" />
          <form onSubmit={handleProfileSubmitForm(handleProfileSubmit)} className="space-y-4" autoComplete="off">
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
            <div className="flex justify-end gap-3 pt-2">
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
        <ModalHeader icon={<IconLock />} title="Change Password" subtitle="Keep your account secure" />
        <form onSubmit={handlePasswordSubmitForm(handlePasswordSubmit)} className="flex flex-col gap-4">
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
          <div className="flex justify-end gap-3 pt-2">
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
