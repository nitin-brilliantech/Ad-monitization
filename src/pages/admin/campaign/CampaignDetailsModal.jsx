import React from "react";
import { Modal } from "../../../components/ui/modal/Modal";
import MediaCarousels from "../../../components/ui/carousel/MediaCarousels";

const CampaignDetailsModal = ({
  isOpen,
  openRejectModal,
  onClose,
  campaign,
  onApprove,
}) => {
  if (!campaign) return null;
  const targeting =
    campaign.devices?.length > 0
      ? campaign.devices.map((device) => device.name).join(", ")
      : "—";

  const regions =
    campaign.cityPostcodes?.length > 0
      ? campaign.cityPostcodes.map((item) => item.city).join(", ")
      : "—";

  const infoItems = [
    { label: "Campaign Name", value: campaign.name || campaign.campaignName || "—" },
    { label: "Brand", value: campaign.brandName || "—" },
    { label: "Date", value: campaign.startDate + " to " + campaign.endDate || "—" },
    { label: "Time Slot", value: campaign.timings || "—" },
    { label: "Ad Type", value: campaign.adType || "—" },
    { label: "Store Type", value: campaign.storeTypes || "—" },
    { label: "Product Type", value: campaign.product || "—" },
    { label: "Devices", value: targeting },
    { label: "Duration", value: campaign.duration ? `${campaign.duration} sec` : "—" },
    { label: "Base Value", value: campaign.baseBid !== undefined ? `₹ ${campaign.baseBid}` : "—" },
    { label: "Regions", value: regions },
  ];

  const showPaymentPendingBadge =
    campaign.isPayment === false &&
    campaign.isApproved === "APPROVED";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          {/* Title */}
          <h2 className="text-2xl font-semibold">
            {campaign?.name || campaign?.campaignName || "Campaign Details"}
          </h2>

          {/* Payment Pending Badge */}
          {showPaymentPendingBadge && (
            <div className="inline-flex items-center bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full">
              PAYMENT PENDING
            </div>
          )}
        </div>


        {/* Campaign Info in Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {infoItems.map(({ label, value }, index) => (
            <div key={index}>
              <label className="text-sm text-gray-600 flex items-center gap-2">
                {label}
              </label>
              <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Product Media Section */}
        {campaign?.productFiles && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Product Media
            </h3>
            <MediaCarousels
              mediaFiles={campaign?.productFiles || []}
              size="md"
            />
          </div>
        )}

        {/* Action Buttons */}
        {campaign.isApproved === "PENDING" && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-5 py-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={openRejectModal}
            >
              Reject
            </button>
            <button
              className="px-5 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => onApprove("APPROVE")}
            >
              Approve
            </button>
          </div>
        )}

        {/* Remark (if campaign is rejected) */}
        {campaign.isApproved === "REJECTED" && campaign.remark && (
          <div>
            <label className="text-sm text-gray-600">Rejection Remark</label>
            <div className="mt-1 w-full px-3 py-2 text-gray-800 bg-white border border-gray-200 rounded-md shadow-sm text-sm">
              {campaign.remark}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CampaignDetailsModal;