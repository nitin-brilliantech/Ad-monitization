import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getforgotPassOTP, submitNewPassOTP } from "../../api/admin/admin-api/admin-api";
import { Modal } from "antd";
import Toast from "../../components/ui/toast/Toast";

const Spinner = () => (
  <svg
    className="animate-spin w-4 h-4 text-white inline-block mr-2"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const ForgotPassAdmin = ({ isForgotOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [expirationTime, setExpirationTime] = useState(600);
  const [isExpired, setIsExpired] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp, isSubmitting: isSubmittingOtp },
    reset: resetOtp,
  } = useForm();

  useEffect(() => {
    let timer;
    if (isOtpSent && expirationTime > 0) {
      timer = setTimeout(() => {
        setExpirationTime((prev) => prev - 1);
      }, 1000);
    } else if (expirationTime === 0 && isOtpSent) {
      setIsExpired(true);
    }
    return () => clearTimeout(timer);
  }, [expirationTime, isOtpSent]);

  useEffect(() => {
    if (!isForgotOpen) {
      reset();
      resetOtp();
      setEmail("");
      setIsOtpSent(false);
      setExpirationTime(600);
      setIsExpired(false);
    }
  }, [isForgotOpen]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const onEmailSubmit = async (data) => {
    try {
      setLoading(true);
      await getforgotPassOTP({ email: data.email });
      setEmail(data.email);
      setIsOtpSent(true);
      setExpirationTime(600);
      setIsExpired(false);
      Toast.success("OTP Sent", "Check your email for the OTP.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      Toast.error("Failed to Send OTP", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onForgot = async (data) => {
    if (isExpired) return Toast.warning("OTP Expired", "Please resend the OTP.");

    try {
      setLoading(true);
      const payload = {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      };
      await submitNewPassOTP(payload);
      Toast.success("Password Reset", "You can now log in with your new password.");
      reset();
      onClose();
    } catch (error) {
      console.error("Error resetting password:", error);
      Toast.error("Failed", "Could not reset password. Check OTP or try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bts-input-inner flex-grow bg-transparent text-gray-900 placeholder-gray-400 outline-none";

  const btnClass = (isBusy) =>
    `w-full py-3.5 flex justify-center items-center gap-2 text-white font-semibold rounded-lg transition-all duration-200 ${
      isBusy
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#4684ff] hover:bg-[#3a6fe6] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
    }`;

  const errorMsg = (msg) => (
    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );

  return (
    <Modal
      open={isForgotOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <div className="max-w-md mx-auto py-2">
        {!isOtpSent ? (
          <form onSubmit={handleSubmitOtp(onEmailSubmit)} className="space-y-5">
            {/* Header */}
            <div className="text-center mb-2">
              <h3 className="text-2xl font-bold text-gray-900">Forgot Password</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email to receive an OTP.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="bts-input-wrapper flex items-center w-full bg-white px-4 gap-3">
                <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  {...registerOtp("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className={inputClass}
                />
              </div>
              {errorsOtp.email && errorMsg(errorsOtp.email.message)}
            </div>

            <button
              type="submit"
              disabled={isSubmittingOtp || loading}
              className={btnClass(isSubmittingOtp || loading)}
            >
              {(isSubmittingOtp || loading) && <Spinner />}
              {isSubmittingOtp || loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onForgot)} className="space-y-5">
            {/* Header */}
            <div className="text-center mb-2">
              <h3 className="text-2xl font-bold text-gray-900">Reset Password</h3>
              <p className="text-sm text-center text-gray-700 mt-1">
                {isExpired ? (
                  <span className="text-red-500 font-medium">OTP expired. Please resend.</span>
                ) : (
                  <>
                    OTP expires in{" "}
                    <span className="font-semibold text-red-500">{formatTime(expirationTime)}</span>
                  </>
                )}
              </p>
            </div>

            {/* Disabled email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="bts-input-wrapper flex items-center w-full bg-gray-100 px-4 opacity-70 cursor-not-allowed">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="bts-input-inner flex-grow bg-transparent text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* OTP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP Code
              </label>
              <div className="bts-input-wrapper flex items-center w-full bg-white px-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", { required: "OTP is required" })}
                  className={inputClass}
                />
              </div>
              {errors.otp && errorMsg(errors.otp.message)}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="bts-input-wrapper flex items-center w-full bg-white px-4 gap-3">
                <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                  className={inputClass}
                />
              </div>
              {errors.newPassword && errorMsg(errors.newPassword.message)}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={btnClass(isSubmitting || loading)}
            >
              {(isSubmitting || loading) && <Spinner />}
              {isSubmitting || loading ? "Resetting..." : "Reset Password"}
            </button>

            {isExpired && (
              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  resetOtp();
                  setExpirationTime(600);
                  setIsExpired(false);
                }}
                className="text-sm font-medium text-[#4684ff] hover:text-[#3a6fe6] hover:underline block text-center w-full transition-colors"
              >
                Resend OTP
              </button>
            )}
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPassAdmin;
