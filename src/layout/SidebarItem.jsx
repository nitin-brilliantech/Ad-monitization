import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon, label, path, toggleSidebar }) => {
  return (
    <NavLink
      to={path}
      onClick={toggleSidebar}
      className={({ isActive }) =>
        `group flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 mb-1 transition-all duration-200 ${
          isActive 
            ? "bg-[#2563eb] text-white shadow-md" 
            : "text-gray-600 hover:bg-gray-50"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex items-center justify-center w-6 h-6 shrink-0 [&>svg]:w-5 [&>svg]:h-5 ${
            isActive
              ? "[&>svg]:fill-white [&>svg]:stroke-white [&>svg>path]:fill-white [&>svg>path]:stroke-white [&>svg>*]:fill-white [&>svg>*]:stroke-white" 
              : "[&>svg]:fill-gray-500 [&>svg]:stroke-gray-500 [&>svg>path]:fill-gray-500 [&>svg>path]:stroke-gray-500 [&>svg>*]:fill-gray-500 [&>svg>*]:stroke-gray-500 group-hover:[&>svg]:fill-gray-700 group-hover:[&>svg]:stroke-gray-700"
          }`}>
            {icon}
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
