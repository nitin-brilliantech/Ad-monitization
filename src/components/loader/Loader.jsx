const sizeClasses = {
  vs: "w-4 h-4 border-3",
  small: "w-6 h-6 border-4",
  medium: "w-16 h-16 border-6",
  large: "w-24 h-24 border-8",
};

const Loader = ({ className = "", size = "medium" }) => {
  const sizeClass = sizeClasses[size] || sizeClasses["medium"];

  return (
    <div className={`flex inset-0 w-full items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer circle */}
        <div className={`${sizeClass} border-gray-200 rounded-full`}></div>

        {/* Animated inner circle */}
        <div
          className={`absolute top-0 left-0 ${sizeClass} border-t-[#526E95] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
        ></div>
      </div>
    </div>
  );
};

export default Loader;
