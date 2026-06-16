import ReusableTable from "../../../../components/table/ReusableTable";
import Button from "../../../../components/ui/button/Button";
import { Switch } from "@mui/material";
import { IoIosArrowForward } from "react-icons/io";
import { FiUser, FiMoreVertical } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useCurrentUser } from "../../../../components/ui/user/CurrentUser";
import EditProfile from "./EditProfile";
import AddStore from "./AddStore";
import { Link, Outlet, useLocation } from "react-router-dom";
import Toast from "../../../../components/ui/toast/Toast";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../../../redux/slices/user/userSlice";

const Settings = () => {
  const user = useCurrentUser();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [isOn, setIsOn] = useState(true);

  const [profileData, setProfileData] = useState({
    avatar: "logo.svg",
    name: "N/A",
    phone: "N/A",
    email: "N/A",
    alternatePhone: "",
    address: "N/A",
    field1: "#123456789",
    field2: "XXXXXXXX1234",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        avatar: user.profileUrl || "logo.svg",
        name: user.fullName || "N/A",
        phone: user.phone || "N/A",
        email: user.email || "N/A",
        alternatePhone: user.alternatePhone || "N/A",
        address:
          `${user.address || ""}, ${user.city || ""}, ${user.state || ""}, ${
            user.country || ""
          }`
            .replace(/^,|,$/g, "")
            .trim() || "N/A",
        field1: user.businessName || "#123456789",
        field2: user.gstNumber || "XXXXXXXX1234",
      });
    }
  }, [user]);

  const [stores, setStores] = useState([
    {
      store_name: "Reliance Fresh",
      contact_person: "Pramod Kumar",
      phone: "+91 7856453423",
      address: "400090 (Andheri West, Mumbai)",
      role: "Manager",
    },
    {
      store_name: "Reliance Digital",
      contact_person: "Rajesh Sharma",
      phone: "+91 8765432109",
      address: "400053 (Bandra West, Mumbai)",
      role: "Sales",
    },
    {
      store_name: "Reliance Trends",
      contact_person: "Priya Singh",
      phone: "+91 7654321098",
      address: "400001 (Fort, Mumbai)",
      role: "Analyst",
    },
    {
      store_name: "Reliance Smart",
      contact_person: "Amit Patel",
      phone: "+91 6543210987",
      address: "400014 (Marine Lines, Mumbai)",
      role: "Manager",
    },
    {
      store_name: "Reliance Footprint",
      contact_person: "Neha Gupta",
      phone: "+91 9876543210",
      address: "400062 (Juhu, Mumbai)",
      role: "Sales",
    },
  ]);

  const isViewNested = location.pathname !== "/settings";

  const cols = [
    { id: "store_name", label: "Store Name" },
    { id: "contact_person", label: "Contact" },
    { id: "phone", label: "Phone Number" },
    { id: "address", label: "Address" },
    {
      id: "role",
      label: "Role",
      render: (row) => {
        const roleColors = {
          Manager: "bg-blue-50 text-blue-700 border-blue-200",
          Sales: "bg-green-50 text-green-700 border-green-200",
          Analyst: "bg-purple-50 text-purple-700 border-purple-200",
        };
        const colorClass = roleColors[row.role] || "bg-gray-50 text-gray-700 border-gray-200";
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {row.role}
          </span>
        );
      },
    },
  ];

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

  const handleProfileSave = async (updatedData) => {
    setProfileData(updatedData);
    // Refetch user profile to get the updated profile picture URL from backend
    await dispatch(fetchUserProfile());
    Toast.success(
      "Profile Updated!",
      "Your profile information has been updated successfully."
    );
  };

  const handleAddStore = (newStore) => {
    setStores((prev) => [
      ...prev,
      {
        store_name: newStore.storeName,
        contact_person: newStore.contactRole,
        phone: newStore.phone,
        address: newStore.storeAddress,
        role: newStore.contactRole,
      },
    ]);

    Toast.success("Store Added!", "The new store has been added successfully.");
  };

  const handleToggle = () => {
    const newState = !isOn; // compute the new state
    setIsOn(newState);

    if (newState) {
      Toast.success("Data sharing turned ON");
    } else {
      Toast.success("Data sharing turned OFF");
    }
  };

  return (
    <>
      {isViewNested ? (
        <Outlet />
      ) : (
        <div>
          {/* Profile Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Settings</h2>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl py-3">
              <div className="flex items-center justify-between px-6 mb-2">
                <div className="flex font-semibold items-center gap-2 text-lg">
                  Profile
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    label="Edit"
                    isIcon={false}
                    onClick={() => setIsEditOpen(true)}
                  />
                  <FiMoreVertical
                    className="text-gray-500 cursor-pointer"
                    onClick={() => Toast.info("NO actions Available")}
                  />
                </div>
              </div>

              {/* Avatar & Info */}
              <div className="grid grid-cols-1 gap-6 mb-3 px-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="px-1 text-gray-700 text-sm font-semibold">
                      Name
                    </h4>
                    <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                      <p className="text-gray-600">{profileData.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="px-1 text-gray-700 text-sm font-semibold">
                      Email Id.
                    </h4>
                    <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                      <p className="text-gray-600">{profileData.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone & Business Info */}
              <div className="grid grid-cols-4 gap-6 px-6 py-2 mb-3">
                <div className="space-y-2">
                  <h4 className="px-1 text-gray-700 text-sm font-semibold">
                    Phone Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                    <p className="text-gray-600">{profileData.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="px-1 text-gray-700 text-sm font-semibold">
                    Alternate Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                    <p className="text-gray-600">
                      {profileData.alternatePhone}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="px-1 text-gray-700 text-sm font-semibold">
                    Business Registration Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                    <p className="text-gray-600">{profileData.field1}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="px-1 text-gray-700 text-sm font-semibold">
                    GST Number
                  </h4>
                  <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                    <p className="text-gray-600">{profileData.field2}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 px-6 mb-6">
                <h4 className="px-1 text-gray-700 text-sm font-semibold">
                  Residential Address
                </h4>
                <div className="border-gray-200 border px-3 py-2 rounded-lg bg-gray-50">
                  <p className="text-gray-600">{profileData.address}</p>
                </div>
              </div>
            </div>
          </div>

          <EditProfile
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            userData={profileData}
            onSave={handleProfileSave}
          />

          {user?.role === "Retailer" && (
            <>
              <div className="flex items-center justify-between mt-5 mb-2 px-6">
                <div className="flex font-semibold items-center gap-2 text-lg">
                  Stores
                </div>
                <Button
                  label="Add Store"
                  onClick={() => setIsAddStoreOpen(true)}
                />
                <AddStore
                  isOpen={isAddStoreOpen}
                  onClose={() => setIsAddStoreOpen(false)}
                  onAdd={handleAddStore}
                />
              </div>

              <ReusableTable
                columns={cols}
                rows={stores}
                loading={false}
                onRowClick={handleRowClick}
              />

              <Link to="users">
                <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg hover:bg-gray-50 cursor-pointer px-6">
                  Users
                  <IoIosArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              </Link>

              <Link to="permissions">
                <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg hover:bg-gray-50 cursor-pointer px-6">
                  Permissions
                  <IoIosArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </>
          )}

          <h1 className="flex font-semibold items-center gap-2 mt-4 pl-2 text-lg">
            Data Privacy
          </h1>
          <div className="flex justify-between bg-white p-4 w-full my-4 rounded-lg px-6">
            <span className="text-md text-gray-700">Allow Data Sharing</span>
            <Switch
              checked={isOn}
              size="small"
              onChange={handleToggle}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#4684ff" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#4684ff",
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
