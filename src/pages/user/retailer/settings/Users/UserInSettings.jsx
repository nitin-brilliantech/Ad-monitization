import React, { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import ReusableTable from "../../../../../components/table/ReusableTable";
import { Chip, Switch } from "@mui/material";
import COLORS from "../../../../../constants/Colors";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../../../components/ui/bread-crumb/Breadcrumbs";
import AddUserModal from "./AddUserModal";
import Toast from "../../../../../components/ui/toast/Toast";
const UserInSettings = () => {
  const [switchLoading, setSwitchLoading] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: "Marvin McKinney",
      email: "dolores.chambers@example.com",
      phone: "+91 9765550116",
      role: "Store Manager",
      permissions: ["Management", "Marketing", "Inventory"],
      status: "ACTIVE",
    },
    {
      id: 2,
      fullName: "Kathryn Murphy",
      email: "dolores.chambers@example.com",
      phone: "+91 9765550116",
      role: "Marketing & Sales",
      permissions: ["Management", "Marketing", "Sales"],
      status: "ACTIVE",
    },
    {
      id: 3,
      fullName: "Marvin McKinney",
      email: "tim.jennings@example.com",
      phone: "+91 9765550116",
      role: "Finance Manager",
      permissions: ["Finance", "Marketing", "Reports"],
      status: "INACTIVE",
    },
    {
      id: 4,
      fullName: "Kathryn Murphy",
      email: "dolores.chambers@example.com",
      phone: "+91 9765550116",
      role: "Store Manager",
      permissions: ["Management", "Staff", "Inventory"],
      status: "ACTIVE",
    },
    {
      id: 5,
      fullName: "Marvin McKinney",
      email: "tim.jennings@example.com",
      phone: "+91 9765550116",
      role: "Store Manager",
      permissions: ["Management", "Reports", "Analytics"],
      status: "ACTIVE",
    },
  ]);

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setSwitchLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        );

        // Find the user from the previous state
        const userToUpdate = prevUsers.find((user) => user.id === userId);

        // Show toast after state update
        setTimeout(() => {
          if (newStatus === "ACTIVE") {
            Toast.success(
              `${userToUpdate.fullName} has been activated successfully!`
            );
          } else {
            Toast.success(
              `${userToUpdate.fullName} has been deactivated successfully!`
            );
          }
        }, 0);

        return updatedUsers;
      });
    } catch (error) {
      Toast.error(error?.message || "Failed to update user status");
    } finally {
      setSwitchLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    navigate("user-profile", { state: { userData: row } });
  };

  const columns = (handleStatusChange, switchLoading) => [
    { id: "fullName", label: "Full Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone Number" },
    {
      id: "role",
      label: "Role",
      render: (row) => {
        const roleColors = {
          "Store Manager": "bg-blue-50 text-blue-700 border-blue-200",
          "Marketing & Sales": "bg-green-50 text-green-700 border-green-200",
          "Finance Manager": "bg-purple-50 text-purple-700 border-purple-200",
        };
        const colorClass = roleColors[row.role] || "bg-gray-50 text-gray-700 border-gray-200";
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {row.role}
          </span>
        );
      },
    },
    {
      id: "permissions",
      label: "Permissions",
      render: (row) => (
        <div className="space-y-1">
          {row.permissions.map((permission, index) => (
            <div key={index} className="text-sm text-gray-600">
              {permission}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
          <Switch
            checked={row.status === "ACTIVE"}
            onChange={() => handleStatusChange(row.id, row.status)}
            size="small"
            disabled={switchLoading?.[row.id]}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#4684ff",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#4684ff",
              },
            }}
          />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.status === "ACTIVE" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-gray-50 text-gray-600 border border-gray-200"
          }`}>
            {row.status}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <Button label="Add User" onClick={() => setIsOpen(true)} />
      </div>

      <div>
        <Breadcrumbs />
      </div>

      <ReusableTable
        columns={columns(handleStatusChange, switchLoading)}
        rows={users}
        loading={false}
        onRowClick={handleRowClick}
      />

      <AddUserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddUser={(newUser) => {
          setUsers((prev) => [
            ...prev,
            { id: prev.length + 1, ...newUser }, 
          ]);
          Toast.success("New user added successfully !")
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default UserInSettings;
