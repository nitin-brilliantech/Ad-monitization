import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";
import ForgotPassAdmin from "./ForgotPassAdmin";
import { fetchCampaigns } from "../../redux/slices/admin/campaignSlice";
import { fetchAdminProfile, loginAdmin } from "../../redux/slices/admin/adminSlice"
import { Link } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import PageTitle from "../../components/ui/page-title/PageTitle";
import Toast from "../../components/ui/toast/Toast"

const AdminLogin = () => {
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await dispatch(loginAdmin(data));
      const token = response?.payload?.token;
      if (token) {
        localStorage.setItem("token", token);
        dispatch(fetchAdminProfile());
        dispatch(fetchCampaigns());
        navigate("/");
        Toast.success("Sign in Successful!");
      } else {
        Toast.error("Failed to Sign in!");
      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.error("Failed", "Failed to Sign in!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="Xpandifi" /> {/* sets the title for signin page */}
      <div className="min-h-screen flex">
        {/* Left Section */}
        <div className="w-1/2 hidden lg:flex flex-col justify-center items-center bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-10">
          <img
            src="/images/Logo.svg"
            alt="Xpandifi Logo"
            className="h-10 mb-4"
          />
          <h1 className="text-2xl font-bold mb-2 text-center">
            One Platform to Streamline <br /> All Product Analytics
          </h1>
          <p className="text-sm text-center opacity-75">
            Your Revenue are set to grow by 20% next month.
            <br />
            Your Revenue is increased by next month.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
          <Link to="/" className="absolute right-2 top-2">
            <Button
              isIcon={false}
              label="Go Back"
              type="button"
              className="hover:scale-x-90 hover:underline"
            />
          </Link>
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative">
            {/* Mascot Image */}
            <img
              src="/images/auth/head.svg"
              alt="Mascot"
              className="absolute -top-28 left-1/2 transform -translate-x-1/2 w-50 h-35 object-contain"
            />

            <h2 className="text-2xl font-semibold text-center mt-12">
              Welcome
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Let’s manage together
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 3 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`w-full hover:cursor-pointer py-2 flex justify-center items-center gap-2 text-white rounded-full transition ${isSubmitting || loading
                    ? "bg-[#5F7C95] cursor-not-allowed"
                    : `bg-[#5F7C95] hover:bg-[#445E94]`
                  }`}
              >
                <div className="flex items-center space-x-2">
                  {(isSubmitting || loading) && <Loader size="vs" />}
                  <span className="whitespace-nowrap">
                    {isSubmitting || loading ? "Signing in..." : "Login"}
                  </span>
                </div>
              </button>

              <div className="text-right mt-2">
                <span
                  className="text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setIsForgotOpen(true)}
                >
                  Forgot password?
                </span>
              </div>
            </form>
            <img
              src="/images/auth/tail.svg"
              alt="Mascot"
              className="absolute top-100 left-1/2 transform -translate-x-1/2 w-24 h-24 object-contain"
            />
          </div>
        </div>
      </div>
      <ForgotPassAdmin
        isForgotOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </>
  );
};

export default AdminLogin;
