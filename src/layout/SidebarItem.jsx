import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, toggleSidebar }) => {
  return (
    <NavLink
      to={path}
      onClick={toggleSidebar}
      className={({ isActive }) =>
        `group flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 mb-1 transition-all duration-200 ${
          isActive 
            ? "bg-gray-100 text-[#4684ff] shadow-md" 
            : "text-gray-600 hover:bg-gray-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center justify-center w-6 h-6 shrink-0">
            <Icon size={20} color={isActive ? "#4684ff" : "black"} />
          </span>
          <span className={`text-[15px] font-medium ${isActive ? 'font-semibold' : ''}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
