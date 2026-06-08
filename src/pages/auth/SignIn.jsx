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
    className={`animate-spin ${
      size === "sm" ? "w-4 h-4" : "w-6 h-6"
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
        <div className="w-full p-2 lg:w-1/2 bg-[url('/images/auth/login-img.png')] bg-cover bg-center h-60 sm:h-72 md:h-96 lg:h-auto" />

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20 xl:p-24 bg-white">
          <Link to="/adminLogin" className="absolute right-2 top-2">
            <Button
              isIcon={false}
              label="Admin Login"
              type="button"
              className="hover:scale-x-90 hover:underline"
            />
          </Link>

          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo/xpandifi-logo.svg"
                alt="Xpandifi Logo"
                className="h-10"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-2">
              Welcome
            </h2>
            <p className="text-sm text-center text-[#697586] mb-6">
              Your ads have been waiting for you
            </p>

            {/* Login Form */}
            <form
              onSubmit={handleLoginSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...loginRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                {loginErrors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  {...loginRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                {loginErrors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoginSubmitting || formLoading}
                className={`w-full hover:cursor-pointer  py-2 flex justify-center items-center gap-2 text-white rounded-full transition ${
                  isLoginSubmitting || formLoading
                    ? "bg-[#5F7C95] cursor-not-allowed"
                    : "bg-[#5F7C95] hover:bg-[#445E94]"
                }`}
              >
                {isLoginSubmitting || formLoading ? <Spinner /> : null}
                {isLoginSubmitting || formLoading ? "Logging in..." : "Login"}
              </button>

              {/* Forgot Password */}
              <div className="text-right">
                <span
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setIsForgotOpen(true)}
                >
                  Forgot password?
                </span>
              </div>
            </form>

            {/* Footer */}
            <p className="text-sm text-gray-500 mt-8">
              Don't have an Ads monetization account?{" "}
              <Link to="/contact-us" className="text-blue-600 hover:underline">
                Register here
              </Link>
            </p>
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