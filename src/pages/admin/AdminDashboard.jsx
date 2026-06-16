import { useMemo, useEffect } from "react";
import StatCard from "../../components/card/StatCard";
import ReusableTable from "../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../redux/slices/admin/campaignSlice";
import { fetchAdminProfile } from "../../redux/slices/admin/adminSlice";
import ApprovalBadge from "../../components/ui/badges/ApprovalBadge";

const AdminDashboard  = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, } = useSelector(
    (state) => state.adminCampaign
  );


  const handleReferesh = () => {
    dispatch(fetchCampaigns());
  };

  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  const {
    pendingCampaigns,
    approvedCampaigns,
    totalApprovedRevenue,
    totalPendingBid,
  } = useMemo(() => {
    const approved = campaigns?.filter(
      (c) => c.isApproved?.toUpperCase() === "APPROVED"
    );
    const pending = campaigns.filter(
      (c) => c.isApproved?.toUpperCase() === "PENDING"
    );

    const totalApproved = approved.reduce(
      (sum, c) => sum + Number(c.baseBid || 0),
      0
    );

    const totalPending = pending.reduce(
      (sum, c) => sum + Number(c.baseBid || 0),
      0
    );

    return {
      approvedCampaigns: approved,
      pendingCampaigns: pending,
      totalApprovedRevenue: totalApproved,
      totalPendingBid: totalPending,
    };
  }, [campaigns]);

  const columns = [
    {
      id: "campaignCode",
      label: "Campaign ID",
      render: (row) => row.campaignCode || "N/A",
    },
    {
      id: "name",
      label: "Campaign Name",
      render: (row) => <span>{row.name}</span>,
    },
    {
      id: "brandName",
      label: "Brand Name",
    },
    {
      id: "schedule",
      label: "Schedule",
      render: (row) =>
        row.startTime && row.endTime
          ? `${row.startTime} - ${row.endTime}`
          : "N/A",
    },
    {
      id: "adType",
      label: "Ad Type",
    },
    {
      id: "baseBid",
      label: "Amount",
      render: (row) => `₹ ${row.baseBid} /-`,
    },
    {
      id: "isApproved",
      label: "Approval",
      render: (row) => <ApprovalBadge status={row.isApproved} size={11} />,
    },
  ];

  const statsData = [
    {
      title: "Pending Bids",
      value: "25.1k",
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-red-50 to-pink-100",
      description: "Total number of bids awaiting approval from retailers",
    },
    {
      title: "Open Requests",
      value: (totalPendingBid / 1000).toFixed(1) + "K",
      change: "+2.5%",
      currency: false,
      changeColor: "text-green-700",
      bgGradient: "bg-gradient-to-br from-white via-yellow-50 to-yellow-100",
      description: "Active campaign requests pending review",
    },
    {
      title: "Total Revenue",
      value: (totalApprovedRevenue / 1000).toFixed(1) + "K",
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      bgGradient: "bg-gradient-to-br from-white via-slate-50 to-blue-100",
      description: "Cumulative revenue from approved campaigns",
    },
  ];

  return (
    <div className="w-full">
      <div
        className="grid gap-4 w-full"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
      >
        {statsData.map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>
      <div className="mt-6">
        <ReusableTable
          isFilter={false}
          columns={columns}
          rows={pendingCampaigns}
          loading={loading}
          onRefresh={handleReferesh}
        />
      </div>
    </div>
  );
};

export default AdminDashboard ;
