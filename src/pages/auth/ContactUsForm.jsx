import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import LocationFields from "../../components/LocationsDropdown/LocationFields";
import { registerUserApi } from "../../api/user/user/user-api";
import Toast from "../../components/ui/toast/Toast";
import PageTitle from "../../components/ui/page-title/PageTitle";

const Spinner = ({ size = "sm", className = "" }) => (
  <svg
    className={`animate-spin ${size === "sm" ? "w-4 h-4" : "w-6 h-6"} text-white ${className}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const selectedRole = watch("role");

  const roleSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "44px",
      height: "44px",
      borderRadius: "8px",
      borderWidth: "1px",
      borderColor: state.isFocused ? "#4684ff" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(70,132,255,0.25)" : "none",
      backgroundColor: "#ffffff",
      transition: "border-color 200ms ease, box-shadow 200ms ease",
      "&:hover": { borderColor: state.isFocused ? "#4684ff" : "#a0aec0" },
      cursor: "pointer",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 14px", height: "44px" }),
    input: (base) => ({ 
      ...base, 
      margin: 0, 
      padding: 0, 
      fontSize: "14px",
      outline: 0,
      border: 0,
      boxShadow: "none",
      "& input": {
        outline: "0 !important",
        border: "0 !important",
        boxShadow: "none !important",
      },
      "& input:focus": {
        outline: "0 !important",
        border: "0 !important", 
        boxShadow: "none !important",
      }
    }),
    singleValue: (base) => ({ ...base, fontSize: "14px", color: "#111827" }),
    placeholder: (base) => ({ ...base, fontSize: "14px", color: "#6b7280" }),
    indicatorsContainer: (base) => ({ ...base, height: "44px" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "#6b7280", paddingRight: "10px" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      boxShadow: "0 10px 25px rgba(15,23,42,0.12), 0 4px 10px rgba(15,23,42,0.06)",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
      marginTop: "4px",
    }),
    menuList: (base) => ({ ...base, padding: "4px", maxHeight: "220px" }),
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      borderRadius: "6px",
      margin: "1px 0",
      padding: "9px 12px",
      backgroundColor: state.isSelected
        ? "#4684ff"
        : state.isFocused
        ? "rgba(70,132,255,0.08)"
        : "transparent",
      color: state.isSelected ? "#fff" : "#111827",
      cursor: "pointer",
      transition: "background-color 120ms ease",
    }),
  };
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerUserApi(data);
      if (response.status === 201 || response.status === 200) {
        Toast.success("Request Submitted!", "Your request has been submitted successfully.");
      }
      reset();
      navigate("/signin");
    } catch (err) {
      console.error("Submission failed:", err);
      Toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff] focus:border-transparent transition-all duration-200 bg-white text-sm";

  const errorMsg = (msg) => (
    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );

  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <>
      <PageTitle title="Xpandifi - Register" />
      <div className="min-h-screen flex flex-col lg:flex-row">

        {/* Left Side - Brand & Info */}
        <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col items-start">
          <div className="w-full space-y-4">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src="/images/logo/bts-long-logo.png"
                alt="BTS Logo"
                className="h-16 sm:h-40 object-contain"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="w-full text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Grow Your Business with Us
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Join our platform as an advertiser or retailer and start monetizing your reach with powerful ad campaigns.
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
                    <h3 className="text-gray-600 font-semibold text-lg">Seamless Onboarding</h3>
                    <p className="text-gray-500 text-sm">Get started quickly with a simple registration process</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-gray-600 font-semibold text-lg">Smart Ad Targeting</h3>
                    <p className="text-gray-500 text-sm">Reach the right audience with location and device targeting</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-600">Revenue Growth</h3>
                    <p className="text-gray-500 text-sm">Maximize earnings with transparent payout tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full bg-gradient-to-br from-blue-600 to-blue-300 lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 relative">
          <Link to="/signin" className="absolute right-6 top-6">
            <button className="px-6 cursor-pointer py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-200 hover:shadow-lg">
              Back to Login
            </button>
          </Link>

          <div className="w-full max-w-xl">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-md">
                Create Account
              </h2>
              <p className="text-base text-white/80">
                Fill in the details below to register
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20">
              <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Full Name */}
                  <div>
                    <label className={labelClass}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...register("fullName", { required: "Full Name is required" })}
                      className={inputClass}
                    />
                    {errors.fullName && errorMsg(errors.fullName.message)}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass}>
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      {...register("phone", { required: "Phone is required" })}
                      className={inputClass}
                    />
                    {errors.phone && errorMsg(errors.phone.message)}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      className={inputClass}
                    />
                    {errors.email && errorMsg(errors.email.message)}
                  </div>

                  {/* Role */}
                  <div>
                    <label className={labelClass}>
                      Role <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: "Role is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={[
                            { label: "Ad-Agency", value: "Ad-Agency" },
                            { label: "Retailer", value: "Retailer" },
                          ]}
                          placeholder="Select Role"
                          value={
                            field.value
                              ? { label: field.value, value: field.value }
                              : null
                          }
                          onChange={(selected) => field.onChange(selected?.value || "")}
                          styles={roleSelectStyles}
                          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                          menuPosition="fixed"
                          classNamePrefix="role-select"
                        />
                      )}
                    />
                    {errors.role && errorMsg(errors.role.message)}
                  </div>

                  {/* Location Fields */}
                  <LocationFields
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    isPincode={false}
                    isRequired={true}
                    inputClassName={inputClass}
                    labelClassName={labelClass}
                  />

                  {/* Business Name — shown when role is selected */}
                  {selectedRole && (
                    <div className="col-span-1 md:col-span-2">
                      <label className={labelClass}>
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Legal Name as per your Tax Certificate"
                        {...register("businessName", { required: "Business Name is required" })}
                        className={inputClass}
                      />
                      {errors.businessName && errorMsg(errors.businessName.message)}
                    </div>
                  )}

                  {/* Message */}
                  <div className="col-span-1 md:col-span-2">
                    <label className={labelClass}>
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Write your message here..."
                      rows={3}
                      {...register("message", { required: "Message is required" })}
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && errorMsg(errors.message.message)}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className={`w-full py-3.5 flex justify-center items-center gap-2 text-white font-semibold rounded-lg transition-all duration-200 ${
                    loading || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#4684ff] hover:bg-[#3a6fe6] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {(loading || isSubmitting) && <Spinner size="sm" />}
                  {loading || isSubmitting ? "Submitting..." : "Register"}
                </button>

                <p className="text-sm text-gray-900 text-center">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-semibold text-[#4684ff] hover:text-[#3a6fe6] hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsForm;
