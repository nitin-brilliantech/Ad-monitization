import React from 'react';
import PropTypes from 'prop-types';
import StatusIndicator from "./StatusIndicator"

const StatusBadge = ({ isActive, isExpired = false, size = 10 }) => {
  let status;
  if (isExpired) status = "EXPIRED";
  else status = isActive ? "ACTIVE" : "INACTIVE";

  const colorMap = {
    ACTIVE: {
      bg: '#10b981',
      text: '#ffffff',
      indicatorColor: 'white',
      shadow: 'rgba(16, 185, 129, 0.2)',
    },
    INACTIVE: {
      bg: '#ef4444',
      text: '#ffffff',
      indicatorColor: 'white',
      shadow: 'rgba(239, 68, 68, 0.2)',
    },
    EXPIRED: {
      bg: '#6b7280',
      text: '#ffffff',
      indicatorColor: 'white',
      shadow: 'rgba(107, 114, 128, 0.2)',
    },
  };

  const colors = colorMap[status];

  return (
    <div
      className="inline-flex items-center gap-1 px-3 py-2 rounded-full font-semibold"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        boxShadow: `0 2px 4px ${colors.shadow}`,
      }}
    >
      <StatusIndicator
        isActive={status === "ACTIVE"}
        size={size}
        activeColor={colors.indicatorColor}
        inactiveColor={colors.indicatorColor}
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