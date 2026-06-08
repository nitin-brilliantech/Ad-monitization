import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "../../components/loader/Loader";
import { getforgotPassOTP, submitNewPassOTP } from "../../api/admin/admin-api/admin-api";
import { Modal } from "antd";
import Toast from "../../components/ui/toast/Toast";

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
     
      Toast.success("OTP Sent","Check your email for the OTP.")
    } catch (error) {
      console.error("Error sending OTP:", error);
      Toast.error( "Failed to Send OTP","Please try again.")
    } finally {
      setLoading(false);
    }
  };

  const onForgot = async (data) => {
    if (isExpired) return Toast.warning("OTP Expired","Please resend the OTP.");


    try {
      setLoading(true);
      const payload = {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      };
      await submitNewPassOTP(payload);
      Toast.success("Password Reset","You can now log in with your new password.")
      reset();
      onClose();
    } catch (error) {
      console.error("Error resetting password:", error);
      Toast.error("Failed","Could not reset password. Check OTP or try again.")
    } finally {
      setLoading(false);
    }
  };

  const btnClass = (isBusy) =>
    `w-full py-2 text-white font-medium transition rounded-full ${
      isBusy
        ? "bg-[#849fb7] cursor-not-allowed"
        : "bg-[#5F7C95] hover:bg-[#476279]"
    }`;

  return (
    <Modal
      open={isForgotOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <div className="max-w-md mx-auto">
        {!isOtpSent ? (
          <form onSubmit={handleSubmitOtp(onEmailSubmit)} className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Forgot Password</h3>
            <p className="text-sm text-center text-gray-600 mb-4">
              Enter your email to receive an OTP.
            </p>

            <div>
              <label className="text-sm font-medium block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...registerOtp("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errorsOtp.email && (
                <p className="text-sm text-red-500 mt-1">{errorsOtp.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmittingOtp || loading}
              className={btnClass(isSubmittingOtp || loading)}
            >
              {(isSubmittingOtp || loading) && <Loader size="vs" />}
              {!(isSubmittingOtp || loading) && "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onForgot)} className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Reset Password</h3>
            <p className="text-sm text-center text-gray-700">
              {isExpired ? (
                <span className="text-red-500">OTP expired. Please resend.</span>
              ) : (
                <>
                  OTP expires in{" "}
                  <span className="font-semibold text-red-500">
                    {formatTime(expirationTime)}
                  </span>
                </>
              )}
            </p>

            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />

            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp", { required: "OTP is required" })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}

            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword.message}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={btnClass(isSubmitting || loading)}
            >
              {(isSubmitting || loading) && <Loader size="vs" />}
              {!(isSubmitting || loading) && "Reset Password"}
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
                className="text-sm text-blue-600 hover:underline block text-center"
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
