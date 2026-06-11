import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaignPayments } from "../../../redux/slices/user/campaignSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import {Modal} from "../../../components/ui/modal/Modal";

const PaymentsHistory = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { payments, paymentsFetched, paymentsLoading } = useSelector(
    (state) => state.campaign
  );

  useEffect(() => {
    if (!paymentsFetched) {
      dispatch(fetchCampaignPayments());
    }
  }, [dispatch, paymentsFetched]);
  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };
  const columns = [
    { id: "campaignCode", label: "Campaign Code" },
    { id: "campaignName", label: "Campaign Name" },
    { id: "transactionId", label: "Transaction ID" },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            row.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status ? "Paid" : "Failed"}
        </span>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      render: (row) =>
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: row.currency || "INR",
        }).format(row.amount),
    },
    {
      id: "paymentDate",
      label: "Payment Date",
      render: (row) => new Date(row.paymentDate).toLocaleDateString(),
    },
  ];

  const handleReferesh = () => {
    dispatch(fetchCampaignPayments());
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Payments History</h2>

      <ReusableTable
        onRowClick={handleRowClick}
        onRefresh={handleReferesh}
        columns={columns}
        loading={paymentsLoading}
        rows={payments}
        isFilter={false}
        searchableColumns={["campaignCode", "campaignName", "transactionId","amount"]}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md" showCloseButton={true}>
        {selectedTransaction ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
              <div className="flex gap-4">
                <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Payment Details</h2>
                  <p className="text-md text-white/70 mt-0.5">Transaction information</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Campaign Name</span>
                <span className="text-sm text-gray-700">{selectedTransaction.campaignName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Campaign Code</span>
                <span className="text-sm text-gray-700">{selectedTransaction.campaignCode}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Transaction ID</span>
                <span className="text-sm text-gray-700">{selectedTransaction.transactionId}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedTransaction.status === true
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedTransaction.status === true ? "Paid" : "Failed"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Amount</span>
                <span className="text-sm text-gray-900 font-bold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: selectedTransaction.currency || "INR",
                  }).format(selectedTransaction.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Payment Date</span>
                <span className="text-sm text-gray-700">
                  {new Date(selectedTransaction.paymentDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No transaction selected</p>
        )}
      </Modal>
    </>
  );
};

export default PaymentsHistory;