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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        {selectedTransaction ? (
          <div className="p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedTransaction.campaignName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Campaign Code:</span>{" "}
                {selectedTransaction.campaignCode}
              </p>
              <p>
                <span className="font-semibold">Transaction ID:</span>{" "}
                {selectedTransaction.transactionId}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedTransaction.status === true
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedTransaction.status === true ? "Paid" : "Failed"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Amount:</span>{" "}
                {selectedTransaction.currency}{" "}
                {selectedTransaction.amount.toLocaleString()}.00
              </p>
              <p>
                <span className="font-semibold">Payment Date:</span>{" "}
                {new Date(selectedTransaction.paymentDate).toLocaleDateString()}
              </p>
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