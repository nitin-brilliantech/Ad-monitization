import React from 'react';
import { NavLink } from 'react-router-dom';

// Color mapping for different menu items based on their context
const getIconColor = (label) => {
  const colorMap = {
    // Dashboard & Overview - Blue
    'Dashboard': '#4684ff',
    
    // Campaign Related - Purple/Violet
    'Campaigns': '#8b5cf6',
    'Active Campaigns': '#a855f7',
    'Campaign Request': '#8b5cf6',
    'Campaign Revenue Request': '#9333ea',
    'Live Campaigns': '#7c3aed',
    
    // Financial/Money - Green
    'Payments History': '#10b981',
    'Payment History': '#10b981',
    'Campaign Payment History': '#059669',
    'Wallet': '#14b8a6',
    'My Earning': '#10b981',
    'Revenue & Payouts': '#059669',
    'Withdrawal Request': '#14b8a6',
    
    // Management - Orange
    'User Management': '#f59e0b',
    'Configuration Management': '#f97316',
    'Bid Management': '#fb923c',
    'Bid Review': '#f97316',
    
    // Performance & Analytics - Cyan/Blue
    'Reports': '#06b6d4',
    'Ad Performance': '#0ea5e9',
    
    // Devices & Tech - Slate/Gray
    'Devices': '#64748b',
    'POS Data Upload': '#475569',
    
    // Support & Help - Pink/Rose
    'Support': '#ec4899',
    'Ticket System': '#f43f5e',
    
    // Settings & Security - Indigo
    'Settings': '#6366f1',
    'Setting': '#6366f1',
    'Data Privacy': '#818cf8',
    
    // Default - Blue
    'default': '#4684ff'
  };
  
  return colorMap[label] || colorMap['default'];
};

const SidebarItem = ({ icon: Icon, label, path, toggleSidebar }) => {
  const iconColor = getIconColor(label);
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <NavLink
      to={path}
      onClick={toggleSidebar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={({ isActive }) => ({
        backgroundColor: isActive ? `${iconColor}10` : isHovered ? `${iconColor}08` : 'transparent',
        borderLeft: isActive ? `3px solid ${iconColor}` : 'none',
        paddingLeft: isActive ? '13px' : '16px', // Adjust padding to compensate for border
        color: isActive ? iconColor : isHovered ? iconColor : '#374151',
      })}
      className="group flex items-center gap-3 cursor-pointer rounded-lg py-2.5 mb-1 transition-all duration-200"
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center justify-center shrink-0">
            <Icon 
              size={20} 
              color={isActive ? iconColor : isHovered ? iconColor : '#6b7280'}
              strokeWidth={isActive ? 2.5 : isHovered ? 2.5 : 2}
              className="transition-all duration-200"
              style={{ 
                color: isActive ? iconColor : isHovered ? iconColor : '#6b7280',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          </span>
          <span 
            className={`text-[15px] transition-all duration-200 ${
              isActive ? 'font-semibold' : isHovered ? 'font-semibold' : 'font-medium'
            }`}
            style={{ color: isActive ? iconColor : isHovered ? iconColor : '#374151' }}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
