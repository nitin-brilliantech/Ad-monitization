import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Button from "../../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { createWithdrawalRequest,fetchWithdrawalRequests } from "../../../redux/slices/user/walletSlice";
import Toast from "../../../components/ui/toast/Toast";
const WithdrawEarnings = ({ onClose, balance }) => {

  const {formLoading} = useSelector((state)=>state.wallet)

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      amount: "",
      upi: ""
    }
  });

  const amountValue = parseFloat(watch("amount") || 0);

  const onSubmit = async (data) => {
    if (parseFloat(data.amount) > balance) {
      Toast.error("Invalid Amount","Withdrawal amount cannot exceed your current balance.")
      return;
    }

    try {
      await dispatch(createWithdrawalRequest(data)).unwrap();

      onClose();

     Toast.success("Request Sent!","Please keep checking your status updates and email for further updates.")
      dispatch(fetchWithdrawalRequests());

      console.log("Withdrawal request form data ", data);  // ❌ commented out
    } catch (error) {
      Toast.error("Request Failed",error || "Something went wrong. Please try again later.")
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
        <div className="flex gap-4">
          <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">UPI Withdrawal</h2>
            <p className="text-md text-white/70 mt-0.5">Submit a withdrawal request</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="pt-2">
        <div className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block font-semibold text-md text-gray-900 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
                validate: (val) =>
                  parseFloat(val) < balance ||
                  `Withdrawal amount must be less than your current balance (you cannot empty the wallet)`
              })}
              placeholder="Enter withdrawal amount"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff] ${
                errors.amount ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300"
              }`}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* UPI ID Field */}
          <div>
            <label className="block font-semibold text-md text-gray-900 mb-1">
              UPI ID
            </label>
            <input
              type="text"
              {...register("upi", {
                required: "UPI ID is required",
                pattern: {
                  value: /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/,
                  message: "Enter a valid UPI ID (e.g., name@bank)"
                }
              })}
              placeholder="e.g., yourname@upi"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff] ${
                errors.upi ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300"
              }`}
            />
            {errors.upi && (
              <p className="text-sm text-red-500 mt-1">{errors.upi.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-blue-100 mt-6">
          <Button
            label="Submit Withdrawal Request"
            type="submit"
            loading={formLoading}
            disabled={!isValid}
            isIcon={false}
            className="cursor-pointer bg-[#5B7FE5] hover:bg-[#4a6dd4] shadow-md"
          />
        </div>
      </form>
    </div>
  );
};

export default WithdrawEarnings;