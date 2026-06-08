import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReusableTable from "../../../components/table/ReusableTable";
import { fetchCampaigns } from "../../../redux/slices/user/campaignSlice";

// 🟢 Render badge for status
const renderStatusBadge = (status) => {
  const normalized = status?.toUpperCase() || "ACTIVE";
  const classes = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-yellow-100 tex-red-700",
  }[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded text-sm ${classes}`}>
      {normalized}
    </span>
  );
};

// 🟢 Format raw data
const formatCampaigns = (data = []) =>
  data.map((item, index) => ({
    id: index + 1,
    name: item.campaignName || "Untitled Campaign",
    slot: item.timings || `${item.startTime} - ${item.endTime}`,
    bidAmount: item.baseBid ?? Math.floor(Math.random() * 10000 + 1000),
    status: item.isApproved || "ACTIVE",
    raw: item,
  }));

const BidManagement = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const list = campaigns?.data ?? [];
    setRows(formatCampaigns(list));
  }, [campaigns]);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const handleMoreOptions = (row) => {
    // Replace this with a dropdown/modal later
    alert(`More options for ${row.name}`);
  };

  const columns = [
    { id: "name", label: "Campaign Name" },
    { id: "slot", label: "Slot" },
    { id: "bidAmount", label: "Bid Amount", numeric: true },
    {
      id: "status",
      label: "Status",
      render: (row) => renderStatusBadge(row.status),
    },
    {
      id: "actions",
      label: "More Options",
      render: (row) => (
        <button
          onClick={() => handleMoreOptions(row)}
          className="text-blue-600 hover:underline"
        >
          Options
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Bid Management</h2>

      <ReusableTable
        columns={columns}
        rows={rows}
        loading={loading}
        onRefresh={() => dispatch(fetchCampaigns())}
        filterKey="status"
        filterOptions={["all", "ACTIVE","INACTIVE"]}
      />
    </div>
  );
};

export default BidManagement;
