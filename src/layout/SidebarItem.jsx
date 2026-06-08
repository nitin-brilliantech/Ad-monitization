import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, toggleSidebar }) => {
  return (
    <NavLink
      to={path}
      onClick={toggleSidebar}
      className={({ isActive }) =>
        `flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition-all duration-200 ${
          isActive 
            ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white shadow-xl shadow-blue-400/40 border-l-4 border-white scale-[1.02]" 
            : "text-white hover:bg-white/10 hover:shadow-sm"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 text-base ${
            isActive
              ? "bg-gradient-to-br from-[#4684ff] via-[#5b8aff] to-[#3a6fe6] text-white shadow-lg scale-110" 
              : "bg-white/15 text-white"
          }`}>
            {icon}
          </span>
          <span className="text-sm font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
