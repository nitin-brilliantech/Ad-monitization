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
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className=" bg-white rounded-xl  space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">UPI Withdrawal</h2>

      {/* Amount Field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
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
          className={`block w-full rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.amount ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
            }`}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* UPI ID Field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
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
          className={`block w-full rounded-lg border border-gray-300 p-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.upi ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
            }`}
        />
        {errors.upi && (
          <p className="text-sm text-red-500">{errors.upi.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          label="Submit Withdrawal Request"
          type="submit"
          loading={formLoading}
          disabled={!isValid}
          isIcon={false}
          className="hover:cursor-pointer"
        />
      </div>
    </form>
  );
};

export default WithdrawEarnings;