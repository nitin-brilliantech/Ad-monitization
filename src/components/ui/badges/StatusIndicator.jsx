import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const StatusIndicator = ({
  isActive = false,
  size = 12,
  ping = true,
  activeColor = 'green',
  inactiveColor = 'gray',
  useInlineColor = false,
}) => {
  const baseSize = {
    width: `${size}px`,
    height: `${size}px`,
  };

  // Helper: determines if it's a full Tailwind class
  const isClass = (val) => val.startsWith('bg-');

  // Get class name or undefined (if using inline style)
  const getBgClass = (color, shade) => {
    if (isClass(color)) return color;
    if (!useInlineColor) return `bg-${color}-${shade}`;
    return undefined;
  };

  // Get inline style if using raw color
  const getInlineStyle = (color) => {
    if (useInlineColor && !isClass(color)) {
      return {
        ...baseSize,
        backgroundColor: color,
      };
    }
    return baseSize;
  };

  const mainColor = isActive ? activeColor : inactiveColor;

  const mainBgClass = getBgClass(mainColor, 500);
  const pingBgClass = getBgClass(mainColor, 400);

  return (
    <span className="relative inline-flex" style={baseSize}>
      {ping && (
        <span
          className={classNames(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            pingBgClass
          )}
          style={getInlineStyle(mainColor)}
        />
      )}
      <span
        className={classNames(
          'relative inline-flex rounded-full',
          mainBgClass
        )}
        style={getInlineStyle(mainColor)}
      />
    </span>
  );
};

StatusIndicator.propTypes = {
  isActive: PropTypes.bool,
  size: PropTypes.number,
  ping: PropTypes.bool,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  useInlineColor: PropTypes.bool,
};

export default StatusIndicator;