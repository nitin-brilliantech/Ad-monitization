import React, { createContext, useContext, useState } from "react";

// Context to share state between Trigger and Content
const HoverCardContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
});

// Parent wrapper
export function HoverCard({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HoverCardContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </HoverCardContext.Provider>
  );
}

// Trigger component
export function HoverCardTrigger({ children, asChild = false }) {
  const { setIsOpen } = useContext(HoverCardContext);

  // Only accept one child
  const child = React.Children.only(children);

  const triggerProps = {
    onMouseEnter: () => setIsOpen(true),
    onMouseLeave: () => setIsOpen(false),
    onFocus: () => setIsOpen(true),
    onBlur: () => setIsOpen(false),
  };

  if (asChild) {
    return React.cloneElement(child, triggerProps);
  }

  return <div {...triggerProps}>{children}</div>;
}

// Content component
export function HoverCardContent({ children, className = "w-80" }) {
  const { isOpen } = useContext(HoverCardContext);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full mt-2 left-0 ${className} bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50`}
    >
      {children}
    </div>
  );
}
