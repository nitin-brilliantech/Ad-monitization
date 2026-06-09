import React from 'react';
import PropTypes from 'prop-types';

const TicketStatusBadge = ({ status = 'UNKNOWN', size = 10 }) => {
  const normalized = status?.toUpperCase();

  const colorMap = {
    OPEN: {
      bg: '#f97316',
      text: '#ffffff',
      shadow: 'rgba(249, 115, 22, 0.2)',
    },
    INPROGRESS: {
      bg: '#f59e0b',
      text: '#ffffff',
      shadow: 'rgba(245, 158, 11, 0.2)',
    },
    RESOLVED: {
      bg: '#3b82f6',
      text: '#ffffff',
      shadow: 'rgba(59, 130, 246, 0.2)',
    },
    REOPEN: {
      bg: '#ef4444',
      text: '#ffffff',
      shadow: 'rgba(239, 68, 68, 0.2)',
    },
    CLOSED: {
      bg: '#10b981',
      text: '#ffffff',
      shadow: 'rgba(16, 185, 129, 0.2)',
    },
    UNKNOWN: {
      bg: '#6b7280',
      text: '#ffffff',
      shadow: 'rgba(107, 114, 128, 0.2)',
    },
  };

  const colors = colorMap[normalized] || colorMap.UNKNOWN;

  return (
    <div
      className="inline-flex items-center px-3 py-2 rounded-full font-semibold"
      style={{ 
        fontSize: `${size + 1}px`, 
        lineHeight: 1,
        backgroundColor: colors.bg,
        color: colors.text,
        boxShadow: `0 2px 4px ${colors.shadow}`,
      }}
    >
      {normalized}
    </div>
  );
};

TicketStatusBadge.propTypes = {
  status: PropTypes.string,
  size: PropTypes.number,
};

export default TicketStatusBadge;
