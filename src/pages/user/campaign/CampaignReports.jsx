import React, { useEffect, useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import Button from "../../../components/ui/button/Button";

const CampaignReports = () => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaign);
  const [rows, setRows] = useState([]);

  // Fetch data initially
  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  // Refresh function for the table refresh icon
  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  // Export handler
  const handleExport = (row) => {
    alert(`Exporting report for: ${row.name} (${row.campaignCode})`);
    // You can add CSV export or API call here
  };

  // Format campaign data into table rows
  useEffect(() => {
    if (campaigns?.data?.length > 0) {
      const formatted = campaigns.data.map((item, index) => ({
        id: index + 1,
        campaignCode: item.campaignCode,
        name: item.campaignName || "Untitled Campaign",
        impressions: item.impressions || Math.floor(Math.random() * 10000 + 1000),
        clicks: item.clicks || Math.floor(Math.random() * 5000 + 500),
        conversions: item.conversions || Math.floor(Math.random() * 1000 + 100),
        cost: item.baseBid || Math.floor(Math.random() * 50000 + 5000),
        roi: `${Math.floor(Math.random() * 100)}%`,
        raw: item,
      }));
      setRows(formatted);
    }
  }, [campaigns]);

  // Table column definitions
  const columns = [
    {
      id: "campaignCode",
      label: "Campaign ID",
      numeric: false,
      renderCell: (row) => <span>{row.campaignCode}</span>,
    },
    {
      id: "name",
      label: "Campaign Name",
      numeric: false,
      renderCell: (row) => <span>{row.name}</span>,
    },
    { id: "impressions", label: "Impressions", numeric: true },
    { id: "clicks", label: "Clicks", numeric: true },
    { id: "conversions", label: "Conversions", numeric: true },
    { id: "cost", label: "Cost", numeric: true },
    { id: "roi", label: "ROI", numeric: true },
    {
      id: "export",
      label: "Export",
      renderCell: (row) => (
        <Button
          onClick={() => handleExport(row)}
          className="text-blue-600 hover:underline"
          label="Export"
        >
          Export
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Campaign Reports</h2>
      <ReusableTable
        columns={columns}
        rows={rows}
        loading={loading}
        onRefresh={refreshCampaigns}
        isFilter={false}
      />
    </div>
  );
};

export default CampaignReports;