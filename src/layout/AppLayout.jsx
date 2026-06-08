import React, { useState, useMemo, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useCurrentUser } from "../components/ui/user/CurrentUser";
import PageTitle from "../components/ui/page-title/PageTitle";
import { initCampaignSSE } from "../util/services/sseService";

const AppLayout = () => {
  const user = useCurrentUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const role = user?.role || null;

  const title = useMemo(() => {
    const roleMap = {
      "Ad-Agency": "Ad Agency",
      Retailer: "Retailer",
      SUPERADMIN: "SuperAdmin",
      ADMIN: "Admin",
    };
    return roleMap[role] || null;
  }, [role]);
  
  useEffect(() => {
    if (role !== "Retailer") return;

    const cleanup = initCampaignSSE?.();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [role, initCampaignSSE]);

  return (
    <>
      {title && <PageTitle title={title} />}

      <div className="flex h-screen overflow-hidden bg-gray-100">
        <AppSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
