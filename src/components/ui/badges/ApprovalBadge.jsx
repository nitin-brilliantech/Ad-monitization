import React from 'react';
import PropTypes from 'prop-types';

const ApprovalBadge = ({ status = 'UNKNOWN', size = 10 }) => {
  const normalized = status?.toUpperCase();

  const colorMap = {
    APPROVED: 'bg-green-100 text-green-600',
    REJECTED: 'bg-red-100 text-red-600',
    PENDING: 'bg-yellow-100 text-yellow-600',
    UNKNOWN: 'bg-gray-100 text-gray-600',
  };

  const badgeClass = colorMap[normalized] || colorMap.UNKNOWN;

  return (
    <div
      className={`inline-flex items-center px-3 py-2 rounded-full font-medium ${badgeClass}`}
      style={{ fontSize: `${size + 1}px`, lineHeight: 1 }}
    >
      {normalized}
    </div>
  );
};

ApprovalBadge.propTypes = {
  status: PropTypes.string,
  size: PropTypes.number,
};

export default ApprovalBadge;
