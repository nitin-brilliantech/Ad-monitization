

const LoaderEmpt = ({ isLoading = true, size = "medium", message = "Loading..." }) => {
  const sizeClasses = {
    small: {
      container: "w-2 h-2 border-2",
      text: "text-xs"
    },
    medium: {
      container: "w-6 h-6 border-2",
      text: "text-sm"
    },
    large: {
      container: "w-16 h-16 border-2",
      text: "text-base"
    }
  };
  const sizeConfig = sizeClasses[size] || sizeClasses.medium;
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-none"></div>
      {/* Loader Container */}
      <div className="relative z-50 flex flex-col items-center justify-center gap-4 p-8 ">
        {/* Spinner */}
        <div className="relative">
          {/* Outer circle */}
          <div className={`${sizeConfig.container} border-gray-200 rounded-full`}></div>
          {/* Animated inner circle */}
          <div
            className={`absolute inset-0 ${sizeConfig.container} border-t-[#445E94] border-r-transparent border-b-[#445E94] border-l-[#445E94] rounded-full animate-spin`}
          ></div>
        </div>
        {/* Loading Text */}
        {message && <p className={`text-gray-700 font-medium ${sizeConfig.text}`}>{message}</p>}
      </div>
    </div>
  );
};

export default LoaderEmpt;