import React, { useEffect, useState } from "react";
import StatCard from "../../../components/card/StatCard";
import Button from "../../../components/ui/button/Button";
import SideCard from "../../../components/card/SideCard";
import AreaCharts from "../../../components/charts/AreaCharts";
import { useLocation, useNavigate } from "react-router-dom";
import  Breadcrumbs  from "../../../components/ui/bread-crumb/Breadcrumbs";



const ProductAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const data ={...location.state?.row};




  const [selected, setSelected] = useState("Day");
  const options = ["Day", "Week", "Month"];
 const topSellers = [
  {
    image: "https://picsum.photos/id/237/48", 
    title: "Wireless Headphones",
    value: 1250,
  },
  {
    image: "https://picsum.photos/id/238/48", // Another Picsum URL
    title: "Smartwatch Pro X",
    value: 980,
  },
  {
    image: "https://picsum.photos/id/239/48", // Another Picsum URL
    title: "Bluetooth Speaker",
    value: 730,
  },
  {
    image: "https://picsum.photos/id/240/48", // Another Picsum URL
    title: "4K Action Camera",
    value: 1100,
  },
  {
    image: "https://picsum.photos/id/241/48", // Another Picsum URL
    title: "Gaming Mouse",
    value: 890,
  },
];

  const chartData = [
    { day: "Mon", count: 30 },
    { day: "Tue", count: 35 },
    { day: "Wed", count: 30 },
    { day: "Thu", count: 45 },
    { day: "Fri", count: 35 },
    { day: "Sat", count: 50 },
    { day: "Sun", count: 30 },
  ];


useEffect(() => {
    // Prevent direct access if state is missing
    if (!location.state?.row) {
      navigate("/ad-performance"); // or navigate(-1)
    }
  }, [location.state, navigate]);

  if (!location.state?.row) return <div>Redirecting...</div>;


  return (
    <div>
      <div>
        <div className="flex space-x-2 items-center p-1">
         <img src={data?.campaignImage} alt="" className="w-10 h-12 p-1"/>
          <span>{data?.campaignName}</span>
        </div>
        <div>
          <p>
            <Breadcrumbs />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value="235900.45"
          change="+15%"
          bgGradient={"bg-gradient-to-l from-red-100 to-gray-50"}
          currency={true}
        />
        <StatCard
          title="Views"
          value="368232901"
          change="+62.5%"
          bgGradient="bg-gradient-to-l from-amber-100 to-gray-50"
        />
        <StatCard
          title="Data Usage"
          value="62.1$"
          change="+15%"
          bgGradient="bg-gradient-to-l from-gray-100 to-gray-50"
        />
      </div>

      <div className="flex space-x-2">
        <div className="w-2/3 bg-gray-50 h-[500px] rounded-lg shadow-lg flex flex-col">
          <div className="border-b border-gray-300 p-4">
            <div className="mb-2 w-full flex justify-between">
              <span className="text-gray-900 font-semibold text-lg lg:text-xl">
                Clicks
              </span>
              <div className="flex items-center rounded-lg">
                {options.map((option) => (
                  <Button
                    key={option}
                    label={option}
                    className={`rounded-none ${
                      selected === option ? "" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setSelected(option)}
                    type="button"
                    loading={false}
                    disabled={false}
                    isIcon={false}
                  />
                ))}
              </div>
            </div>
          </div>
          <AreaCharts
            data={chartData}
            fillColor="#b3b3b3"
            strokeColor="#b3b3b3"
            strokeDasharray="5 5"
            yDomain={[0, 100]}
            yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          />
        </div>
        <div className="w-1/2 bg-gray-50 h-[500px] rounded-lg shadow-lg">
          <SideCard ads={topSellers} title={"Total Salers"} units={"Orders"} />
        </div>
      </div>
      <div className="w-full max-w-screen bg-gray-50 h-[500px] rounded shadow mt-4">
          <div className="border-b border-gray-300 px-4 py-2">
            <div className="mb-2 w-full flex justify-between">
              <span className="text-gray-900 font-semibold text-lg lg:text-xl">
                ROI
              </span>
              <div className="flex items-center rounded-lg">
                {options.map((option) => (
                  <Button
                    key={option}
                    label={option}
                    className={`rounded-none ${
                      selected === option ? "" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setSelected(option)}
                    type="button"
                    loading={false}
                    disabled={false}
                    isIcon={false}
                  />
                ))}
              </div>
            </div>
          </div>
          <AreaCharts
            data={chartData}
            fillColor="#3561bd"
            strokeColor="#445E94"
            strokeDasharray="5 5"
            yDomain={[0, 100]}
            yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          />
      </div>
    </div>
  );
};

export default ProductAnalytics;
