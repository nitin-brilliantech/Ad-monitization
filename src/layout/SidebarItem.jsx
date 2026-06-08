import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, toggleSidebar }) => {
  return (
    <NavLink
      to={path}
      onClick={toggleSidebar}
      className={({ isActive }) =>
        `flex items-center gap-3 cursor-pointer hover:bg-[#445E94] p-2 transition ${
          isActive ? "bg-[#445E94]" : ""
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
