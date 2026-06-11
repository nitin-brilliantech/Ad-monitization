import React, { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/ui/bread-crumb/Breadcrumbs";
import Button from "../../../components/ui/button/Button";
import { makePayoutAPI } from "../../../api/admin/payout/payout-api";
import { useDispatch } from "react-redux";
// import Swal from "sweetalert2";
import { fetchPayouts } from "../../../redux/slices/admin/payoutSlice";
import { useCurrentUser } from "../../../components/ui/user/CurrentUser";
import Toast from "../../../components/ui/toast/Toast";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PayoutCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = useCurrentUser();
  const requestData = location.state?.row;

  // Destructure payout info safely
  const {
    withdrawalRequestCode = "",
    name = "",
    amount = 0,
    paymentMethod = "",
    createdAt = "",
    id,
  } = requestData || {};

  useEffect(() => {
    if (!requestData) {
      navigate("/revenue-payouts"); // Redirect to payouts list instead of campaigns-list
    }
  }, [requestData, navigate]);

  const handlePayout = useCallback(async () => {
    if (!requestData || !user) {
      return Toast.warning("Missing Info", "Payout or user data not available");
    }

    setIsLoading(true);

    try {
      const res = await makePayoutAPI(id);
      console.log("responsing..", res);

      // Safely extract nested status & reference
      const payoutStatus = res?.data?.data?.status;
      const referenceId = res?.data?.data?.data?.referenceId;
      const utr = res?.data?.data?.data?.utr;

      if (res?.success && payoutStatus === "SUCCESS") {
        navigate("/revenue-payouts");
        Toast.success(
          "Payout Successful",
          `Your payout has been processed successfully! 
Reference: ${referenceId || "-"} | UTR: ${utr || "-"}`
        );

        dispatch(fetchPayouts());
      } else {
        Toast.error(
          "Payout Failed",
          res?.data?.data?.message ||
            res?.message ||
            "Payment could not be processed. Please contact support."
        );
      }
    } catch (err) {
      console.error("Payout error:", err);
      Toast.error("Error", err?.message || "Failed to process payout", "error");
    } finally {
      setIsLoading(false);
    }
  }, [requestData, user, id, navigate, dispatch]);

  if (!requestData) {
    return (
      <div className="text-center text-gray-500 mt-20">Redirecting...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100  pb-8 pt-4">
      {isLoading && <LoaderEmpt size="large" />}

      <header className="mb-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          {name || withdrawalRequestCode}
        </h1>
      </header>

      <div className="bg-white rounded-xl shadow-xl p-6 mx-auto">
        <div className="space-y-4 text-sm text-gray-700">
          <InfoRow
            label="Request Code"
            value={withdrawalRequestCode}
            highlight
          />
          <InfoRow label="Name" value={name} />
          <InfoRow label="Amount" value={`₹ ${amount}`} />
          <InfoRow label="Payment Method" value={paymentMethod.toUpperCase()} />
          <InfoRow label="Date Requested" value={formatDate(createdAt)} />
          <hr className="my-2 border-gray-300" />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            label={`Transfer ₹${amount}`}
            isIcon={false}
            className="cursor-pointer"
            onClick={handlePayout}
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span className={highlight ? "text-blue-600 font-semibold" : ""}>
      {value}
    </span>
  </div>
);

export default PayoutCheckout;
