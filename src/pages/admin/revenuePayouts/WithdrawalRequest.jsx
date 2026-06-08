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
    <div className="p-6">
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
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="md">
        {selectedRow && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Withdrawal Request
            </h2>

            {/* Content */}

            <div className="divide-y divide-gray-100 text-sm">
              {/* Request Code */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Request Code
                </span>
                <span className="text-gray-800 font-medium">
                  {selectedRow.withdrawalRequestCode}
                </span>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Name
                </span>
                <span className="text-gray-800">{selectedRow.name}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Amount
                </span>
                <span className="text-gray-900 font-semibold text-base">
                  ₹{selectedRow.amount}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Payment Method
                </span>
                <span className="text-gray-800 uppercase">
                  {selectedRow.paymentMethod}
                </span>
              </div>

              {/* UPI ID */}
              {selectedRow?.upiId && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    UPI ID
                  </span>
                  <span className="text-gray-800">{selectedRow.upiId}</span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Status
                </span>
                <ApprovalBadge status={selectedRow.isApproved} size={12} />
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-xs uppercase tracking-wide">
                  Date
                </span>
                <span className="text-gray-800">
                  {moment(selectedRow.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>

              {/* Show rejection remark if rejected */}
              {selectedRow.isApproved === "REJECTED" && selectedRow.remark && (
                <div className="flex flex-col">
                  <span className="text-gray-500">Remark</span>
                  <span className="mt-1 px-1 py-2 bg-gray-100 rounded">
                    {selectedRow.remark || " "}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons (only when pending) */}
            {selectedRow.isApproved === "PENDING" && (
              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-4 py-2 cursor-pointer rounded-md bg-red-100 hover:bg-red-200 text-red-700 transition duration-150 "
                >
                  REJECT
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedRow.id, "APPROVED")}
                  className="px-5 py-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  APPROVE
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

