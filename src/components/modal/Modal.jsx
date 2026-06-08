import React from 'react';
import PropTypes from 'prop-types';
import { IoClose } from "react-icons/io5";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  bgcolor,
  titleStyle,
  size = "md",
}) {
  if (!isOpen) return null;

  // Width classes based on size prop
  const sizeClasses = {
    sm: "w-64",       // ~256px
    md: "w-96",       // ~384px
    lg: "w-[32rem]",  // 512px
    xl: "w-[40rem]",  // 640px
    "2xl": "w-[48rem]"// 768px
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-sm w-full overflow-y-auto px-4 py-8"
      onClick={onClose}
    >
      <div
        className={`${bgcolor || 'bg-white'} rounded-lg shadow-2xl ${sizeClasses[size] || sizeClasses.md} relative animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose className="text-2xl" />
        </button>

        <div className="p-6 mt-10">
          {/* Modal Title (Optional) */}
          {title && (
            <h2 className={`${titleStyle || 'text-gray-900 font-bold'} text-2xl mb-6 tracking-tight`}>
              {title}
            </h2>
          )}

          {/* Modal Content */}
          <div className="text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default Props
Modal.defaultProps = {
  size: 'md',
  title: '',
  titleStyle: '',
  bgcolor: 'bg-white',
};

// Prop Types
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  bgcolor: PropTypes.string,
  titleStyle: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
};
