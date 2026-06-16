import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Button from "../../../../../components/ui/button/Button";
import { Switch } from "@mui/material";
import Breadcrumbs from "../../../../../components/ui/bread-crumb/Breadcrumbs";
import PermissionList from "../../../../../components/PermissionsList/PermissionList";
import EditUserProfileInSettings from "./EditUserProfileInSettings";
import Toast from "../../../../../components/ui/toast/Toast";

const UserProfileInSettings = () => {
  const location = useLocation();
  const initialData = location.state?.userData || {};

  const [userData, setUserData] = useState(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [userStatus, setUserStatus] = useState(userData.status === "ACTIVE");

  const handleStatusChange = () => {
    setUserStatus((prev) => !prev);
    setUserData((prev) => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    }));
    Toast.success("User status updated");
  };

  const handleEditUser = (updatedData) => {
    Toast.success(" User data updated successfully ");
    setUserData(updatedData);
  };

  const [permissions, setPermissions] = useState([
    {
      title: "Management",
      permissions: [
        { label: "Approve customer loyalty points or rewards", checked: true },
        { label: "Add, remove stores", checked: false },
        { label: "Manage campaigns", checked: true },
        { label: "Manage Devices", checked: false },
      ],
    },
    {
      title: "Finance",
      permissions: [
        { label: "View financial reports", checked: true },
        { label: "Process payments", checked: false },
        { label: "Manage budgets", checked: true },
      ],
    },
    {
      title: "Marketing",
      permissions: [
        { label: "Create campaigns", checked: true },
        { label: "View analytics", checked: false },
        { label: "Manage promotions", checked: true },
      ],
    },
    {
      title: "Sales",
      permissions: [
        { label: "Process orders", checked: true },
        { label: "View sales reports", checked: false },
        { label: "Manage customers", checked: true },
      ],
    },
  ]);

  const handlePermissionChange = (sectionIndex, permissionIndex, checked) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[sectionIndex].permissions[permissionIndex].checked =
      checked;
    setPermissions(updatedPermissions);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
      </div>
      <Breadcrumbs />

      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl py-3">
          <div className="flex items-center justify-between px-6 mb-2">
            <div className="flex font-semibold items-center gap-2 text-lg">
              Profile
            </div>
            <div className="flex items-center gap-2">
              Status
              <Switch
                checked={userStatus}
                onChange={handleStatusChange}
                size="small"
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#445E94" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#445E94",
                  },
                }}
              />
              <Button
                label="Edit"
                isIcon={false}
                onClick={() => setIsOpen(true)}
              />
              <FiMoreVertical
                className="text-gray-500 cursor-pointer"
                onClick={() => Toast.info("No actions available")}
              />
            </div>
          </div>

          {/* User Basic Info */}
          <div className="grid grid-cols-3 gap-6 px-6 mb-6">
            <div className="space-y-1">
              <h4 className="px-1 text-gray-900 text-sm font-medium">Name</h4>
              <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                <p className="text-gray-600">
                  {userData.fullName || "John Smith"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="px-1 text-gray-900 text-sm font-medium">
                Email Id.
              </h4>
              <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                <p className="text-gray-600">
                  {userData.email || "jhonsmith@example.com"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="px-1 text-gray-900 text-sm font-medium">Role</h4>
              <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                <p className="text-gray-600">
                  {userData.role || "Store Manager"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-3 gap-6 px-6 mb-6">
            <div className="space-y-1">
              <h4 className="px-1 text-gray-900 text-sm font-medium">
                Contact Number
              </h4>
              <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                <p className="text-gray-600">
                  {userData.phone || "+91 12345 67891"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="px-1 text-gray-900 text-sm font-medium">
                Alternate Number
              </h4>
              <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                <p className="text-gray-600">
                  {userData.alternatePhone || "+91 12345 67891"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="px-1 text-gray-900 text-sm font-medium">
                Store Name
              </h4>
              <div className="border-gray-200 border px-3 py-2 rounded-lg bg-white">
                <p className="text-gray-600">
                  {userData.storeName || "Reliance"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PermissionList
          sections={permissions}
          onPermissionChange={handlePermissionChange}
        />
      </div>

      <EditUserProfileInSettings
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userData={userData}
        onEditUser={handleEditUser} // pass callback
      />
    </div>
  );
};

export default UserProfileInSettings;
