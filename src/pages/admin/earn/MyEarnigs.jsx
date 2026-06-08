import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRevenue } from "../../../api/admin/admin-api/admin-api";
import { getAllRevenueHistory } from "../../../redux/slices/admin/adminRevenueSlice";
import ReusableTable from "../../../components/table/ReusableTable"; 
import  {Modal} from "../../../components/ui/modal/Modal"

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

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Revenue
        </h1>
        <p className="mt-2 text-gray-600">
          Overview of your earnings and transactions
        </p>
      </header>

      {/* Summary */}
      <section className="w-full gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center p-6 bg-white rounded-xl shadow">
            <div className="p-3 bg-green-100 rounded-full mr-4">💰</div>
            <div>
              <p className="text-gray-600 font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue?.totalRevenue ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">All-time revenue</p>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white rounded-xl shadow">
            <div className="p-3 bg-blue-100 rounded-full mr-4">📅</div>
            <div>
              <p className="text-gray-600 font-medium">Monthly Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹
                {revenue?.monthlyRevenue?.[0]?.totalRevenue?.toLocaleString() ??
                  0}
              </p>
            </div>
          </div>
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
      >
        {selectedTransaction && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Transaction Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Campaign:</strong>{" "}
                {selectedTransaction.campaignName} ({selectedTransaction.campaignCode})
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedTransaction.amount}
              </p>
              <p>
                <strong>Business:</strong> {selectedTransaction.businessName}
              </p>  
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default AdminMyEarnings;