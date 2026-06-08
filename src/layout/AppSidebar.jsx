import { useDispatch } from "react-redux";
import { menuItems, retailerMenuItems, adminMenuItems } from "../util/appsidebar-menu/menuItems";
import SidebarItem from "./SidebarItem";
import {jwtDecode} from "jwt-decode"; 
import { useEffect, useState } from "react";
import { fetchCampaigns } from "../redux/slices/user/campaignSlice";
import "../index.css"; 
import { RxCross2 } from "react-icons/rx";

const AppSidebar = ({ isOpen, toggleSidebar }) => {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const dispatch = useDispatch();

  // Helper: normalize role string
  const normalizeRole = (roleStr) => {
    if (!roleStr) return null;
    return roleStr.replace("-", "").toUpperCase(); 
    // "Ad-Agency" -> "ADAGENCY", "Retailer" -> "RETAILER", etc.
  };

  // Decode token and set role
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(normalizeRole(decoded.role));
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoadingRole(false);
      }
    } else {
      setLoadingRole(false);
    }
  }, [token]);

  // Fetch campaigns only for AdAgency + Retailer
  useEffect(() => {
    const delay = 300;
    const timer = setTimeout(() => {
      if (role === "ADAGENCY" || role === "RETAILER") {
        dispatch(fetchCampaigns());
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [role, dispatch]);

  // Sidebar menu selection based on role
  let sidebarItems = [];
  if (role === "SUPERADMIN") {
    sidebarItems = adminMenuItems;
  } else if (role === "RETAILER") {
    sidebarItems = retailerMenuItems;
  } else if (role === "ADAGENCY") {
    sidebarItems = menuItems;
  }

  if (loadingRole) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#16122F] text-white">
        <p className="text-lg font-medium animate-pulse">Loading Sidebar...</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed md:static top-0 left-0 h-full z-40 bg-[#16122F] text-white w-64 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Logo Header */}
      <div className="flex items-center p-6 mb-7 bg-gradient-to-r from-[#16122F] to-[#445E94]">
        <img src="/images/Logo.svg" alt="xpandifi-logo" />
        <button className="md:hidden ml-auto relative justify-end font-bold text-2xl" onClick={toggleSidebar}>
          <RxCross2 />
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="flex flex-col gap-4 overflow-y-auto pb-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            label={item.name}
            icon={item.icon}
            path={item.path}
            toggleSidebar={toggleSidebar}
          />
        ))}
      </nav>
    </div>
  );
};

export default AppSidebar;