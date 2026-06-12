import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserProfile, loginUser } from "../../redux/slices/user/userSlice";
import { fetchCampaigns } from "../../redux/slices/user/campaignSlice";
import ForgotPass from "./ForgotPass";
import Button from "../../components/ui/button/Button";
import PageTitle from "../../components/ui/page-title/PageTitle";
import Toast from "../../components/ui/toast/Toast"

const Spinner = ({ size = "sm", className = "" }) => (
  <svg
    className={`animate-spin ${size === "sm" ? "w-4 h-4" : "w-6 h-6"
      } text-white ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const SignIn = () => {
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ use redux loading state
  const { formLoading } = useSelector((state) => state.user);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // unwrap gives payload directly or throws error
      const { token } = await dispatch(loginUser(data)).unwrap();

      if (token) {
        localStorage.setItem("token", token); // keep this if slice doesn't save token
        dispatch(fetchCampaigns());
        dispatch(fetchUserProfile());
        navigate("/");
        Toast.success("Sign in Successful!")
      }
    } catch (err) {
      console.error("Login failed:", err);
      Toast.error("Failed to Sign in")
    }
  };

  return (
    <>
      <PageTitle title="Xpandifi" /> {/* sets the title for signin page */}
      {/* Main Page Layout */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Brand & Info - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex lg:w-1/2 bg-white p-8 lg:p-12 xl:p-16 flex-col justify-start items-start text-white">
          <div className="w-full space-y-1 max-w-xl border">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src="/images/logo/bts-long-logo.png"
                alt="BTS Logo"
                className="h-16 lg:h-40 object-contain"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6 text-left">
              <h1 className="text-gray-900 text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                Transform Your Advertising Experience
              </h1>

              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                Connect advertisers with retailers seamlessly. Manage campaigns, track performance, and maximize revenue all in one powerful platform.
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-semibold text-lg">Real-time Analytics</h3>
                    <p className="text-gray-500 text-sm">Monitor campaign performance with live data and insights</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-semibold text-lg">Smart Bid Management</h3>
                    <p className="text-gray-500 text-sm">Optimize your ad spend with intelligent bidding strategies</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-600">Secure Payments</h3>
                    <p className="text-gray-500 text-sm">Integrated payment gateway for seamless transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#4684ff] via-[#3a6fe6] to-[#2d5acc] min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 relative">
          {/* Admin Login Button */}
          <Link to="/adminLogin" className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10">
            <button className="px-4 cursor-pointer py-1.5 sm:px-6 sm:py-2 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 hover:shadow-lg">
              Admin Login
            </button>
          </Link>

          <div className="w-full max-w-md">
            {/* Mobile Logo - Only visible on mobile */}
            <div className="flex justify-center bg-white rounded-2xl mb-8 lg:hidden">
              <img
                src="/images/logo/bts-long-logo.png"
                alt="BTS Logo"
                className="h-25 object-contain drop-shadow-lg"
              />
            </div>

            {/* Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md">
                Welcome Back
              </h2>
              <p className="text-sm sm:text-base text-white/80">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20">
              <form
                onSubmit={handleLoginSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
                noValidate
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="bts-input-wrapper flex items-center w-full bg-white px-4 gap-3">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...loginRegister("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      className="bts-input-inner flex-grow bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 outline-none"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-xs sm:text-sm text-red-500 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="bts-input-wrapper flex items-center w-full bg-white px-4 gap-3">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginRegister("password", {
                        required: "Password is required",
                        minLength: {
                          value: 3,
                          message: "Password must be at least 3 characters",
                        },
                      })}
                      className="bts-input-inner flex-grow bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs sm:text-sm text-red-500 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-end">
                  <span
                    className="text-xs sm:text-sm font-medium text-[#4684ff] hover:text-[#3a6fe6] hover:underline cursor-pointer transition-colors"
                    onClick={() => setIsForgotOpen(true)}
                  >
                    Forgot password?
                  </span>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoginSubmitting || formLoading}
                  className={`w-full py-2.5 sm:py-3.5 flex justify-center items-center gap-2 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 ${isLoginSubmitting || formLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#4684ff] hover:bg-[#3a6fe6] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                >
                  {isLoginSubmitting || formLoading ? <Spinner /> : null}
                  {isLoginSubmitting || formLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              <p className="text-xs sm:text-sm text-gray-900 mt-4 sm:mt-6 text-center">
                Don't have an account?{" "}
                <Link to="/contact-us" className="font-semibold text-[#4684ff] hover:text-[#3a6fe6] hover:underline transition-colors">
                  Register here
                </Link>
              </p>
            </div>

            {/* Footer */}

          </div>
        </div>
      </div>

      <ForgotPass
        isForgotOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </>
  );
};

export default SignIn;