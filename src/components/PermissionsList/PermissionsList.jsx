import React, { useState } from 'react';

const PermissionList = ({
  title = 'Permissions',
  sections = [],
  onPermissionChange,
  className = '',
  disabled = false,
  ...containerProps
}) => {
  const [activeSection, setActiveSection] = useState(0);

  const handleCheckboxChange = (permissionIndex, checked) => {
    if (onPermissionChange && !disabled) {
      onPermissionChange(activeSection, permissionIndex, checked);
    }
  };

  const handleAllCheckboxChange = (checked) => {
    if (onPermissionChange && !disabled && sections[activeSection]) {
      // Update all permissions in the current section
      sections[activeSection].permissions?.forEach((_, permissionIndex) => {
        onPermissionChange(activeSection, permissionIndex, checked);
      });
    }
  };

  // Check if all permissions in current section are checked
  const areAllChecked = sections[activeSection]?.permissions?.every(
    permission => permission.checked
  ) || false;

  // Check if some permissions are checked (for indeterminate state)
  const areSomeChecked = sections[activeSection]?.permissions?.some(
    permission => permission.checked
  ) || false;

  return (
    <div 
      className={`bg-white rounded-2xl p-6 ${className}`}
      {...containerProps}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => setActiveSection(index)}
            className={`px-4  hover:cursor-pointer py-2 font-medium text-sm border-b-2 transition-colors ${
              activeSection === index
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Active Section Content */}
      {sections[activeSection] && (
        <div className="space-y-1">
          {/* All Checkbox Row */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 rounded-lg bg-gray-200">
            {/* Left Column - Text */}
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-900">
                All
              </span>
            </div>

            {/* Right Column - Checkbox */}
            <div className="ml-4">
              <input
                type="checkbox"
                checked={areAllChecked}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = areSomeChecked && !areAllChecked;
                  }
                }}
                onChange={(e) => handleAllCheckboxChange(e.target.checked)}
                disabled={disabled}
                className="h-5 w-5  hover:cursor-pointer text-blue-600 border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Permissions List */}
          <div className="space-y-1">
            {sections[activeSection].permissions?.map((permission, permissionIndex) => (
              <div 
                key={permissionIndex}
                className="flex items-center justify-between py-3 px-4 border-b border-gray-200 rounded-lg"
              >
                {/* Left Column - Text */}
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    {permission.label}
                  </span>
                </div>

                {/* Right Column - Checkbox */}
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={permission.checked || false}
                    onChange={(e) => 
                      handleCheckboxChange(permissionIndex, e.target.checked)
                    }
                    disabled={disabled || permission.disabled}
                    className="h-4 w-4  hover:cursor-pointer text-black rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!sections[activeSection] || sections[activeSection]?.permissions?.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No permissions available
        </div>
      )}
    </div>
  );
};

export default PermissionList;