import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import StatCard from "../../../components/card/StatCard";
import ReusableTable from "../../../components/table/ReusableTable";
import HeaderSection from "../../../components/ui/header-section/HeaderSection";
import {
  getBaseBidSumsByStatus,
  getMaxBidCapSumsByStatus,
} from "../../../util/helper/sumFunctions";
import { fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";
import { formatDate } from "../../../util/helper/formatDate";
import { useCurrentUser } from "../../../components/ui/user/CurrentUser";

const AdAgencyDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const { campaigns, loading } = useSelector((state) => state.campaign);

  const [baseBidSums, setBaseBidSums] = useState({});
  const [maxBidCapSums, setMaxBidCapSums] = useState({});

  useEffect(() => {
    dispatch(fetchDropdownData());
  }, [dispatch]);

  const filter_camp = campaigns?.filter((c) => c.isPayment === false);

  useEffect(() => {
    setBaseBidSums(getBaseBidSumsByStatus(filter_camp));
    setMaxBidCapSums(getMaxBidCapSumsByStatus(filter_camp));
  }, []);

  const statsData = [
    { title: "Revenue", value: "25.1k", change: "+15%", currency: true },
    { title: "Ad Clicks", value: "25.1k", change: "+2.5%", currency: false },
    {
      title: "Campaign Approved Base Values",
      value: baseBidSums.approvedSum ?? 0,
      change: "+15%",
      currency: true,
    },
    {
      title: "Approved Successful Bid",
      value: maxBidCapSums.approvedSum ?? 0,
      change: "+15%",
      currency: true,
    },
  ];

  const columns = [
    { id: "campaignCode", label: "Campaign ID" },
    { id: "name", label: "Campaign Name" },
    { id: "timings", label: "Time Slots" },
    { id: "baseBid", label: "Bid Amount", render: (row) => `₹${row.baseBid}` },
    {
      id: "isApproved",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.isApproved} size={12} />,
    },
    {
      id: "createdAt",
      label: "Result In",
      render: (row) => formatDate(row.createdAt),
    },
  ];


  return (
    <div className="w-full">
      <HeaderSection
        title="Welcome,"
        subtitle={user?.fullName || "Ad Agency"}
        showButton
        buttonLabel="Create Campaign"
        onButtonClick={() => navigate("/create-campaign")}
        subtitleClass="text-[#4684ff] font-bold text-xl"
        buttonClass="cursor-pointer"
      />

      <div
        className="grid gap-4 w-full mb-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {statsData.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      <ReusableTable
        columns={columns}
        rows={filter_camp}
        loading={loading}
        onRefresh={() => dispatch(fetchCampaigns())}
        filterKey="isApproved"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        order="desc"
        orderBy="updatedAt"
      />
    </div>
  );
};

export default AdAgencyDashboard;
