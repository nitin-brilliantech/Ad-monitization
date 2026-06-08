import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import StatusBadge from "../../../components/ui/badges/StatusBadge"
import CampaignDetailsModal from "../../admin/campaign/CampaignDetailsModal"

const ActiveCampaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, fetched } = useSelector(
    (state) => state.campaign
  );

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizeMedia = (files = []) => {
    const images = files.filter(file =>
      file.match(/\.(jpeg|jpg|png|gif)$/i)
    );
    const videos = files.filter(file =>
      file.match(/\.(mp4|mov|webm)$/i)
    );
    return { images, videos };
  };


  const handleRowClick = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const filter_camp = useMemo(
  () =>
    campaigns?.filter((c)=>c?.isPayment)
  
  .map((c) => {
      let status = "INACTIVE";

      if (c.isExpired) {
        status = "EXPIRED";
      } else if (c.isPayment && !c.isExpired && c.isActive) {
        status = "ACTIVE";
      }

      let normalizedFiles = c.productFiles;
      if (Array.isArray(c.productFiles)) {
        normalizedFiles = normalizeMedia(c.productFiles);
      }

      return {
        ...c,
        status,
        productFiles: normalizedFiles,
      };
    })
    .sort((a, b) => {
      return a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1;
    }),
  [campaigns]
);

//  Fetch on mount
  useEffect(() => {
    if (!fetched && !loading) {
      dispatch(fetchCampaigns());
    }
  }, [fetched, loading, dispatch]);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "startDate", label: "Start Date" },
    { id: "endDate", label: "End Date" },
    {
      id: "budget",
      label: "Amount",
      render: (row) => `₹ ${row.baseBid}`,
    },
    {
      id: "status",
      label: "Status",
      render: (row) => <StatusBadge isActive={row.isActive} isExpired={row?.isExpired} size={11} />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
      <ReusableTable
        columns={columns}
        rows={filter_camp}
        loading={loading}
        onRefresh={refreshCampaigns}
        filterKey="status"
        filterOptions={["all", "ACTIVE", "INACTIVE", "EXPIRED"]}
        order={"desc"}
        orderBy={"updatedAt"}
        searchableColumns={["name", "budget", "brandName", "campaignCode"]}
        onRowClick={handleRowClick}
      />

      <CampaignDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={selectedCampaign}
        openRejectModal={() => { }}
        onApprove={() => { }}
      />
    </div>
  );
};

export default ActiveCampaigns;