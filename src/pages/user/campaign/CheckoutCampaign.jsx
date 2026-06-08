import React, { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/ui/bread-crumb/Breadcrumbs";
import MediaCarousel from "../../../components/ui/carousel/MediaCarousel";
import Button from "../../../components/ui/button/Button";
import { useDispatch } from "react-redux";
import { fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import {
  createOrder_cashFree,
  checkCashfreePaymentStatus,
} from "../../../api/user/cashFree/cashFree-api";
import { useCurrentUser } from "../../../components/ui/user/CurrentUser";
import Toast from "../../../components/ui/toast/Toast";
import LoaderEmpt  from "../../../components/loader/LoaderEmpt"

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });



const CheckoutCampaign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useCurrentUser();

  const campaignData = location.state?.row;

  
  
  useEffect(() => {
    if (!campaignData) {
      navigate("/campaigns-list");
    }
  }, [campaignData, navigate]);
  
  

  // Cashfree Payment Handler
  const handleCashfreePayment = useCallback(async () => {
    if (!campaignData || !user) {
      // Swal.fire("Missing Info", "Campaign or user data not available", "warning");
      return Toast.warning(
        "Missing Info",
        "Campaign or user data not available"
      );
    }

    setIsLoading(true);

    try {
      const campaign = campaignData;

      const orderPayload = {
        campaignId: campaign.id,
        amount: campaign.baseBid,
      };

      const res = await createOrder_cashFree(orderPayload);
      const sessionId = res?.paymentSessionId;

      if (!sessionId) throw new Error("No paymentSessionId returned");

      const cashfree = window.Cashfree({ mode: "sandbox" }); // Change to "production" for live
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions);

      // Polling for payment status
      let attempts = 0;
      const maxAttempts = 40;
      const interval = 3000;

      const poll = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await checkCashfreePaymentStatus(sessionId);
          if (statusRes?.success && statusRes?.data?.status === "PAID") {
            clearInterval(poll);
          Toast.success(
            "Payment Successful",
            "Your campaign will be activated soon!",
            10000
          );

            navigate("/campaigns-list");

            dispatch(fetchCampaigns());
          } else if (attempts >= maxAttempts) {
            clearInterval(poll);
            Toast.warning("Timeout",
              "Payment verification timed out. Please check status later.")
          }
        } catch (err) {
          clearInterval(poll);
          console.error("Polling error:", err);
          Toast.error(   "Error",
            "Something went wrong while verifying payment.")
        }
      }, interval);
    } catch (err) {
      console.error("Cashfree order error:", err);
      Toast.error("Error",
        err?.message || "Failed to create Cashfree order")
    } finally {
      setIsLoading(false);
    }
  }, [campaignData, user, navigate, dispatch]);



  if (!campaignData) {
    return (
      <div className="text-center text-gray-500 mt-20">Redirecting...</div>
    );
  }

  const {
    brandName,
    adType,
    duration,
    storeTypes,
    startDate,
    startTime,
    endDate,
    endTime,
    baseBid,
  } = campaignData;

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 pb-8 pt-4">
      {isLoading &&(<LoaderEmpt size="large"/>)}
      <header className="mb-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-gray-800 mt-2">{name}</h1>
      </header>

      <div className="bg-white rounded-xl shadow-xl p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Media */}
          <MediaCarousel
            mediaFiles={campaignData?.productFiles || []}
            size="md"
          />

          {/* Right: Info + Payment */}
          <div className="flex flex-col justify-between">
            <div className="space-y-3 text-sm text-gray-700">
              <InfoRow
                label="Campaign Code"
                value={campaignData?.campaignCode}
                highlight
              />
              <InfoRow label="Brand" value={brandName || "N/A"} />
              <InfoRow label="Ad Type" value={adType || "N/A"} />
              <InfoRow label="Duration" value={`${duration || 0} seconds`} />
              <InfoRow label="Store Type" value={storeTypes || "N/A"} />
              <InfoRow
                label="Devices"
                value={
                  campaignData.devices?.map((d) => d.name).join(", ") || "N/A"
                }
              />
              <InfoRow
                label="Regions"
                value={
                  campaignData.cityPostcodes?.map((c) => c.city).join(", ") ||
                  "N/A"
                }
              />
              <InfoRow
                label="Schedule"
                value={`${formatDate(startDate)} (${
                  startTime || "N/A"
                }) → ${formatDate(endDate)} (${endTime || "N/A"})`}
              />
              <hr className="my-3 border-gray-300" />
            </div>

            <div className="mt-4 flex flex-col md:flex-row justify-end gap-3">
              <Button
                type="button"
                label={`Pay ₹${baseBid || 0}`}
                isIcon={false}
                className="cursor-pointer"
                onClick={handleCashfreePayment}
                loading={isLoading}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// InfoRow component with perfect alignment
const InfoRow = ({ label, value, highlight = false }) => (
  <div className="flex justify-between items-center w-full">
    <span className="font-medium text-gray-600">{label}:</span>
    <span
      className={`${
        highlight ? "text-blue-600 font-semibold" : "text-gray-800"
      } text-right`}
    >
      {value}
    </span>
  </div>
);

export default CheckoutCampaign;
