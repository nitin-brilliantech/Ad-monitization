import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRevenue } from "../../../api/admin/admin-api/admin-api";
import { getAllRevenueHistory } from "../../../redux/slices/admin/adminRevenueSlice";
import ReusableTable from "../../../components/table/ReusableTable"; 
import  {Modal} from "../../../components/ui/modal/Modal"
import StatCard from "../../../components/card/StatCard";

const AdminMyEarnings = () => {
  const dispatch = useDispatch();
  const { revenueHistory, loading, error, fetched } = useSelector(
    (state) => state.adminRevenue
  );

  const [revenue, setRevenue] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch revenue summary
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await getRevenue();
        setRevenue(data);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };
    fetchRevenue();
  }, []);

  // Fetch revenue history
  useEffect(() => {
    if (!fetched) {
      dispatch(getAllRevenueHistory());
    }
  }, [dispatch, fetched]);

  // Table columns
  const columns = [
    { id: "createdAt", label: "Date" },
    {
      id: "campaignName",
      label: "Campaign",
      render: (row) => `${row.campaignName} (${row.campaignCode})`,
    },
    {
      id: "amount",
      label: "Amount",
      numeric: true,
      render: (row) => `₹${row.amount}`,
    },
    { id: "businessName", label: "Business" },
  ];

  const statsData = [
    {
      title: "Total Earnings",
      value: revenue?.totalRevenue ?? 0,
      change: "+15%",
      currency: true,
      changeColor: "text-green-600",
      description: "All-time revenue from campaigns",
    },
    {
      title: "Monthly Earnings",
      value: revenue?.monthlyRevenue?.[0]?.totalRevenue?.toLocaleString() ?? 0,
      change: "+8%",
      currency: true,
      changeColor: "text-green-600",
      description: "Revenue earned this month",
    },
  ];

  return (
    <div className="w-full">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Revenue
        </h1>
        <p className="mt-2 text-gray-600">
          Overview of your earnings and transactions
        </p>
      </header>

      {/* Summary */}
      <section className="w-full mb-6">
        <div
          className="grid gap-4 w-full"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}
        >
          {statsData.map((item, index) => (
            <StatCard key={index} {...item} />
          ))}
        </div>
      </section>

      {/* Transactions */}
      <section className="w-full mt-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Transactions
          </h2>

          <ReusableTable
            columns={columns}
            rows={revenueHistory}
            loading={loading}
            onRefresh={() => dispatch(getAllRevenueHistory())}
            searchableColumns={["campaignName", "campaignCode", "businessName","amount"]}
            defaultOrder="desc"
            defaultOrderBy="createdAt"
            isFilter={false}
            onRowClick={(row) => setSelectedTransaction(row)} // 👈 open modal
          />

          {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        </div>
      </section>

      {/* Transaction Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        size="md"
        showCloseButton={true}
      >
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
              <div className="flex gap-4">
                <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                  <p className="text-md text-white/70 mt-0.5">Revenue transaction information</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Date</span>
                <span className="text-sm text-gray-700">{new Date(selectedTransaction.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Campaign</span>
                <span className="text-sm text-gray-700">{selectedTransaction.campaignName} ({selectedTransaction.campaignCode})</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Amount</span>
                <span className="text-sm text-gray-900 font-bold">₹{selectedTransaction.amount}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Business</span>
                <span className="text-sm text-gray-700">{selectedTransaction.businessName}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminMyEarnings;