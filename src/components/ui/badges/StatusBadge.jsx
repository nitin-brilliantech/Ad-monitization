import React from 'react';
import PropTypes from 'prop-types';
import StatusIndicator from "./StatusIndicator"

const StatusBadge = ({ isActive, isExpired = false, size = 10 }) => {
  let status;
  if (isExpired) status = "EXPIRED";
  else status = isActive ? "ACTIVE" : "INACTIVE";

  const colorMap = {
    ACTIVE: {
      badgeClass: "bg-green-100 text-green-600",
      indicatorColor: "green",
    },
    INACTIVE: {
      badgeClass: "bg-red-100 text-red-600",
      indicatorColor: "red",
    },
    EXPIRED: {
      badgeClass: "bg-gray-200 text-gray-600",
      indicatorColor: "gray",
    },
  };

  const { badgeClass, indicatorColor } = colorMap[status];

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${badgeClass}`}
    >
      <StatusIndicator
        isActive={status === "ACTIVE"}
        size={size}
        activeColor={indicatorColor}
        inactiveColor={indicatorColor}
        useInlineColor={true}
      />
      <span style={{ fontSize: `${size + 1}px`, lineHeight: 1 }}>{status}</span>
    </div>
  );
};



StatusBadge.propTypes = {
  isActive: PropTypes.bool.isRequired,
  size: PropTypes.number,
};

export default StatusBadge;