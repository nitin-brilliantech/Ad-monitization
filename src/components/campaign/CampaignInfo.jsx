import { formatScheduleDate } from "../../util/Form-menu/DateUtils";
import {
  FaCalendarAlt,
  FaStore,
  FaTag,
  FaClock,
  FaBullseye,
  FaMoneyBillWave,
  FaChartLine,
  FaIndustry
} from "react-icons/fa";
import { Modal } from "../../components/ui/modal/Modal";

const CampaignInfoModal = ({ isOpen, onClose, campaign }) => {
  const targeting =
    campaign.devices?.length > 0
      ? campaign.devices.map((device) => device.name).join(", ")
      : "—";

  const infoItems = [
    { label: "Campaign Name", value: campaign.name || "—", icon: <FaTag /> },
    { label: "Brand", value: campaign.brandName || "—", icon: <FaIndustry /> },
    {
      label: "Schedule",
      value: formatScheduleDate(campaign.startDate, campaign.endDate) || "—",
      icon: <FaCalendarAlt />
    },
    { label: "Ad Type", value: campaign.adType || "—", icon: <FaBullseye /> },
    { label: "Store Type", value: campaign.storeTypes || "—", icon: <FaStore /> },
    { label: "Product Type", value: campaign.product || "—", icon: <FaTag /> },
    { label: "Targeting", value: targeting, icon: <FaBullseye /> },
    { label: "Duration", value: campaign.duration ? `${campaign.duration} sec` : "—", icon: <FaClock /> },
    {
      label: "Base Value",
      value: campaign.baseBid !== undefined ? `₹ ${campaign.baseBid}` : "—",
      icon: <FaMoneyBillWave />
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={true}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{campaign?.name || "Campaign Details"}</h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {infoItems.map(({ label, value, icon }, index) => (
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
      </div>
    </Modal>
  );
};

export default CampaignInfoModal;
