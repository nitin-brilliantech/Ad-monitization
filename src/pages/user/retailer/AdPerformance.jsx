import React, { useEffect, useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { Link, Outlet,useLocation } from "react-router-dom";

const generateRandomAdPerformanceData = (count = 15) => {
  const campaigns = [
    "Diwali Sale Campaign",
    "Winter Essentials Drive",
    "Back to School Promo",
    "New Year Bonanza",
    "Summer Splash Offers",
    "Fitness Awareness Ad",
    "Tech Launch Week",
    "Grocery Festive Deals",
    "Luxury Watch Promo",
    "Electronics Mega Event",
  ];

  const images = [
    "https://picsum.photos/id/1011/400/300",
    "https://picsum.photos/id/1025/400/300",
    "https://picsum.photos/id/1033/400/300",
    "https://picsum.photos/id/1040/400/300",
    "https://picsum.photos/id/1052/400/300",
    "https://picsum.photos/id/1069/400/300",
    "https://picsum.photos/id/1074/400/300",
    "https://picsum.photos/id/1080/400/300",
    "https://picsum.photos/id/1084/400/300",
    "https://picsum.photos/id/109/400/300",
  ];

  const getRandomDateRange = () => {
    const start = new Date(
      2025,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    const end = new Date(start);
    end.setDate(start.getDate() + Math.floor(Math.random() * 5) + 1);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    campaignName: campaigns[Math.floor(Math.random() * campaigns.length)],
    campaignImage: images[Math.floor(Math.random() * images.length)],
    dates: getRandomDateRange(),
    impressions: Math.floor(Math.random() * 5000 + 1000), // 1K to 6K
    earningPerImpression: (Math.random() * 2 + 0.5).toFixed(2), // ₹0.5 to ₹2.5
  }));
};

const AdPerformance = () => {
  const [rows, setRows] = useState([]);
  const [isAna, setIsAna] = useState(false);
  const locations =useLocation()
  const isViewAnalytics = location.pathname.includes("view-analytics");

  useEffect(() => {
    const mockData = generateRandomAdPerformanceData(20);
    setRows(mockData);
  }, []);

  const columns = [
    {
      id: "campaignName",
      label: "Campaign Name",
      render: (row) => {
        return (
          <div>
            <Link
              to="view-analytics"
              state={{ row} }
              className="flex items-center justify-between"
            >
              <img src={row.campaignImage} alt="" className="w-10 h-12 p-1" />
              <span>{row.campaignName}</span>
            </Link>
          </div>
        );
      },
    },
    { id: "dates", label: "Dates" },
    {
      id: "impressions",
      label: "Impressions",
      numeric: true,
      render: (row) => {
        return <span>{row.impressions} Clicks</span>;
      },
    },
    {
      id: "earningPerImpression",
      label: "Earning/Impression (₹)",
      numeric: true,
      render: (row) => {
        return (
          <span className="text-[#657F5D]">₹{row.earningPerImpression}</span>
        );
      },
    },
  ];

  return (
    <div>
      {isViewAnalytics ? (
        <Outlet />
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Ad Performance</h2>
          <ReusableTable columns={columns} rows={rows} />
        </>
      )}
    </div>
  );
};

export default AdPerformance;
