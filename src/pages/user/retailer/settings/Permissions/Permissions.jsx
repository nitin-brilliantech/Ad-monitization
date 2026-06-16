import React from "react";
import ReusableTable from "../../../../../components/table/ReusableTable";
import { BsThreeDotsVertical } from "react-icons/bs";
import Breadcrumbs from "../../../../../components/ui/bread-crumb/Breadcrumbs";
import { Switch } from "@mui/material";
import Toast from "../../../../../components/ui/toast/Toast";

const Permissions = () => {
  const [rows, setRows] = React.useState([
    {
      permissions: ["Management", "Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
    {
      permissions: ["Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
    {
      permissions: ["Management", "Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
    {
      permissions: ["Management", "Finance", "Marketing"],
      user: "Marvin McKinney",
      role: "Accountant",
      phone: "+91 9765550116",
      status: "ACTIVE",
    },
  ]);

  const cols = [
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
    { id: "user", label: "User" },
    {
      id: "role",
      label: "Role",
      render: (row) => {
        const roleColors = {
          "Accountant": "bg-purple-50 text-purple-700 border-purple-200",
          "Store Manager": "bg-blue-50 text-blue-700 border-blue-200",
          "Marketing & Sales": "bg-green-50 text-green-700 border-green-200",
          "Finance Manager": "bg-orange-50 text-orange-700 border-orange-200",
        };
        const colorClass = roleColors[row.role] || "bg-gray-50 text-gray-700 border-gray-200";
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {row.role}
          </span>
        );
      },
    },
    { id: "phone", label: "Phone Number" },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        return (
          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
            <Switch
              checked={row.status === "ACTIVE"}
              size="small"
              onChange={() => handleStatusToggle(row)}
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
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <button
            className="rounded hover:bg-gray-100 p-2"
            onClick={() => handleThreeDotsClick(row)}
          >
            <BsThreeDotsVertical className="hover:cursor-pointer text-gray-500" />
          </button>
        </div>
      ),
    },
  ];

  const handleStatusToggle = (rowToUpdate) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row === rowToUpdate
          ? {
              ...row,
              status: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : row
      )
    );

    Toast.success("Status updated successfully ! ")
  };

  const handleThreeDotsClick = (row) => {
    Toast.info(`No actions available `)
  };

  const handleRowClick = (row) => {
    console.log("Row clicked ", row);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Permissions</h2>
      </div>
      <Breadcrumbs />

      <ReusableTable
        columns={cols}
        rows={rows}
        loading={false}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Permissions;
