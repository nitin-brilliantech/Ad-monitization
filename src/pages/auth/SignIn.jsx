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
        {/* Left Side - Brand & Info */}
        <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col items-start text-white">
          <div className="w-full space-y-4">
            {/* Logo */}
            <div className="flex justify-center lg:justify-center">
              <img
                src="/images/logo/bts-long-logo.png"
                alt="BTS Logo"
                className="h-16 sm:h-40 object-contain"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="w-full text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Transform Your Advertising Experience
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Connect advertisers with retailers seamlessly. Manage campaigns, track performance, and maximize revenue all in one powerful platform.
              </p>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="">
                    <h3 className="text-gray-600 font-semibold text-lg ">Real-time Analytics</h3>
                    <p className="text-gray-500 text-sm">Monitor campaign performance with live data and insights</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div >
                    <h3 className="text-gray-600 font-semibold text-lg">Smart Bid Management</h3>
                    <p className="text-gray-500 text-sm">Optimize your ad spend with intelligent bidding strategies</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mt-1">
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
        <div className="w-full bg-gradient-to-br from-blue-600 to-blue-300 lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20 xl:p-24 relative">
          <Link to="/adminLogin" className="absolute right-6 top-6">
            <button className="px-6 cursor-pointer py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 hover:shadow-lg">
              Admin Login
            </button>
          </Link>

          <div className="w-full max-w-md">
            {/* Logo */}
            {/* <div className="flex justify-center mb-8">
              <img
                src="/images/logo/bts-long-logo.png"
                alt="Xpandifi Logo"
                className="h-20 drop-shadow-md"
              />
            </div> */}

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-md">
                Welcome Back
              </h2>
              <p className="text-base text-white/80">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20">
              <form
                onSubmit={handleLoginSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
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
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff] focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      {...loginRegister("password", {
                        required: "Password is required",
                        minLength: {
                          value: 3,
                          message: "Password must be at least 3 characters",
                        },
                      })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff] focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-end">
                  <span
                    className="text-sm font-medium text-[#4684ff] hover:text-[#3a6fe6] hover:underline cursor-pointer transition-colors"
                    onClick={() => setIsForgotOpen(true)}
                  >
                    Forgot password?
                  </span>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoginSubmitting || formLoading}
                  className={`w-full py-3.5 flex justify-center items-center gap-2 text-white font-semibold rounded-lg transition-all duration-200 ${isLoginSubmitting || formLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#4684ff] hover:bg-[#3a6fe6] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                >
                  {isLoginSubmitting || formLoading ? <Spinner /> : null}
                  {isLoginSubmitting || formLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              <p className="text-sm text-gray-900 mt-6 text-center">
                Don't have an account?{"  "}
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