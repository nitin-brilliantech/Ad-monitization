import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/ui/button/Button";
import ReusableTable from "../../../components/table/ReusableTable";
import {
  fetchUsers,
  toggleUserStatus,
} from "../../../redux/slices/admin/userManagementSlice";

import AddUserModal from "./AddUserModal";
import { columns } from "./UserColumns";
import Toast from "../../../components/ui/toast/Toast";

const UserManagement = () => {

  
  const dispatch = useDispatch();
  const { users, loading, fetched } = useSelector((state) => state.usersManagement);
  const [isOpen, setIsOpen] = useState(false);
  const [switchLoading, setSwitchLoading] = useState({});


  const handleReferesh=()=>{
    dispatch(fetchUsers())
  }

  useEffect(() => {
    if(!fetched && !loading){
      dispatch(fetchUsers());
    }
  }, [fetched,loading,dispatch]);

const handleStatusChange = async (userId, currentStatus) => {
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  // Set loading true for this user
  setSwitchLoading((prev) => ({ ...prev, [userId]: true }));

  try {
    const result = await dispatch(toggleUserStatus({ id: userId, status: newStatus })).unwrap();

    //  Success toast
    if (result?.status === "ACTIVE") {
      Toast.success("User Activated", "The user has been activated successfully!");
    } else {
      Toast.warning("User Deactivated", "The user has been deactivated.");
    }
  } catch (error) {
    //  Error toast
    Toast.error("Error", error?.message || "Failed to update user status");
  } finally {
    // Set loading false for this user
    setSwitchLoading((prev) => ({ ...prev, [userId]: false }));
  }
};

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button label="Add User" onClick={() => setIsOpen(true)} />
      </div>

      {/* Add User Modal */}
      <AddUserModal isOpen={isOpen} onClose={() => setIsOpen(false)} />


      <div className="mt-4">
        <ReusableTable
          columns={columns(handleStatusChange,switchLoading)}
          rows={users || []}
          loading={loading}
          filterOptions={["all", "ACTIVE", "INACTIVE"]}
          filterKey="status"
          onRefresh={handleReferesh}
          searchableColumns={["fullName","phone","email"]}
        />
      </div>
    </div>
  );
};

export default UserManagement;
