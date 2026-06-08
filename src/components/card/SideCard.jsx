import React from "react";
import StatusBadge from "../../components/ui/badges/StatusBadge"

const SideCard = ({
  ads = [],
  title = "Campaigns",
  units = "",
  onAdClick = () => {},
}) => {
  // Transform campaign into display-ready data
  const transformAd = (campaign) => {
    const {
      campaignName,
      productFiles = [],
      startDate,
      endDate,
      startTime,
      endTime,
    } = campaign;

    const isActive = campaign.isActive ?? campaign.isAcive ?? false;

    const media = productFiles[0] || "https://via.placeholder.com/48";
    const titleText = campaignName || "Untitled Campaign";

    const time = `${new Date(startDate).toLocaleDateString()} ${startTime || ""} - ${new Date(endDate).toLocaleDateString()} ${endTime || ""}`;
    const status = isActive ? "ACTIVE" : "INACTIVE";

    return { media, titleText, time, status, isActive };
  };

  // Style based on active status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-gray-600 bg-gray-200";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  // Detect if file is a video
  const isVideo = (url) => {
    return url?.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-300 w-full p-3">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      </div>

      {/* Content List */}
      <div className="space-y-4 overflow-y-auto px-6 py-3 flex-1">
        {ads.length === 0 ? (
          <div className="text-gray-500 text-sm text-center">No data available</div>
        ) : (
          ads.map((ad, index) => {
            const { media, titleText, time, status, isActive } = transformAd(ad);
            const statusColor = getStatusColor(status);

            return (
              <div
                key={index}
                className="border-b pb-4 last:border-0 last:pb-0 flex items-center gap-4 border-gray-400 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => onAdClick(ad)}
              >
                {/* Ad Media */}
                {isVideo(media) ? (
                  <video
                    src={media}
                    className="h-12 w-12 rounded-md object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src={media}
                    alt={titleText}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                )}

                {/* Ad Content */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {titleText}
                  </h4>
                  <span className="text-xs text-gray-500 block">{time}</span>
                    <StatusBadge isActive={isActive} size={10}/>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SideCard;
