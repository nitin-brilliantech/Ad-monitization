import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import moment from "moment";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPayouts,
  updateWithdrawStatus,
} from "../../../redux/slices/admin/payoutSlice";
import Toast from "../../../components/ui/toast/Toast";
import RejectWithdrawalModal from "./RejectWithdrawalRequest";
import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge";

const WithdrawalRequest = () => {
  const dispatch = useDispatch();
  const { payouts, loading } = useSelector((state) => state.payout);

  const filteredPayouts = payouts.filter((c) => c.isPaid === false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Reject modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    dispatch(fetchPayouts());
  }, [dispatch]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleStatusUpdate = async (withdrawalId, status, remarkText = "") => {
    try {
      await dispatch(
        updateWithdrawStatus({ id: withdrawalId, status, remark: remarkText })
      ).unwrap();

      if (status === "APPROVED") {
        Toast.success("Success", "Withdrawal request approved!");
      } else if (status === "REJECTED") {
        Toast.error("Rejected", "Withdrawal request rejected!");
      }

      dispatch(fetchPayouts()); // ✅ always refetch from backend
      handleCloseModal();
    } catch (error) {
      Toast.error(
        "Error",
        error?.message || "Failed to update withdrawal status"
      );
    }
  };

  const columns = [
    { id: "withdrawalRequestCode", label: "Request Code" },
    { id: "name", label: "Name" },
    {
      id: "amount",
      label: "Amount",
      numeric: true,
      render: (row) => `₹ ${row.amount}`,
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      render: (row) => <span>{row.paymentMethod.toUpperCase()}</span>,
    },
    {
      id: "isApproved",
      label: "Status",
      render: (row) => <ApprovalBadge status={row.isApproved} size={11} />,
    },
    {
      id: "updatedAt",
      label: "Date",
      render: (row) => (
        <span>{moment(row.updatedAt).format("DD/MM/YYYY")}</span>
      ),
    },
  ];

  return (
    <div className="">
      <Typography variant="h5" fontWeight={600} mb={3}>
        Withdrawal Requests
      </Typography>

      <ReusableTable
        columns={columns}
        rows={filteredPayouts}
        onRowClick={handleRowClick}
        filterKey="isApproved"
        filterOptions={["all", "APPROVED", "PENDING", "REJECTED"]}
        onRefresh={() => dispatch(fetchPayouts())}
        loading={loading}
        searchableColumns={[
          "withdrawalRequestCode",
          "name",
          "amount",
          "updatedAt",
          "paymentMethod",
        ]}
      />

      {/* Main Details Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="md" showCloseButton={true}>
        {selectedRow && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
              <div className="flex gap-4">
                <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Withdrawal Request</h2>
                  <p className="text-md text-white/70 mt-0.5">Request details and status</p>
                </div>
              </div>
              <ApprovalBadge status={selectedRow.isApproved} size={12} />
            </div>

            {/* Content */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Request Code</span>
                <span className="text-sm text-gray-700">{selectedRow.withdrawalRequestCode}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Name</span>
                <span className="text-sm text-gray-700">{selectedRow.name}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Amount</span>
                <span className="text-sm text-gray-900 font-bold">₹{selectedRow.amount}</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Payment Method</span>
                <span className="text-sm text-gray-700 uppercase">{selectedRow.paymentMethod}</span>
              </div>

              {selectedRow?.upiId && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="font-semibold text-md text-gray-900">UPI ID</span>
                  <span className="text-sm text-gray-700">{selectedRow.upiId}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="font-semibold text-md text-gray-900">Date</span>
                <span className="text-sm text-gray-700">{moment(selectedRow.createdAt).format("DD/MM/YYYY")}</span>
              </div>

              {/* Show rejection remark if rejected */}
              {selectedRow.isApproved === "REJECTED" && selectedRow.remark && (
                <div className="pb-3 border-b border-gray-100">
                  <span className="font-semibold text-md text-gray-900 block mb-2">Rejection Remark</span>
                  <div className="px-3 py-2 bg-red-50 rounded-md text-sm text-gray-700">
                    {selectedRow.remark}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons (only when pending) */}
            {selectedRow.isApproved === "PENDING" && (
              <div className="flex gap-3 pt-4 border-t border-blue-100 justify-end">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-5 py-2 cursor-pointer rounded-full bg-red-100 hover:bg-red-200 text-red-700 transition duration-150 text-sm font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedRow.id, "APPROVED")}
                  className="px-5 py-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition text-sm font-medium cursor-pointer"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <RejectWithdrawalModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRemark("");
        }}
        remark={remark}
        setRemark={setRemark}
        onSubmit={() => {
          handleStatusUpdate(selectedRow.id, "REJECTED", remark);
          setIsRejectModalOpen(false);
          setRemark(""); // ✅ clear after submit
        }}
      />
    </div>
  );
};

export default WithdrawalRequest;

